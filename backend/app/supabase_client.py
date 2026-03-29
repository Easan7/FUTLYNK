from functools import lru_cache

from supabase import Client, create_client

from backend.app.settings import get_settings


@lru_cache
def get_supabase() -> Client:
    settings = get_settings()
    key = settings.supabase_service_role_key or settings.supabase_anon_key
    if not settings.supabase_url or not key:
        raise RuntimeError("Supabase credentials are not configured in backend/.env")
    return create_client(settings.supabase_url, key)
