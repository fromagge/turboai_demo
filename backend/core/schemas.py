from drf_pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    database: str
    cache: str


class HelloResponse(BaseModel):
    message: str
