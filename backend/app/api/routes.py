from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime
import math
import re
import time
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException
import httpx
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


class FriendRequestRespondBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    action: str


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
    tags: list[str] = Field(default_factory=list)


class FeedbackSubmitBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    ratings: list[FeedbackItem]


class SignupBody(BaseModel):
    display_name: str
    username: str
    email: str | None = None


class LoginBody(BaseModel):
    identifier: str


class SetSkillBandBody(BaseModel):
    user_id: str
    public_skill_band: str


ALLOWED_FEEDBACK_TAGS = {
    "Reliable",
    "Team Player",
    "Forward",
    "Midfielder",
    "Defender",
    "Goalkeeper",
    "Leader",
    "Punctual",
    "Technical",
    "Fast",
    "Calm",
    "Defensive IQ",
    "Supportive",
    "Competitive",
    "Fast Press",
    "Calm Finisher",
    "Wing Runner",
    "Organizer",
    "Learner",
    "Energetic",
    "Developing",
}


class GroupRecommendationInterestBody(BaseModel):
    user_id: str = DEFAULT_USER_ID
    wants_to_join: bool = True


def _normalize_username(username: str) -> str:
    parsed = username.strip()
    if not parsed.startswith("@"):
        parsed = f"@{parsed}"
    return parsed.lower()


def _default_hidden_rating_for_band(public_skill_band: str) -> float:
    if public_skill_band == "Beginner":
        return 2.2
    if public_skill_band == "Advanced":
        return 4.1
    return 3.2


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


def _normalize_feedback_tags(tags: list[str]) -> list[str]:
    normalized: list[str] = []
    for raw in tags:
        value = raw.strip()
        if not value or value not in ALLOWED_FEEDBACK_TAGS:
            continue
        if value not in normalized:
            normalized.append(value)
    return normalized[:3]


def _get_players_map() -> dict[str, dict[str, Any]]:
    db = get_supabase()
    players = db.table("app_users").select("*").execute().data or []
    return {p["id"]: p for p in players}


def _execute_with_retry(builder: Any, retries: int = 2):
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            return builder.execute()
        except (httpx.RemoteProtocolError, httpx.ReadError, httpx.ConnectError, httpx.ReadTimeout) as exc:
            last_error = exc
            if attempt == retries - 1:
                raise
            time.sleep(0.15 * (attempt + 1))
    if last_error:
        raise last_error
    raise RuntimeError("Query execution failed")


def _get_games_with_counts() -> tuple[list[dict[str, Any]], dict[str, int]]:
    db = get_supabase()
    games = (
        db.table("games")
        .select("*")
        .neq("status", "cancelled")
        .order("game_date")
        .order("start_time")
    )
    games = (
        _execute_with_retry(games)
        .data
        or []
    )
    participants = _execute_with_retry(db.table("game_participants").select("game_id")).data or []
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


@router.post("/auth/signup")
def signup(body: SignupBody):
    display_name = body.display_name.strip()
    username = _normalize_username(body.username)
    email = (body.email or "").strip().lower() or None
    if len(display_name) < 2:
        raise HTTPException(status_code=400, detail="Display name must be at least 2 characters")
    if not re.fullmatch(r"@[a-z0-9_]{3,20}", username):
        raise HTTPException(status_code=400, detail="Username must be @ + 3-20 letters, numbers, or underscores")
    if email and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    db = get_supabase()
    existing_users = db.table("app_users").select("username,email").execute().data or []
    for row in existing_users:
        row_username = str(row.get("username") or "").strip().lower()
        row_email = str(row.get("email") or "").strip().lower()
        if row_username and row_username == username:
            raise HTTPException(status_code=409, detail="Username is already taken")
        if email and row_email and row_email == email:
            raise HTTPException(status_code=409, detail="Email is already in use")

    user_id = f"u-{uuid4().hex[:10]}"
    db.table("app_users").insert(
        {
            "id": user_id,
            "email": email,
            "display_name": display_name,
            "username": username,
            "public_skill_band": "Beginner",
            "hidden_skill_rating": _default_hidden_rating_for_band("Beginner"),
            "reliability_score": 0,
        }
    ).execute()
    return {"ok": True, "userId": user_id, "displayName": display_name}


@router.post("/auth/login")
def login(body: LoginBody):
    identifier = body.identifier.strip().lower()
    if not identifier:
        raise HTTPException(status_code=400, detail="Username or email is required")

    possible_username = _normalize_username(identifier)
    db = get_supabase()
    users = db.table("app_users").select("id,display_name,username,email").execute().data or []
    matched = next(
        (
            row
            for row in users
            if str(row.get("email") or "").strip().lower() == identifier
            or str(row.get("username") or "").strip().lower() == possible_username
        ),
        None,
    )
    if not matched:
        raise HTTPException(status_code=404, detail="No account found for that username/email")
    return {
        "ok": True,
        "userId": matched["id"],
        "displayName": matched.get("display_name") or "Player",
    }


@router.post("/auth/skill-band")
def set_skill_band(body: SetSkillBandBody):
    if body.public_skill_band not in {"Beginner", "Intermediate", "Advanced"}:
        raise HTTPException(status_code=400, detail="Invalid skill band")
    _require_user(body.user_id)
    rating = _default_hidden_rating_for_band(body.public_skill_band)
    get_supabase().table("app_users").update(
        {
            "public_skill_band": body.public_skill_band,
            "hidden_skill_rating": rating,
            "updated_at": datetime.utcnow().isoformat(),
        }
    ).eq("id", body.user_id).execute()
    return {"ok": True, "publicSkillBand": body.public_skill_band, "hiddenSkillRating": rating}


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

    completed_game_ids = []
    if game_ids:
        completed_rows = (
            db.table("games")
            .select("id")
            .in_("id", sorted(game_ids))
            .eq("status", "completed")
            .execute()
            .data
            or []
        )
        completed_game_ids = [row["id"] for row in completed_rows]

    already_rated_game_ids: set[str] = set()
    if completed_game_ids:
        rated_rows = (
            db.table("feedback_ratings")
            .select("game_id")
            .eq("rater_user_id", user_id)
            .in_("game_id", completed_game_ids)
            .execute()
            .data
            or []
        )
        already_rated_game_ids = {row["game_id"] for row in rated_rows}

    pending_feedback: list[dict[str, Any]] = []
    if completed_game_ids:
        pending_feedback = (
            db.table("games")
            .select("id,location,game_date")
            .in_("id", completed_game_ids)
            .order("game_date", desc=True)
            .execute()
            .data
            or []
        )
        pending_feedback = [game for game in pending_feedback if game["id"] not in already_rated_game_ids][:3]

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
def discover_rooms(user_id: str = DEFAULT_USER_ID, use_availability: bool = True, debug: bool = False):
    user = _require_user(user_id)
    games, counts = _get_games_with_counts()
    joined_rows = (
        get_supabase().table("game_participants").select("game_id").eq("user_id", user_id).execute().data
        or []
    )
    joined_game_ids = {row["game_id"] for row in joined_rows}
    user_band = user.get("public_skill_band")

    availability_rules = (
        get_supabase()
        .table("user_availability")
        .select("rule_type,weekdays,date_value,time_from,time_to,time_value")
        .eq("user_id", user_id)
        .execute()
        .data
        or []
    )
    has_availability_rules = len(availability_rules) > 0

    def matches_availability(game: dict[str, Any]) -> bool:
        # Strict behavior: if user turned on availability matching but has no rules,
        # return no games until availability is configured.
        if not has_availability_rules:
            return False
        return _is_available_for_game(availability_rules, game["game_date"], game["start_time"])

    rooms = []
    debug_rows: list[dict[str, Any]] = []
    for game in games:
        exclusion_reasons: list[str] = []
        if game.get("status") != "open":
            exclusion_reasons.append("status-not-open")
        if game["id"] in joined_game_ids:
            exclusion_reasons.append("already-joined")
        if use_availability and not matches_availability(game):
            exclusion_reasons.append("availability-mismatch")
        if counts.get(game["id"], 0) >= int(game.get("max_players") or 10):
            exclusion_reasons.append("room-full")
        allowed_band = game.get("allowed_band")
        if allowed_band and allowed_band != user_band:
            exclusion_reasons.append("skill-band-mismatch")

        if debug:
            debug_rows.append(
                {
                    "id": game.get("id"),
                    "title": game.get("title"),
                    "allowedBand": allowed_band,
                    "userSkillBand": user_band,
                    "status": game.get("status"),
                    "joined": game["id"] in joined_game_ids,
                    "playersJoined": counts.get(game["id"], 0),
                    "maxPlayers": int(game.get("max_players") or 10),
                    "useAvailability": use_availability,
                    "matchingAvailabilityField": bool(game.get("matching_availability")),
                    "hasUserAvailabilityRules": has_availability_rules,
                    "excluded": len(exclusion_reasons) > 0,
                    "reasons": exclusion_reasons,
                }
            )

        if exclusion_reasons:
            continue
        room = _game_to_room(game, counts.get(game["id"], 0))
        distance = abs(room["hiddenAvgRating"] - float(user.get("hidden_skill_rating") or 3.0))
        room["fitScore"] = max(30, round(100 - distance * 30 - room["distanceKm"] * 6))
        rooms.append(room)

    rooms.sort(key=lambda r: r["fitScore"], reverse=True)
    response: dict[str, Any] = {"rooms": rooms, "userSkillBand": user_band, "hasAvailabilityRules": has_availability_rules}
    if debug:
        reason_counts: dict[str, int] = defaultdict(int)
        for row in debug_rows:
            for reason in row["reasons"]:
                reason_counts[reason] += 1
        response["debug"] = {
            "summary": {
                "totalGamesConsidered": len(games),
                "returnedRooms": len(rooms),
                "excludedByReason": dict(reason_counts),
            },
            "rooms": debug_rows,
        }
    return response


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
    players = db.table("app_users").select("id,public_skill_band").in_("id", sorted({m["user_id"] for m in members})).execute().data or []
    player_band_map = {p["id"]: p.get("public_skill_band") for p in players}
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
        bands = [player_band_map.get(member_id) for member_id in group_members_map[g["id"]] if player_band_map.get(member_id)]
        band_counts: dict[str, int] = defaultdict(int)
        for band in bands:
            band_counts[str(band)] += 1
        if not band_counts:
            skill_profile = "Mixed"
        elif len(band_counts) == 1:
            skill_profile = next(iter(band_counts.keys()))
        else:
            top_band = max(band_counts.items(), key=lambda item: item[1])[0]
            total_members = max(1, len(bands))
            dominance = band_counts[top_band] / total_members
            skill_profile = f"{top_band}-heavy" if dominance >= 0.5 else "Mixed"
        formatted.append(
            {
                "id": g["id"],
                "name": g["name"],
                "memberCount": member_count[g["id"]],
                "topOverlap": top_slot,
                "topOverlapCount": overlap_slots[0]["count"] if overlap_slots else 0,
                "skillProfile": skill_profile,
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
    members_with_availability = sum(1 for member_id in member_ids if availability_by_user.get(member_id))

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

    all_participants = db.table("game_participants").select("game_id,user_id,joined_via_group_id").execute().data or []
    game_participants_map: dict[str, set[str]] = defaultdict(set)
    joined_via_group_map: dict[str, set[str]] = defaultdict(set)
    for row in all_participants:
        game_participants_map[row["game_id"]].add(row["user_id"])
        if row.get("joined_via_group_id") == group_id:
            joined_via_group_map[row["game_id"]].add(row["user_id"])

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
    recommendation_note = ""
    if len(member_ids) < 2:
        recommendation_note = "Need at least 2 members in the group for recommendations."
    elif members_with_availability < 2:
        recommendation_note = "Not enough members have availability set. Add availability for at least 2 members."
    elif not recommendations:
        recommendation_note = "Schedules have low overlap right now. Update availability to unlock recommendations."

    interest_rows: list[dict[str, Any]] = []
    try:
        interest_rows = (
            db.table("group_game_interest_votes")
            .select("game_id,user_id,wants_to_join")
            .eq("group_id", group_id)
            .execute()
            .data
            or []
        )
    except Exception:
        interest_rows = []
    interest_yes_by_game: dict[str, set[str]] = defaultdict(set)
    interest_no_by_game: dict[str, set[str]] = defaultdict(set)
    for row in interest_rows:
        game_key = row["game_id"]
        user_key = row["user_id"]
        if row.get("wants_to_join") is True:
            interest_yes_by_game[game_key].add(user_key)
        elif row.get("wants_to_join") is False:
            interest_no_by_game[game_key].add(user_key)

    upcoming_group_games: list[tuple[date, str, dict[str, Any]]] = []
    today = date.today()
    now_minutes = datetime.now().hour * 60 + datetime.now().minute
    for game in games:
        if game.get("status") != "open":
            continue
        game_date = game.get("game_date")
        if not game_date:
            continue
        parsed_game_date = game_date if isinstance(game_date, date) else date.fromisoformat(str(game_date))
        if parsed_game_date < today:
            continue
        if parsed_game_date == today:
            start_minutes = _to_minutes(str(game.get("start_time") or "")[:5], default=0) or 0
            if start_minutes <= now_minutes:
                continue

        joined_via_group_ids = sorted(joined_via_group_map.get(game["id"], set()))
        if not joined_via_group_ids:
            continue

        joined_count = counts.get(game["id"], 0)
        room = _game_to_room(game, joined_count)
        room["priceVisible"] = not (
            user_id in game_participants_map.get(game["id"], set()) and _is_high_fill(joined_count, int(room["maxPlayers"]))
        )
        upcoming_group_games.append(
            (
                parsed_game_date,
                str(game.get("start_time") or ""),
                {
                    "room": room,
                    "joinedMemberIds": joined_via_group_ids,
                    "joinedMemberNames": [member_name_by_id[mid] for mid in joined_via_group_ids if mid in member_name_by_id],
                },
            )
        )
    upcoming_group_games.sort(key=lambda item: (item[0], item[1]))

    for rec in recommendations:
        eligible = rec["eligibleMemberIds"]
        interested = sorted([uid for uid in interest_yes_by_game.get(rec["room"]["id"], set()) if uid in eligible])
        declined = sorted([uid for uid in interest_no_by_game.get(rec["room"]["id"], set()) if uid in eligible])
        available_member_ids = rec["availability"]["canMemberIds"]
        already_joined_available = [uid for uid in available_member_ids if uid in rec["joinedMemberIds"]]
        pending_from_available = [
            uid for uid in available_member_ids if uid not in already_joined_available and uid not in interested and uid not in declined
        ]
        if user_id in already_joined_available or user_id in interested:
            current_decision = "yes"
        elif user_id in declined:
            current_decision = "no"
        else:
            current_decision = "unset"
        rec["interest"] = {
            "interestedMemberIds": interested,
            "interestedNames": [member_name_by_id[mid] for mid in interested],
            "declinedMemberIds": declined,
            "declinedNames": [member_name_by_id[mid] for mid in declined],
            "pendingMemberIds": pending_from_available,
            "pendingNames": [member_name_by_id[mid] for mid in pending_from_available],
            "neededCount": len(available_member_ids),
            "interestedCount": len(interested) + len(already_joined_available),
            "declinedCount": len(declined),
            "isReady": len(available_member_ids) > 0 and len(pending_from_available) == 0,
            "currentUserInterested": user_id in interested or user_id in already_joined_available,
            "currentUserDecision": current_decision,
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
            "membersWithAvailability": members_with_availability,
            "recommendationNote": recommendation_note,
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
        "upcomingGroupGames": [item[2] for item in upcoming_group_games[:5]],
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
        payment_reminder = _is_high_fill(projected_total, max_players)

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

        # Verify all eligible members were inserted to avoid silent partial success.
        joined_after = (
            db.table("game_participants")
            .select("user_id")
            .eq("game_id", room_id)
            .in_("user_id", eligible_ids)
            .execute()
            .data
            or []
        )
        joined_after_ids = {row["user_id"] for row in joined_after}
        if not set(eligible_ids).issubset(joined_after_ids):
            missing = sorted(set(eligible_ids) - joined_after_ids)
            raise HTTPException(
                status_code=500,
                detail=f"Auto-join incomplete. Missing users: {', '.join(missing)}",
            )
        return {
            "ok": True,
            "autoJoined": True,
            "joinedUserIds": sorted(eligible_ids),
            "paymentReminder": payment_reminder,
            "paymentDueHours": 24 if payment_reminder else None,
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
    incoming_ids = set()
    outgoing_ids = set()
    for row in relationships:
        other = row["friend_id"] if row["user_id"] == user_id else row["user_id"]
        if row["status"] == "accepted":
            friend_ids.add(other)
        elif row["status"] == "pending":
            pending_ids.add(other)
            if row.get("requested_by") == user_id:
                outgoing_ids.add(other)
            else:
                incoming_ids.add(other)

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
                "requestDirection": "incoming" if p["id"] in incoming_ids else ("outgoing" if p["id"] in outgoing_ids else None),
            }
            for p in players
        ],
        "incomingRequests": [
            {
                "id": p["id"],
                "name": p["display_name"],
                "publicSkillBand": p["public_skill_band"],
                "gamesPlayed": int(p.get("games_played") or 0),
            }
            for p in players
            if p["id"] in incoming_ids
        ],
        "outgoingRequests": [
            {
                "id": p["id"],
                "name": p["display_name"],
                "publicSkillBand": p["public_skill_band"],
                "gamesPlayed": int(p.get("games_played") or 0),
            }
            for p in players
            if p["id"] in outgoing_ids
        ],
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


@router.post("/friends/requests/{friend_id}/respond")
def respond_friend_request(friend_id: str, body: FriendRequestRespondBody):
    action = body.action.strip().lower()
    if action not in {"accept", "reject"}:
        raise HTTPException(status_code=400, detail="Action must be accept or reject")

    db = get_supabase()
    pending = (
        db.table("friendships")
        .select("id,user_id,friend_id,status,requested_by")
        .or_(
            f"and(user_id.eq.{body.user_id},friend_id.eq.{friend_id}),"
            f"and(user_id.eq.{friend_id},friend_id.eq.{body.user_id})"
        )
        .eq("status", "pending")
        .limit(1)
        .execute()
        .data
        or []
    )
    if not pending:
        raise HTTPException(status_code=404, detail="Pending request not found")

    row = pending[0]
    if row.get("requested_by") == body.user_id:
        raise HTTPException(status_code=403, detail="You cannot respond to your own outgoing request")

    if action == "accept":
        db.table("friendships").update({"status": "accepted", "updated_at": datetime.utcnow().isoformat()}).eq("id", row["id"]).execute()
        return {"ok": True, "status": "accepted"}

    db.table("friendships").delete().eq("id", row["id"]).execute()
    return {"ok": True, "status": "rejected"}


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

    community_tags: list[str] = []
    try:
        tag_rows = (
            db.table("player_tag_votes")
            .select("tag")
            .eq("rated_user_id", user_id)
            .execute()
            .data
            or []
        )
        counts: dict[str, int] = defaultdict(int)
        for row in tag_rows:
            counts[str(row.get("tag") or "")] += 1
        community_tags = sorted([tag for tag, count in counts.items() if tag and count > 5], key=lambda t: counts[t], reverse=True)
    except Exception:
        community_tags = []
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
            "communityTags": community_tags,
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
    participant_ids = [p["user_id"] for p in participants]

    my_group_rows = (
        db.table("group_members")
        .select("group_id")
        .eq("user_id", user_id)
        .execute()
        .data
        or []
    )
    my_group_ids = [row["group_id"] for row in my_group_rows]
    shared_users_with_me: set[str] = set()
    if my_group_ids and participant_ids:
        shared_rows = (
            db.table("group_members")
            .select("group_id,user_id")
            .in_("group_id", my_group_ids)
            .in_("user_id", participant_ids)
            .execute()
            .data
            or []
        )
        for row in shared_rows:
            shared_users_with_me.add(row["user_id"])
    shared_users_with_me.discard(user_id)

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
                "canRate": p["user_id"] != user_id and p["user_id"] not in shared_users_with_me,
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
        "tagOptions": sorted(ALLOWED_FEEDBACK_TAGS),
    }


@router.post("/feedback/{game_id}/submit")
def submit_feedback(game_id: str, body: FeedbackSubmitBody):
    if not body.ratings:
        raise HTTPException(status_code=400, detail="No ratings provided")

    db = get_supabase()
    participants = db.table("game_participants").select("user_id").eq("game_id", game_id).execute().data or []
    participant_ids = {row["user_id"] for row in participants}
    if body.user_id not in participant_ids:
        raise HTTPException(status_code=403, detail="You did not participate in this game")

    my_group_rows = (
        db.table("group_members")
        .select("group_id")
        .eq("user_id", body.user_id)
        .execute()
        .data
        or []
    )
    my_group_ids = [row["group_id"] for row in my_group_rows]
    shared_users_with_me: set[str] = set()
    if my_group_ids and participant_ids:
        shared_rows = (
            db.table("group_members")
            .select("user_id")
            .in_("group_id", my_group_ids)
            .in_("user_id", list(participant_ids))
            .execute()
            .data
            or []
        )
        shared_users_with_me = {row["user_id"] for row in shared_rows}
        shared_users_with_me.discard(body.user_id)

    rated_ids = [item.rated_user_id for item in body.ratings]
    if body.user_id in rated_ids:
        raise HTTPException(status_code=400, detail="You cannot rate yourself")
    invalid_non_participants = [uid for uid in rated_ids if uid not in participant_ids]
    if invalid_non_participants:
        raise HTTPException(status_code=400, detail=f"Cannot rate non-participants: {', '.join(sorted(set(invalid_non_participants)))}")
    blocked_shared_group = [uid for uid in rated_ids if uid in shared_users_with_me]
    if blocked_shared_group:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot rate players from your group(s): {', '.join(sorted(set(blocked_shared_group)))}",
        )

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

    try:
        db.table("player_tag_votes").select("id").limit(1).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"player_tag_votes table missing or unavailable: {exc}") from exc

    for item in body.ratings:
        tags = _normalize_feedback_tags(item.tags)
        db.table("player_tag_votes").delete().eq("game_id", game_id).eq("rater_user_id", body.user_id).eq("rated_user_id", item.rated_user_id).execute()
        if tags:
            db.table("player_tag_votes").insert(
                [
                    {
                        "game_id": game_id,
                        "rater_user_id": body.user_id,
                        "rated_user_id": item.rated_user_id,
                        "tag": tag,
                    }
                    for tag in tags
                ]
            ).execute()

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
