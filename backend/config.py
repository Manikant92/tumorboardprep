from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    watsonx_api_key: str
    watsonx_project_id: str
    watsonx_endpoint_url: str = "https://us-south.ml.cloud.ibm.com"
    granite_model_id: str = "ibm/granite-4-h-small"
    app_port: int = 8000
    frontend_port: int = 5173

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent.parent / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Made with Bob
