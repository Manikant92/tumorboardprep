import json
import httpx
from typing import Dict, Any
from config import Settings


class GraniteError(Exception):
    """Base exception for Granite client errors"""
    pass


class AuthError(GraniteError):
    """Authentication failed - invalid API key"""
    pass


class RateLimitError(GraniteError):
    """Rate limit exceeded"""
    pass


class TimeoutError(GraniteError):
    """Request timeout"""
    pass


class GraniteClient:
    def __init__(self, settings: Settings):
        self.api_key = settings.watsonx_api_key
        self.project_id = settings.watsonx_project_id
        self.endpoint_url = settings.watsonx_endpoint_url
        self.model_id = settings.granite_model_id
        self.client = httpx.AsyncClient(timeout=30.0)
        self._iam_token = None
        self._token_expiry = 0
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    async def _get_iam_token(self) -> str:
        """Get IAM access token from IBM Cloud API key"""
        import time
        
        if self._iam_token and time.time() < self._token_expiry:
            return self._iam_token
        
        iam_url = "https://iam.cloud.ibm.com/identity/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
        data = {
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": self.api_key
        }
        
        try:
            response = await self.client.post(iam_url, headers=headers, data=data)
            if response.status_code != 200:
                raise AuthError(f"Failed to get IAM token: {response.text}")
            
            token_data = response.json()
            self._iam_token = token_data["access_token"]
            self._token_expiry = time.time() + token_data.get("expires_in", 3600) - 60
            return self._iam_token
            
        except httpx.HTTPError as e:
            raise AuthError(f"Failed to get IAM token: {str(e)}")
    
    async def synthesize(self, system_prompt: str, user_input: Dict[str, Any]) -> str:
        """
        Send case data to Granite for synthesis.
        
        Args:
            system_prompt: The system prompt from granite_system_prompt.md
            user_input: Dictionary of case data matching intake_form.json schema
        
        Returns:
            Generated synthesis text
        
        Raises:
            AuthError: Invalid API key
            RateLimitError: Rate limit exceeded
            TimeoutError: Request timeout
            GraniteError: Other Granite API errors
        """
        url = f"{self.endpoint_url}/ml/v1/text/chat?version=2023-05-29"
        
        iam_token = await self._get_iam_token()
        
        headers = {
            "Authorization": f"Bearer {iam_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        user_message = f"User input:\n{json.dumps(user_input, indent=2)}"
        
        payload = {
            "model_id": self.model_id,
            "project_id": self.project_id,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            "parameters": {
                "temperature": 0.3,
                "max_tokens": 800
            }
        }
        
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Using chat API with model: {self.model_id}")
        logger.info(f"System prompt length: {len(system_prompt)} chars")
        logger.info(f"User message length: {len(user_message)} chars")
        
        try:
            response = await self._make_request_with_retry(url, headers, payload)
            logger.info(f"Response received: {json.dumps(response)[:1000]}")
            return self._extract_generated_text(response)
        
        except httpx.TimeoutException as e:
            raise TimeoutError("Request to Granite timed out after 30 seconds") from e
        except (AuthError, RateLimitError):
            raise
        except Exception as e:
            raise GraniteError(f"Granite synthesis failed: {str(e)}") from e
    
    async def _make_request_with_retry(
        self, 
        url: str, 
        headers: Dict[str, str], 
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Make HTTP request with retry-once-on-5xx logic"""
        
        for attempt in range(2):
            try:
                response = await self.client.post(url, headers=headers, json=payload)
                
                if response.status_code == 401:
                    raise AuthError("Invalid watsonx API key. Check WATSONX_API_KEY in .env")
                
                if response.status_code == 429:
                    raise RateLimitError("Watsonx rate limit hit. Try again in 60 seconds")
                
                if response.status_code >= 500:
                    if attempt == 0:
                        continue
                    error_detail = response.text[:200]
                    raise GraniteError(f"Granite server error (HTTP {response.status_code}): {error_detail}")
                
                if response.status_code >= 400:
                    error_detail = response.text[:200]
                    raise GraniteError(f"Granite request failed (HTTP {response.status_code}): {error_detail}")
                
                response.raise_for_status()
                return response.json()
            
            except httpx.HTTPStatusError as e:
                if attempt == 0 and e.response.status_code >= 500:
                    continue
                raise
        
        raise GraniteError("Request failed after retry")
    
    def _extract_generated_text(self, response_data: Dict[str, Any]) -> str:
        """Extract generated text from Granite API response (supports both chat and text generation formats)"""
        try:
            # Try chat format first (newer API)
            choices = response_data.get("choices")
            if choices:
                message = choices[0].get("message", {})
                generated_text = message.get("content", "")
                if generated_text:
                    return generated_text.strip()
            
            # Fallback to text generation format (older API)
            results = response_data.get("results")
            if results:
                generated_text = results[0].get("generated_text", "")
                if generated_text:
                    return generated_text.strip()
            
            # If we get here, neither format worked
            raise GraniteError(f"No generated text found in response. Response keys: {list(response_data.keys())}")
        
        except (KeyError, IndexError, TypeError) as e:
            raise GraniteError(f"Failed to parse response: {str(e)}. Response: {json.dumps(response_data)[:500]}") from e

# Made with Bob
