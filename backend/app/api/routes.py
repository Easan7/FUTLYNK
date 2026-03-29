from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.app.schemas import PingResponse
from backend.app.supabase_client import get_supabase

router = APIRouter(prefix="/api/v1", tags=["api"])
DEFAULT_USER_ID = "u-me"


class UserRequest(BaseModel):
    user_id: str = DEFAULT_USER_ID


class CreateGroupRequest(BaseModel):
    user_id: str = DEFAULT_USER_ID
    name: str
    member_ids: list[str] = Field(default_factory=list)


class ChatMessageRequest(BaseModel):
    user_id: str = DEFAULT_USER_ID
    text: str


class FriendRequestBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    friend_id: str


class ProfileUpdateBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    display_name: str
    username: str
    avatar_id: str = "pitch"
    selected_tags: list[str] = Field(default_factory=list)
    selected_achievements: list[str] = Field(default_factory=list)


class MarkNotificationBody(BaseModel):
    user_id: str = DEFAULT_USER_ID


class TopupBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    amount: float


class RedeemBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    voucher_id: str


class RecurringAvailabilityBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    days: list[str]
    from_time: str
    to_time: str


class SpecificAvailabilityBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    date_value: str
    time_value: str


class FeedbackItem(BaseModel):
    rated_user_id: str
    stars: int = Field(ge=1, le=5)
    flagged_sportsmanship: bool = False


class FeedbackSubmitBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    ratings: list[FeedbackItem]


def _time_ago(iso_value: str | None) -> str:
    if not iso_value:
        return "just now"
    try:
        dt = datetime.fromisoformat(iso_value.replace("Z", "+00:00"))
    except ValueError:
        return "just now"
    now = datetime.now(dt.tzinfo)
    delta = now - dt
    minutes = int(delta.total_seconds() // 60)
    if minutes < 1:
        return "just now"
    if minutes < 60:
        return f"{minutes}m ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours}h ago"
    days = hours // 24
    return f"{days}d ago"


def _format_date(date_value: str | date) -> str:
    if isinstance(date_value, date):
        parsed = date_value
    else:
        parsed = date.fromisoformat(str(date_value))
    return parsed.strftime("%a, %b %d").replace(" 0", " ")


def _format_time(time_value: str) -> str:
    raw = str(time_value)[:5]
    parsed = datetime.strptime(raw, "%H:%M")
    return parsed.strftime("%I:%M %p").lstrip("0")


def _week_tag(date_value: str | date) -> str:
    if isinstance(date_value, date):
        parsed = date_value
    else:
        parsed = date.fromisoformat(str(date_value))
    diff = (parsed - date.today()).days
    return "This week" if diff <= 6 else "Next week"


def _require_user(user_id: str) -> dict[str, Any]:
    db = get_supabase()
    response = db.table("app_users").select("*").eq("id", user_id).limit(1).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]


def _get_players_map() -> dict[str, dict[str, Any]]:
    db = get_supabase()
    players = db.table("app_users").select("*").execute().data or []
    return {p["id"]: p for p in players}


def _get_games_with_counts() -> tuple[list[dict[str, Any]], dict[str, int]]:
    db = get_supabase()
    games = (
        db.table("games")
        .select("*")
        .neq("status", "cancelled")
        .order("game_date")
        .order("start_time")
        .execute()
        .data
        or []
    )
    participants = db.table("game_participants").select("game_id").execute().data or []
    counts: dict[str, int] = defaultdict(int)
    for row in participants:
        counts[row["game_id"]] += 1
    return games, counts


def _game_to_room(game: dict[str, Any], joined: int) -> dict[str, Any]:
    return {
        "id": game["id"],
        "title": game.get("title", "Open Game"),
        "location": game["location"],
        "date": _format_date(game["game_date"]),
        "time": _format_time(game["start_time"]),
        "distanceKm": float(game.get("distance_km") or 0),
        "price": float(game.get("price") or 0),
        "playersJoined": joined,
        "maxPlayers": int(game.get("max_players") or 10),
        "allowedBand": game.get("allowed_band"),
        "hiddenAvgRating": float(game.get("hidden_avg_rating") or 3.0),
        "hiddenRatingSpread": float(game.get("hidden_rating_spread") or 0.5),
        "weekTag": _week_tag(game["game_date"]),
        "matchingAvailability": bool(game.get("matching_availability") or False),
        "status": game.get("status"),
    }


@router.get("/ping", response_model=PingResponse)
def ping() -> PingResponse:
    return PingResponse(message="pong")


@router.get("/app/home")
def home_data(user_id: str = DEFAULT_USER_ID):
    user = _require_user(user_id)
    games, counts = _get_games_with_counts()
    db = get_supabase()

    memberships = (
        db.table("game_participants").select("game_id").eq("user_id", user_id).execute().data
        or []
    )
    game_ids = {m["game_id"] for m in memberships}
    upcoming = [_game_to_room(g, counts.get(g["id"], 0)) for g in games if g["id"] in game_ids and g.get("status") == "open"]

    pending_feedback = (
        db.table("games")
        .select("id,location,game_date")
        .eq("status", "completed")
        .order("game_date", desc=True)
        .limit(3)
        .execute()
        .data
        or []
    )

    return {
        "currentUser": {
            "id": user["id"],
            "name": user["display_name"],
            "publicSkillBand": user["public_skill_band"],
            "hiddenSkillRating": float(user.get("hidden_skill_rating") or 3.0),
            "reliabilityScore": int(user.get("reliability_score") or 0),
            "gamesPlayed": int(user.get("games_played") or 0),
            "streakWeeks": int(user.get("streak_weeks") or 0),
        },
        "upcomingGames": upcoming,
        "pendingRatings": [
            {
                "id": item["id"],
                "location": item["location"],
                "date": _format_date(item["game_date"]),
            }
            for item in pending_feedback
        ],
    }


@router.get("/rooms/discover")
def discover_rooms(user_id: str = DEFAULT_USER_ID, use_availability: bool = True):
    user = _require_user(user_id)
    games, counts = _get_games_with_counts()

    recurring_rules = (
        get_supabase()
        .table("user_availability")
        .select("weekdays,time_from,time_to")
        .eq("user_id", user_id)
        .eq("rule_type", "recurring")
        .execute()
        .data
        or []
    )

    def matches_availability(game: dict[str, Any]) -> bool:
        if not recurring_rules:
            return bool(game.get("matching_availability"))
        game_day = date.fromisoformat(str(game["game_date"])).strftime("%a")
        game_time = str(game["start_time"])[:5]
        for rule in recurring_rules:
            days = rule.get("weekdays") or []
            if game_day not in days:
                continue
            start = str(rule.get("time_from") or "00:00")[:5]
            end = str(rule.get("time_to") or "23:59")[:5]
            if start <= game_time <= end:
                return True
        return False

    rooms = []
    for game in games:
        if game.get("status") != "open":
            continue
        if use_availability and not matches_availability(game):
            continue
        room = _game_to_room(game, counts.get(game["id"], 0))
        distance = abs(room["hiddenAvgRating"] - float(user.get("hidden_skill_rating") or 3.0))
        room["fitScore"] = max(30, round(100 - distance * 30 - room["distanceKm"] * 6))
        rooms.append(room)

    rooms.sort(key=lambda r: r["fitScore"], reverse=True)
    return {"rooms": rooms}


@router.get("/rooms/{room_id}")
def room_detail(room_id: str, user_id: str = DEFAULT_USER_ID):
    db = get_supabase()
    games = db.table("games").select("*").eq("id", room_id).limit(1).execute().data or []
    if not games:
        raise HTTPException(status_code=404, detail="Room not found")

    game = games[0]
    participants = db.table("game_participants").select("*").eq("game_id", room_id).execute().data or []
    players_map = _get_players_map()

    roster = []
    for p in participants:
        player = players_map.get(p["user_id"])
        if not player:
            continue
        roster.append(
            {
                "id": player["id"],
                "name": player["display_name"],
                "publicSkillBand": player["public_skill_band"],
                "reliabilityScore": int(player.get("reliability_score") or 0),
                "joinedViaGroupId": p.get("joined_via_group_id"),
            }
        )

    messages = (
        db.table("messages")
        .select("id,user_id,body,created_at")
        .eq("context_type", "game")
        .eq("context_id", room_id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
        .data
        or []
    )

    chat = [
        {
            "id": str(m["id"]),
            "user": players_map.get(m["user_id"], {}).get("display_name", "Player"),
            "text": m["body"],
            "time": _time_ago(m.get("created_at")),
        }
        for m in messages
    ]

    is_joined = any(p["user_id"] == user_id for p in participants)

    return {
        "room": _game_to_room(game, len(participants)),
        "roster": roster,
        "chat": chat,
        "isJoined": is_joined,
    }


@router.post("/rooms/{room_id}/join")
def join_room(room_id: str, body: UserRequest):
    db = get_supabase()
    game = db.table("games").select("id,max_players,status").eq("id", room_id).limit(1).execute().data
    if not game:
        raise HTTPException(status_code=404, detail="Room not found")
    row = game[0]
    if row.get("status") != "open":
        raise HTTPException(status_code=400, detail="Room is not open")

    participants = db.table("game_participants").select("user_id").eq("game_id", room_id).execute().data or []
    if any(p["user_id"] == body.user_id for p in participants):
        return {"ok": True, "joined": True}
    if len(participants) >= int(row.get("max_players") or 10):
        raise HTTPException(status_code=400, detail="Room is full")

    db.table("game_participants").insert({"game_id": room_id, "user_id": body.user_id}).execute()
    return {"ok": True, "joined": True}


@router.post("/rooms/{room_id}/leave")
def leave_room(room_id: str, body: UserRequest):
    get_supabase().table("game_participants").delete().eq("game_id", room_id).eq("user_id", body.user_id).execute()
    return {"ok": True, "joined": False}


@router.post("/rooms/{room_id}/chat")
def post_room_chat(room_id: str, body: ChatMessageRequest):
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message is empty")
    get_supabase().table("messages").insert(
        {
            "context_type": "game",
            "context_id": room_id,
            "user_id": body.user_id,
            "body": text,
        }
    ).execute()
    return {"ok": True}


@router.get("/groups")
def get_groups(user_id: str = DEFAULT_USER_ID):
    db = get_supabase()
    memberships = db.table("group_members").select("group_id").eq("user_id", user_id).execute().data or []
    group_ids = [m["group_id"] for m in memberships]
    if not group_ids:
        return {"groups": []}

    groups = db.table("groups").select("*").in_("id", group_ids).order("created_at").execute().data or []
    members = db.table("group_members").select("group_id,user_id").in_("group_id", group_ids).execute().data or []
    slots = (
        db.table("group_availability_slots")
        .select("group_id,slot_label")
        .in_("group_id", group_ids)
        .execute()
        .data
        or []
    )

    member_count: dict[str, int] = defaultdict(int)
    for row in members:
        member_count[row["group_id"]] += 1

    slot_counts: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for s in slots:
        slot_counts[s["group_id"]][s["slot_label"]] += 1

    formatted = []
    for g in groups:
        overlaps = sorted(slot_counts[g["id"]].items(), key=lambda t: t[1], reverse=True)
        top_slot = overlaps[0][0] if overlaps else "Pending"
        formatted.append(
            {
                "id": g["id"],
                "name": g["name"],
                "memberCount": member_count[g["id"]],
                "topOverlap": top_slot,
            }
        )

    return {"groups": formatted}


@router.get("/groups/{group_id}")
def get_group_detail(group_id: str, user_id: str = DEFAULT_USER_ID):
    db = get_supabase()
    groups = db.table("groups").select("*").eq("id", group_id).limit(1).execute().data or []
    if not groups:
        raise HTTPException(status_code=404, detail="Group not found")

    members = db.table("group_members").select("user_id").eq("group_id", group_id).execute().data or []
    member_ids = [m["user_id"] for m in members]
    players = db.table("app_users").select("*").in_("id", member_ids).execute().data or []
    players_map = {p["id"]: p for p in players}

    slots_rows = (
        db.table("group_availability_slots")
        .select("slot_label,user_id")
        .eq("group_id", group_id)
        .execute()
        .data
        or []
    )
    slot_groups: dict[str, list[str]] = defaultdict(list)
    for row in slots_rows:
        slot_groups[row["slot_label"]].append(row["user_id"])

    overlap = [
        {"slot": slot, "count": len(ids), "memberIds": ids}
        for slot, ids in slot_groups.items()
    ]
    overlap.sort(key=lambda x: x["count"], reverse=True)

    games, counts = _get_games_with_counts()
    avg_skill = 3.0
    if players:
        avg_skill = sum(float(p.get("hidden_skill_rating") or 3.0) for p in players) / len(players)

    recommendations = []
    for game in games:
        if game.get("status") != "open":
            continue
        room = _game_to_room(game, counts.get(game["id"], 0))
        fit = max(50, round(100 - abs(avg_skill - room["hiddenAvgRating"]) * 24 - room["hiddenRatingSpread"] * 12))
        recommendations.append({"room": room, "fitScore": fit})
    recommendations.sort(key=lambda x: x["fitScore"], reverse=True)

    messages = (
        db.table("messages")
        .select("id,user_id,body,created_at")
        .eq("context_type", "group")
        .eq("context_id", group_id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
        .data
        or []
    )

    return {
        "group": {"id": groups[0]["id"], "name": groups[0]["name"], "memberIds": member_ids},
        "members": [
            {
                "id": p["id"],
                "name": p["display_name"],
                "publicSkillBand": p["public_skill_band"],
                "hiddenSkillRating": float(p.get("hidden_skill_rating") or 3.0),
            }
            for p in players
        ],
        "overlapSlots": overlap[:3],
        "recommendations": recommendations[:3],
        "chat": [
            {
                "id": str(m["id"]),
                "user": players_map.get(m["user_id"], {}).get("display_name", "Player"),
                "text": m["body"],
                "time": _time_ago(m.get("created_at")),
            }
            for m in messages
        ],
    }


@router.post("/groups")
def create_group(body: CreateGroupRequest):
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Group name is required")

    group_id = f"g-{int(datetime.utcnow().timestamp())}"
    db = get_supabase()
    db.table("groups").insert({"id": group_id, "name": name, "created_by": body.user_id}).execute()

    member_ids = sorted(set([body.user_id, *body.member_ids]))
    payload = [
        {"group_id": group_id, "user_id": member_id, "role": "owner" if member_id == body.user_id else "member"}
        for member_id in member_ids
    ]
    db.table("group_members").insert(payload).execute()
    return {"ok": True, "groupId": group_id}


@router.post("/groups/{group_id}/chat")
def post_group_chat(group_id: str, body: ChatMessageRequest):
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message is empty")
    get_supabase().table("messages").insert(
        {
            "context_type": "group",
            "context_id": group_id,
            "user_id": body.user_id,
            "body": text,
        }
    ).execute()
    return {"ok": True}


@router.get("/friends")
def get_friends(user_id: str = DEFAULT_USER_ID, q: str = ""):
    db = get_supabase()
    relationships = (
        db.table("friendships")
        .select("*")
        .or_(f"user_id.eq.{user_id},friend_id.eq.{user_id}")
        .execute()
        .data
        or []
    )

    friend_ids = set()
    pending_ids = set()
    for row in relationships:
        other = row["friend_id"] if row["user_id"] == user_id else row["user_id"]
        if row["status"] == "accepted":
            friend_ids.add(other)
        elif row["status"] == "pending":
            pending_ids.add(other)

    players = db.table("app_users").select("*").neq("id", user_id).order("display_name").execute().data or []
    if q.strip():
        query = q.lower().strip()
        players = [p for p in players if query in p["display_name"].lower()]

    return {
        "friends": [
            {
                "id": p["id"],
                "name": p["display_name"],
                "publicSkillBand": p["public_skill_band"],
                "reliabilityScore": int(p.get("reliability_score") or 0),
                "gamesPlayed": int(p.get("games_played") or 0),
                "isOnline": bool(p.get("is_online") or False),
                "isFriend": p["id"] in friend_ids,
                "requestPending": p["id"] in pending_ids,
            }
            for p in players
        ]
    }


@router.post("/friends/requests")
def send_friend_request(body: FriendRequestBody):
    if body.user_id == body.friend_id:
        raise HTTPException(status_code=400, detail="Cannot friend yourself")

    db = get_supabase()
    existing = (
        db.table("friendships")
        .select("id,status,user_id,friend_id")
        .or_(
            f"and(user_id.eq.{body.user_id},friend_id.eq.{body.friend_id}),"
            f"and(user_id.eq.{body.friend_id},friend_id.eq.{body.user_id})"
        )
        .limit(1)
        .execute()
        .data
        or []
    )

    if existing:
        return {"ok": True, "status": existing[0]["status"]}

    db.table("friendships").insert(
        {
            "user_id": body.user_id,
            "friend_id": body.friend_id,
            "status": "pending",
            "requested_by": body.user_id,
        }
    ).execute()

    return {"ok": True, "status": "pending"}


@router.get("/profile")
def get_profile(user_id: str = DEFAULT_USER_ID):
    user = _require_user(user_id)
    return {
        "profile": {
            "id": user["id"],
            "displayName": user["display_name"],
            "username": user.get("username") or "",
            "publicSkillBand": user["public_skill_band"],
            "reliabilityScore": int(user.get("reliability_score") or 0),
            "gamesPlayed": int(user.get("games_played") or 0),
            "streakWeeks": int(user.get("streak_weeks") or 0),
            "avatarId": user.get("avatar_id") or "pitch",
            "selectedTags": user.get("selected_tags") or [],
            "selectedAchievements": user.get("selected_achievements") or [],
            "points": int(user.get("points") or 0),
            "walletBalance": float(user.get("wallet_balance") or 0),
        }
    }


@router.put("/profile")
def update_profile(body: ProfileUpdateBody):
    get_supabase().table("app_users").update(
        {
            "display_name": body.display_name.strip(),
            "username": body.username.strip(),
            "avatar_id": body.avatar_id,
            "selected_tags": body.selected_tags,
            "selected_achievements": body.selected_achievements,
            "updated_at": datetime.utcnow().isoformat(),
        }
    ).eq("id", body.user_id).execute()
    return {"ok": True}


@router.get("/notifications")
def list_notifications(user_id: str = DEFAULT_USER_ID):
    rows = (
        get_supabase()
        .table("notifications")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
        .data
        or []
    )

    return {
        "notifications": [
            {
                "id": str(n["id"]),
                "type": n["type"],
                "title": n["title"],
                "message": n["message"],
                "time": _time_ago(n.get("created_at")),
                "read": bool(n.get("is_read")),
                "actionable": n.get("actionable"),
            }
            for n in rows
        ]
    }


@router.post("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str, body: MarkNotificationBody):
    get_supabase().table("notifications").update({"is_read": True}).eq("id", notification_id).eq("user_id", body.user_id).execute()
    return {"ok": True}


@router.delete("/notifications/{notification_id}")
def delete_notification(notification_id: str, user_id: str = DEFAULT_USER_ID):
    get_supabase().table("notifications").delete().eq("id", notification_id).eq("user_id", user_id).execute()
    return {"ok": True}


@router.get("/wallet")
def wallet_data(user_id: str = DEFAULT_USER_ID):
    user = _require_user(user_id)
    db = get_supabase()
    vouchers = db.table("vouchers").select("*").eq("is_active", True).order("cost_points").execute().data or []
    redemptions = db.table("voucher_redemptions").select("voucher_id").eq("user_id", user_id).execute().data or []
    redeemed = {r["voucher_id"] for r in redemptions}

    activity = (
        db.table("wallet_transactions")
        .select("id,kind,amount,note,created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(20)
        .execute()
        .data
        or []
    )

    return {
        "walletBalance": float(user.get("wallet_balance") or 0),
        "points": int(user.get("points") or 0),
        "vouchers": [
            {
                "id": v["id"],
                "title": v["title"],
                "cost": int(v["cost_points"]),
                "code": v["code"],
                "detail": v.get("detail") or "",
                "isRedeemed": v["id"] in redeemed,
            }
            for v in vouchers
        ],
        "activity": [
            {
                "id": str(row["id"]),
                "text": row.get("note") or row["kind"].replace("_", " ").title(),
                "amount": f"{float(row['amount']):+.2f}",
                "time": _time_ago(row.get("created_at")),
            }
            for row in activity
        ],
    }


@router.post("/wallet/topup")
def topup_wallet(body: TopupBody):
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    user = _require_user(body.user_id)
    next_balance = float(user.get("wallet_balance") or 0) + body.amount
    db = get_supabase()
    db.table("app_users").update({"wallet_balance": next_balance}).eq("id", body.user_id).execute()
    db.table("wallet_transactions").insert(
        {
            "user_id": body.user_id,
            "kind": "topup",
            "amount": round(body.amount, 2),
            "note": "Top up",
        }
    ).execute()
    return {"ok": True, "walletBalance": next_balance}


@router.post("/wallet/redeem")
def redeem_voucher(body: RedeemBody):
    db = get_supabase()
    user = _require_user(body.user_id)
    vouchers = db.table("vouchers").select("*").eq("id", body.voucher_id).limit(1).execute().data or []
    if not vouchers:
        raise HTTPException(status_code=404, detail="Voucher not found")

    voucher = vouchers[0]
    already = (
        db.table("voucher_redemptions")
        .select("voucher_id")
        .eq("voucher_id", body.voucher_id)
        .eq("user_id", body.user_id)
        .limit(1)
        .execute()
        .data
        or []
    )
    if already:
        return {"ok": False, "reason": "already-redeemed"}

    points = int(user.get("points") or 0)
    cost = int(voucher.get("cost_points") or 0)
    if points < cost:
        return {"ok": False, "reason": "insufficient-points"}

    next_points = points - cost
    db.table("app_users").update({"points": next_points}).eq("id", body.user_id).execute()
    db.table("voucher_redemptions").insert({"voucher_id": body.voucher_id, "user_id": body.user_id}).execute()
    db.table("wallet_transactions").insert(
        {
            "user_id": body.user_id,
            "kind": "voucher_redeem",
            "amount": 0,
            "note": f"Redeemed {voucher['title']}",
        }
    ).execute()

    return {"ok": True, "points": next_points, "code": voucher.get("code")}


@router.get("/availability")
def get_availability(user_id: str = DEFAULT_USER_ID):
    rows = get_supabase().table("user_availability").select("*").eq("user_id", user_id).order("id").execute().data or []

    recurring_rules = [
        {
            "id": str(r["id"]),
            "days": r.get("weekdays") or [],
            "from": str(r.get("time_from") or "")[:5],
            "to": str(r.get("time_to") or "")[:5],
        }
        for r in rows
        if r.get("rule_type") == "recurring"
    ]

    specific_dates = [
        {
            "id": str(r["id"]),
            "date": str(r.get("date_value") or ""),
            "time": str(r.get("time_value") or "")[:5],
        }
        for r in rows
        if r.get("rule_type") == "specific"
    ]

    return {"recurringRules": recurring_rules, "specificDates": specific_dates}


@router.post("/availability/recurring")
def add_recurring(body: RecurringAvailabilityBody):
    if not body.days:
        raise HTTPException(status_code=400, detail="At least one day is required")
    inserted = (
        get_supabase()
        .table("user_availability")
        .insert(
            {
                "user_id": body.user_id,
                "rule_type": "recurring",
                "weekdays": body.days,
                "time_from": body.from_time,
                "time_to": body.to_time,
            }
        )
        .execute()
        .data
        or []
    )
    return {"ok": True, "id": str(inserted[0]["id"]) if inserted else None}


@router.post("/availability/specific")
def add_specific(body: SpecificAvailabilityBody):
    inserted = (
        get_supabase()
        .table("user_availability")
        .insert(
            {
                "user_id": body.user_id,
                "rule_type": "specific",
                "date_value": body.date_value,
                "time_value": body.time_value,
            }
        )
        .execute()
        .data
        or []
    )
    return {"ok": True, "id": str(inserted[0]["id"]) if inserted else None}


@router.delete("/availability/{availability_id}")
def remove_availability(availability_id: str, user_id: str = DEFAULT_USER_ID):
    get_supabase().table("user_availability").delete().eq("id", availability_id).eq("user_id", user_id).execute()
    return {"ok": True}


@router.get("/feedback/{game_id}")
def feedback_game(game_id: str, user_id: str = DEFAULT_USER_ID):
    db = get_supabase()
    game_rows = db.table("games").select("id,location,game_date,start_time").eq("id", game_id).limit(1).execute().data or []
    if not game_rows:
        raise HTTPException(status_code=404, detail="Game not found")
    participants = db.table("game_participants").select("user_id,joined_via_group_id").eq("game_id", game_id).execute().data or []

    me = next((p for p in participants if p["user_id"] == user_id), None)
    my_group = me.get("joined_via_group_id") if me else None
    player_map = _get_players_map()

    players = []
    for p in participants:
        info = player_map.get(p["user_id"])
        if not info:
            continue
        players.append(
            {
                "id": p["user_id"],
                "name": info["display_name"],
                "joinedViaGroupId": p.get("joined_via_group_id"),
            }
        )

    game = game_rows[0]
    return {
        "id": game["id"],
        "location": game["location"],
        "date": _format_date(game["game_date"]),
        "time": _format_time(game["start_time"]),
        "currentUserJoinGroupId": my_group,
        "players": players,
    }


@router.post("/feedback/{game_id}/submit")
def submit_feedback(game_id: str, body: FeedbackSubmitBody):
    if not body.ratings:
        raise HTTPException(status_code=400, detail="No ratings provided")

    db = get_supabase()
    payload = [
        {
            "game_id": game_id,
            "rater_user_id": body.user_id,
            "rated_user_id": item.rated_user_id,
            "stars": item.stars,
            "flagged_sportsmanship": item.flagged_sportsmanship,
        }
        for item in body.ratings
    ]
    db.table("feedback_ratings").upsert(payload).execute()

    already = (
        db.table("user_game_rewards")
        .select("game_id")
        .eq("game_id", game_id)
        .eq("user_id", body.user_id)
        .limit(1)
        .execute()
        .data
        or []
    )

    if already:
        return {"ok": True, "awarded": False}

    user = _require_user(body.user_id)
    next_points = int(user.get("points") or 0) + 50
    db.table("app_users").update({"points": next_points}).eq("id", body.user_id).execute()
    db.table("user_game_rewards").insert({"user_id": body.user_id, "game_id": game_id, "points_awarded": 50}).execute()
    db.table("wallet_transactions").insert(
        {
            "user_id": body.user_id,
            "kind": "reward",
            "amount": 0,
            "note": "Feedback reward +50 points",
        }
    ).execute()

    return {"ok": True, "awarded": True, "points": next_points}
