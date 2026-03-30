from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime
import math
import re
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.app.schemas import PingResponse
from backend.app.supabase_client import get_supabase

router = APIRouter(prefix="/api/v1", tags=["api"])
DEFAULT_USER_ID = "u-me"


class UserRequest(BaseModel):
    user_id: str = DEFAULT_USER_ID


class JoinRoomBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    pay_when_required: bool = False


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


class GroupRecommendationInterestBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    wants_to_join: bool = True


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


def _to_minutes(time_value: str | None, default: int | None = None) -> int | None:
    if time_value is None:
        return default
    raw = str(time_value)[:5]
    try:
        parsed = datetime.strptime(raw, "%H:%M")
    except ValueError:
        return default
    return parsed.hour * 60 + parsed.minute


def _is_available_for_game(rule_rows: list[dict[str, Any]], game_date_value: str | date, game_time_value: str) -> bool:
    if isinstance(game_date_value, date):
        game_date = game_date_value
    else:
        game_date = date.fromisoformat(str(game_date_value))
    game_day = game_date.strftime("%a")
    game_time = _to_minutes(game_time_value)
    if game_time is None:
        return False

    for row in rule_rows:
        rule_type = row.get("rule_type")
        if rule_type == "recurring":
            weekdays = row.get("weekdays") or []
            if game_day not in weekdays:
                continue
            start = _to_minutes(row.get("time_from"), 0)
            end = _to_minutes(row.get("time_to"), 23 * 60 + 59)
            if start is not None and end is not None and start <= game_time <= end:
                return True
        elif rule_type == "specific":
            date_value = row.get("date_value")
            if not date_value or str(date_value) != game_date.isoformat():
                continue

            exact_time = _to_minutes(row.get("time_value"))
            if exact_time is not None and exact_time == game_time:
                return True

            start = _to_minutes(row.get("time_from"))
            end = _to_minutes(row.get("time_to"))
            if start is not None and end is not None and start <= game_time <= end:
                return True

    return False


def _derive_overlap_slots(member_ids: list[str], availability_by_user: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    slot_to_members: dict[str, set[str]] = defaultdict(set)
    for member_id in member_ids:
        for row in availability_by_user.get(member_id, []):
            if row.get("rule_type") == "recurring":
                weekdays = row.get("weekdays") or []
                start = str(row.get("time_from") or "00:00")[:5]
                end = str(row.get("time_to") or "23:59")[:5]
                for day in weekdays:
                    slot_to_members[f"{day} {start}-{end}"].add(member_id)
            elif row.get("rule_type") == "specific":
                date_value = row.get("date_value")
                time_value = row.get("time_value")
                if date_value and time_value:
                    slot_to_members[f"{date_value} {str(time_value)[:5]}"].add(member_id)

    total_members = max(1, len(member_ids))
    slots = [
        {
            "slot": slot,
            "count": len(ids),
            "memberIds": sorted(ids),
            "percent": round((len(ids) / total_members) * 100),
        }
        for slot, ids in slot_to_members.items()
    ]
    slots.sort(key=lambda item: (item["count"], item["slot"]), reverse=True)
    return slots


def _require_user(user_id: str) -> dict[str, Any]:
    db = get_supabase()
    response = db.table("app_users").select("*").eq("id", user_id).limit(1).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]


def _requires_join_payment(current_joined: int, max_players: int) -> bool:
    threshold = max(1, math.ceil(max_players * 0.8))
    return current_joined + 1 >= threshold


def _is_high_fill(current_joined: int, max_players: int) -> bool:
    threshold = max(1, math.ceil(max_players * 0.8))
    return current_joined >= threshold


def _get_paid_room_ids(user_id: str) -> set[str]:
    try:
        rows = (
            get_supabase()
            .table("room_join_payments")
            .select("game_id")
            .eq("user_id", user_id)
            .execute()
            .data
            or []
        )
    except Exception:
        return set()
    return {row["game_id"] for row in rows}


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
    upcoming: list[dict[str, Any]] = []
    for game in games:
        if game["id"] not in game_ids or game.get("status") != "open":
            continue
        joined = counts.get(game["id"], 0)
        room = _game_to_room(game, joined)
        room["priceVisible"] = not _is_high_fill(joined, room["maxPlayers"])
        upcoming.append(room)

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
    joined_rows = (
        get_supabase().table("game_participants").select("game_id").eq("user_id", user_id).execute().data
        or []
    )
    joined_game_ids = {row["game_id"] for row in joined_rows}
    user_band = user.get("public_skill_band")

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
        if game["id"] in joined_game_ids:
            continue
        if use_availability and not matches_availability(game):
            continue
        if counts.get(game["id"], 0) >= int(game.get("max_players") or 10):
            continue
        allowed_band = game.get("allowed_band")
        if allowed_band and allowed_band != user_band:
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
    room = _game_to_room(game, len(participants))
    room["priceVisible"] = not (is_joined and _is_high_fill(len(participants), room["maxPlayers"]))

    return {
        "room": room,
        "roster": roster,
        "chat": chat,
        "isJoined": is_joined,
    }


@router.post("/rooms/{room_id}/join")
def join_room(room_id: str, body: JoinRoomBody):
    db = get_supabase()
    user = _require_user(body.user_id)
    game = (
        db.table("games")
        .select("id,max_players,status,allowed_band,price")
        .eq("id", room_id)
        .limit(1)
        .execute()
        .data
    )
    if not game:
        raise HTTPException(status_code=404, detail="Room not found")
    row = game[0]
    if row.get("status") != "open":
        raise HTTPException(status_code=400, detail="Room is not open")
    allowed_band = row.get("allowed_band")
    if allowed_band and allowed_band != user.get("public_skill_band"):
        raise HTTPException(status_code=400, detail="Room skill band mismatch")

    participants = db.table("game_participants").select("user_id").eq("game_id", room_id).execute().data or []
    if any(p["user_id"] == body.user_id for p in participants):
        return {"ok": True, "joined": True, "requiresPayment": False}
    max_players = int(row.get("max_players") or 10)
    if len(participants) >= max_players:
        raise HTTPException(status_code=400, detail="Room is full")

    payment_required = _requires_join_payment(len(participants), max_players)
    join_fee = float(row.get("price") or 0)
    wallet_balance = float(user.get("wallet_balance") or 0)
    if payment_required and not body.pay_when_required:
        return {
            "ok": False,
            "joined": False,
            "requiresPayment": True,
            "amount": join_fee,
            "walletBalance": wallet_balance,
        }

    if payment_required:
        try:
            db.table("room_join_payments").select("game_id").limit(1).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"room_join_payments table missing or unavailable: {exc}") from exc
        if wallet_balance < join_fee:
            raise HTTPException(status_code=400, detail="Insufficient wallet balance for this join")
        next_balance = round(wallet_balance - join_fee, 2)
        db.table("app_users").update({"wallet_balance": next_balance}).eq("id", body.user_id).execute()
        db.table("wallet_transactions").insert(
            {
                "user_id": body.user_id,
                "kind": "game_fee",
                "amount": round(-join_fee, 2),
                "note": f"Join fee for room {room_id}",
            }
        ).execute()
        db.table("room_join_payments").upsert(
            {
                "game_id": room_id,
                "user_id": body.user_id,
                "amount": round(join_fee, 2),
                "paid_at": datetime.utcnow().isoformat(),
            }
        ).execute()

    db.table("game_participants").insert({"game_id": room_id, "user_id": body.user_id}).execute()
    return {
        "ok": True,
        "joined": True,
        "requiresPayment": False,
        "walletBalance": round(float(user.get("wallet_balance") or 0) - (join_fee if payment_required else 0), 2),
    }


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
    unique_member_ids = sorted({m["user_id"] for m in members})
    availability_rows = (
        db.table("user_availability")
        .select("user_id,rule_type,weekdays,date_value,time_from,time_to,time_value")
        .in_("user_id", unique_member_ids)
        .execute()
        .data
        or []
    )

    member_count: dict[str, int] = defaultdict(int)
    for row in members:
        member_count[row["group_id"]] += 1

    group_members_map: dict[str, list[str]] = defaultdict(list)
    for row in members:
        group_members_map[row["group_id"]].append(row["user_id"])

    availability_by_user: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in availability_rows:
        availability_by_user[row["user_id"]].append(row)

    formatted = []
    for g in groups:
        overlap_slots = _derive_overlap_slots(group_members_map[g["id"]], availability_by_user)
        top_slot = overlap_slots[0]["slot"] if overlap_slots else "No overlap yet"
        formatted.append(
            {
                "id": g["id"],
                "name": g["name"],
                "memberCount": member_count[g["id"]],
                "topOverlap": top_slot,
                "topOverlapCount": overlap_slots[0]["count"] if overlap_slots else 0,
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

    availability_rows = (
        db.table("user_availability")
        .select("user_id,rule_type,weekdays,date_value,time_from,time_to,time_value")
        .in_("user_id", member_ids)
        .execute()
        .data
        or []
    )
    availability_by_user: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in availability_rows:
        availability_by_user[row["user_id"]].append(row)
    overlap = _derive_overlap_slots(member_ids, availability_by_user)

    games, counts = _get_games_with_counts()
    avg_skill = 3.0
    if players:
        avg_skill = sum(float(p.get("hidden_skill_rating") or 3.0) for p in players) / len(players)
    avg_reliability = 0
    if players:
        avg_reliability = round(sum(int(p.get("reliability_score") or 0) for p in players) / len(players))
    member_name_by_id = {p["id"]: p.get("display_name") or "Player" for p in players}
    skill_band_spread = {"Beginner": 0, "Intermediate": 0, "Advanced": 0}
    for player in players:
        band = str(player.get("public_skill_band") or "")
        if band in skill_band_spread:
            skill_band_spread[band] += 1

    all_participants = db.table("game_participants").select("game_id,user_id").execute().data or []
    game_participants_map: dict[str, set[str]] = defaultdict(set)
    for row in all_participants:
        game_participants_map[row["game_id"]].add(row["user_id"])

    recommendations = []
    for game in games:
        if game.get("status") != "open":
            continue
        if counts.get(game["id"], 0) >= int(game.get("max_players") or 10):
            continue
        room = _game_to_room(game, counts.get(game["id"], 0))
        joined_user_ids = game_participants_map.get(game["id"], set())
        if user_id in joined_user_ids:
            continue
        can_member_ids = [
            member_id
            for member_id in member_ids
            if _is_available_for_game(availability_by_user.get(member_id, []), game["game_date"], game["start_time"])
        ]
        cannot_member_ids = [member_id for member_id in member_ids if member_id not in can_member_ids]
        can_count = len(can_member_ids)
        if can_count < 2:
            continue
        eligible_member_ids = [mid for mid in can_member_ids if mid not in joined_user_ids]
        if not eligible_member_ids:
            continue
        availability_pct = round((can_count / max(1, len(member_ids))) * 100)
        fit = max(50, round(100 - abs(avg_skill - room["hiddenAvgRating"]) * 24 - room["hiddenRatingSpread"] * 12))
        combined_score = round(fit * 0.7 + availability_pct * 0.3)
        recommendations.append(
            {
                "room": room,
                "fitScore": fit,
                "combinedScore": combined_score,
                "availability": {
                    "canCount": can_count,
                    "cannotCount": len(cannot_member_ids),
                    "percent": availability_pct,
                    "canMemberIds": can_member_ids,
                    "cannotMemberIds": cannot_member_ids,
                    "canNames": [member_name_by_id[mid] for mid in can_member_ids],
                    "cannotNames": [member_name_by_id[mid] for mid in cannot_member_ids],
                },
                "capacityLeft": max(0, int(room["maxPlayers"]) - int(room["playersJoined"])),
                "roomType": room["allowedBand"] or "Hybrid",
                "joinedMemberIds": [mid for mid in member_ids if mid in joined_user_ids],
                "eligibleMemberIds": eligible_member_ids,
            }
        )
    recommendations.sort(key=lambda x: (x["combinedScore"], x["fitScore"]), reverse=True)

    interest_rows: list[dict[str, Any]] = []
    try:
        interest_rows = (
            db.table("group_game_interest_votes")
            .select("game_id,user_id,wants_to_join")
            .eq("group_id", group_id)
            .eq("wants_to_join", True)
            .execute()
            .data
            or []
        )
    except Exception:
        interest_rows = []
    interest_by_game: dict[str, set[str]] = defaultdict(set)
    for row in interest_rows:
        interest_by_game[row["game_id"]].add(row["user_id"])

    for rec in recommendations:
        eligible = rec["eligibleMemberIds"]
        interested = sorted([uid for uid in interest_by_game.get(rec["room"]["id"], set()) if uid in eligible])
        pending = [uid for uid in eligible if uid not in interested]
        available_member_ids = rec["availability"]["canMemberIds"]
        already_joined_available = [uid for uid in available_member_ids if uid in rec["joinedMemberIds"]]
        pending_from_available = [uid for uid in available_member_ids if uid not in already_joined_available and uid not in interested]
        rec["interest"] = {
            "interestedMemberIds": interested,
            "interestedNames": [member_name_by_id[mid] for mid in interested],
            "pendingMemberIds": pending_from_available,
            "pendingNames": [member_name_by_id[mid] for mid in pending_from_available],
            "neededCount": len(available_member_ids),
            "interestedCount": len(interested) + len(already_joined_available),
            "isReady": len(available_member_ids) > 0 and len(pending_from_available) == 0,
            "currentUserInterested": user_id in interested or user_id in already_joined_available,
            "currentUserEligible": user_id in eligible,
        }

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
        "summary": {
            "avgReliability": avg_reliability,
            "skillBandSpread": skill_band_spread,
            "topOverlap": overlap[0]["slot"] if overlap else "No overlap yet",
        },
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


@router.post("/groups/{group_id}/recommendations/{room_id}/interest")
def set_group_recommendation_interest(group_id: str, room_id: str, body: GroupRecommendationInterestBody):
    db = get_supabase()
    members = db.table("group_members").select("user_id").eq("group_id", group_id).execute().data or []
    member_ids = [row["user_id"] for row in members]
    if body.user_id not in member_ids:
        raise HTTPException(status_code=403, detail="User is not a member of this group")

    game_rows = (
        db.table("games")
        .select("id,status,max_players,game_date,start_time")
        .eq("id", room_id)
        .limit(1)
        .execute()
        .data
        or []
    )
    if not game_rows:
        raise HTTPException(status_code=404, detail="Room not found")
    game = game_rows[0]
    if game.get("status") != "open":
        raise HTTPException(status_code=400, detail="Room is not open")

    availability_rows = (
        db.table("user_availability")
        .select("user_id,rule_type,weekdays,date_value,time_from,time_to,time_value")
        .in_("user_id", member_ids)
        .execute()
        .data
        or []
    )
    availability_by_user: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in availability_rows:
        availability_by_user[row["user_id"]].append(row)

    participant_rows = db.table("game_participants").select("user_id").eq("game_id", room_id).execute().data or []
    joined_ids = {row["user_id"] for row in participant_rows}
    available_ids = [
        member_id
        for member_id in member_ids
        if _is_available_for_game(availability_by_user.get(member_id, []), game["game_date"], game["start_time"])
    ]
    eligible_ids = [member_id for member_id in available_ids if member_id not in joined_ids]
    if len(available_ids) < 2:
        raise HTTPException(status_code=400, detail="Recommendation requires at least 2 available members")
    if body.user_id not in eligible_ids:
        raise HTTPException(status_code=400, detail="You are not eligible for this recommendation")

    try:
        db.table("group_game_interest_votes").upsert(
            {
                "group_id": group_id,
                "game_id": room_id,
                "user_id": body.user_id,
                "wants_to_join": body.wants_to_join,
                "updated_at": datetime.utcnow().isoformat(),
            }
        ).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"group_game_interest_votes table missing or unavailable: {exc}",
        ) from exc

    interested_rows = (
        db.table("group_game_interest_votes")
        .select("user_id")
        .eq("group_id", group_id)
        .eq("game_id", room_id)
        .eq("wants_to_join", True)
        .in_("user_id", eligible_ids)
        .execute()
        .data
        or []
    )
    interested_ids = {row["user_id"] for row in interested_rows}

    if not body.wants_to_join:
        return {
            "ok": True,
            "autoJoined": False,
            "interestedCount": len(interested_ids),
            "neededCount": len(eligible_ids),
        }

    if set(eligible_ids).issubset(interested_ids) and eligible_ids:
        max_players = int(game.get("max_players") or 10)
        capacity_left = max_players - len(participant_rows)
        if capacity_left < len(eligible_ids):
            raise HTTPException(status_code=400, detail="Room no longer has enough capacity for auto-join")
        projected_total = len(participant_rows) + len(eligible_ids)
        if _is_high_fill(projected_total, max_players):
            raise HTTPException(status_code=400, detail="Auto-join requires payment flow. Join this room manually.")

        db.table("game_participants").upsert(
            [
                {
                    "game_id": room_id,
                    "user_id": member_id,
                    "joined_via_group_id": group_id,
                }
                for member_id in eligible_ids
            ]
        ).execute()
        return {
            "ok": True,
            "autoJoined": True,
            "joinedUserIds": sorted(eligible_ids),
        }

    return {
        "ok": True,
        "autoJoined": False,
        "interestedCount": len(interested_ids),
        "neededCount": len(eligible_ids),
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
    db = get_supabase()
    memberships = db.table("game_participants").select("game_id").eq("user_id", user_id).execute().data or []
    game_ids = [m["game_id"] for m in memberships]
    recent_matches: list[dict[str, Any]] = []
    if game_ids:
        joined_games = (
            db.table("games")
            .select("id,location,game_date,start_time,status")
            .in_("id", game_ids)
            .lte("game_date", date.today().isoformat())
            .order("game_date", desc=True)
            .limit(6)
            .execute()
            .data
            or []
        )
        recent_matches = [
            {
                "id": game["id"],
                "location": game["location"],
                "date": _format_date(game["game_date"]),
                "time": _format_time(game["start_time"]),
                "status": game.get("status") or "open",
            }
            for game in joined_games
        ]
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
            "recentMatches": recent_matches,
        }
    }


@router.put("/profile")
def update_profile(body: ProfileUpdateBody):
    display_name = body.display_name.strip()
    username = body.username.strip()
    if not display_name or len(display_name) < 2:
        raise HTTPException(status_code=400, detail="Display name must be at least 2 characters")
    if not username.startswith("@"):
        username = f"@{username}"
    if not re.fullmatch(r"@[A-Za-z0-9_]{3,20}", username):
        raise HTTPException(status_code=400, detail="Username must be @ + 3-20 letters, numbers, or underscores")

    db = get_supabase()
    existing = (
        db.table("app_users")
        .select("id")
        .eq("username", username)
        .neq("id", body.user_id)
        .limit(1)
        .execute()
        .data
        or []
    )
    if existing:
        raise HTTPException(status_code=409, detail="Username is already taken")

    tags = [tag.strip() for tag in body.selected_tags if tag.strip()]
    deduped_tags = list(dict.fromkeys(tags))[:6]
    achievements = [value.strip() for value in body.selected_achievements if value.strip()]
    deduped_achievements = list(dict.fromkeys(achievements))[:4]

    db.table("app_users").update(
        {
            "display_name": display_name,
            "username": username,
            "avatar_id": body.avatar_id,
            "selected_tags": deduped_tags,
            "selected_achievements": deduped_achievements,
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
