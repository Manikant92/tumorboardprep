from fastapi import APIRouter, HTTPException, Depends
from models import CaseIntakeRequest, SynthesisResponse, ErrorResponse
from config import Settings, get_settings
from granite_client import GraniteClient, AuthError, RateLimitError, TimeoutError, GraniteError
from utils.prompt_loader import load_system_prompt

router = APIRouter()

system_prompt = None


def get_system_prompt() -> str:
    """Load system prompt once at startup"""
    global system_prompt
    if system_prompt is None:
        system_prompt = load_system_prompt()
    return system_prompt


@router.post("/synthesize", response_model=SynthesisResponse, responses={
    400: {"model": ErrorResponse, "description": "Validation error"},
    401: {"model": ErrorResponse, "description": "Authentication error"},
    429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
    500: {"model": ErrorResponse, "description": "Server error"},
    504: {"model": ErrorResponse, "description": "Timeout"}
})
async def synthesize_case(
    case_data: CaseIntakeRequest,
    settings: Settings = Depends(get_settings)
):
    """
    Synthesize a tumor board case card from raw clinical inputs.
    
    Sends the case data to watsonx.ai Granite for synthesis into a structured
    one-page tumor board presentation card.
    """
    client = GraniteClient(settings)
    
    try:
        prompt = get_system_prompt()
        
        case_dict = case_data.model_dump()
        
        synthesis = await client.synthesize(prompt, case_dict)
        
        return SynthesisResponse(
            synthesis=synthesis,
            model_used=settings.granite_model_id,
            cached=False
        )
    
    except AuthError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    
    except RateLimitError as e:
        raise HTTPException(
            status_code=429,
            detail=str(e)
        )
    
    except TimeoutError as e:
        raise HTTPException(
            status_code=504,
            detail=str(e)
        )
    
    except GraniteError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Synthesis failed: {str(e)}"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )
    
    finally:
        await client.close()

# Made with Bob
