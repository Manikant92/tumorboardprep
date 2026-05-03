import httpx
import json
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def test_granite():
    api_key = os.getenv("WATSONX_API_KEY")
    project_id = os.getenv("WATSONX_PROJECT_ID")
    endpoint = os.getenv("WATSONX_ENDPOINT_URL")
    
    # Step 1: Get IAM token
    print("Step 1: Getting IAM token...")
    iam_url = "https://iam.cloud.ibm.com/identity/token"
    async with httpx.AsyncClient(timeout=30.0) as client:
        iam_response = await client.post(
            iam_url,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                "apikey": api_key
            }
        )
        token_data = iam_response.json()
        iam_token = token_data["access_token"]
        print(f"[OK] Got IAM token: {iam_token[:20]}...")
        
        # Step 2: Call Granite
        print("\nStep 2: Calling Granite API...")
        url = f"{endpoint}/ml/v1/text/generation?version=2023-05-29"
        
        headers = {
            "Authorization": f"Bearer {iam_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        payload = {
            "model_id": "ibm/granite-4-h-small",
            "project_id": project_id,
            "input": "Write a short summary of lung cancer treatment options.",
            "parameters": {
                "temperature": 0.3,
                "max_new_tokens": 200,
                "decoding_method": "greedy"
            }
        }
        
        print(f"Request URL: {url}")
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = await client.post(url, headers=headers, json=payload)
        
        print(f"\nResponse status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"\nFull response body:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            if results:
                print(f"\n[OK] Generated text: {results[0].get('generated_text', 'EMPTY')}")
            else:
                print("\n[ERROR] No results in response")

asyncio.run(test_granite())

# Made with Bob
