from drf_pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    username: str
    email: str


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class MessageResponse(BaseModel):
    message: str
