import httpx
import json
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("WATSONX_API_KEY")
project_id = os.getenv("WATSONX_PROJECT_ID")
endpoint = os.getenv("WATSONX_ENDPOINT_URL")

print(f"Testing watsonx.ai authentication...")
print(f"Endpoint: {endpoint}")
print(f"Project ID: {project_id}")
print(f"API Key: {api_key[:10]}..." if api_key else "API Key: None")

url = f"{endpoint}/ml/v1/text/generation?version=2023-05-29"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

payload = {
    "model_id": "ibm/granite-4-h-small",
    "project_id": project_id,
    "input": "Hello, this is a test.",
    "parameters": {
        "temperature": 0.3,
        "max_new_tokens": 50
    }
}

try:
    response = httpx.post(url, headers=headers, json=payload, timeout=30.0)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")
    
    if response.status_code == 401:
        print("\n❌ Authentication failed!")
        print("The API key format or authentication method may be incorrect.")
        print("\nTry these steps:")
        print("1. Verify your API key is a valid IBM Cloud API key")
        print("2. Check if you need to generate an IAM token first")
        print("3. Verify the project ID is correct")
    elif response.status_code == 200:
        print("\n✅ Authentication successful!")
        result = response.json()
        print(f"Generated text: {result.get('results', [{}])[0].get('generated_text', 'N/A')}")
    else:
        print(f"\n⚠️ Unexpected status code: {response.status_code}")
        
except Exception as e:
    print(f"\n❌ Error: {str(e)}")

# Made with Bob
