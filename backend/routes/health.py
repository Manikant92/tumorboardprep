from fastapi import APIRouter, Depends
from config import Settings, get_settings

router = APIRouter()


@router.get("/health")
async def health_check(settings: Settings = Depends(get_settings)):
    return {
        "status": "healthy",
        "granite_model": settings.granite_model_id
    }

# Made with Bob
