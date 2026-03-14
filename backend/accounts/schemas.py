from drf_pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    @classmethod
    def from_user(cls, user) -> dict:
        return cls(id=user.id, username=user.username, email=user.email).model_dump()
