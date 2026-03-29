from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str


class PingResponse(BaseModel):
    message: str
