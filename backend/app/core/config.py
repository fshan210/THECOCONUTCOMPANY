from functools import lru_cache

from pydantic import Field, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = ".CO API"
    app_env: str = "local"
    api_v1_prefix: str = "/api/v1"
    database_url: PostgresDsn = Field(
        default="postgresql+psycopg://co_user:replace-me@localhost:5432/co_coconut"
    )
    db_pool_size: int = 5
    db_max_overflow: int = 10
    db_pool_timeout: int = 30
    cors_origins: list[str] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
