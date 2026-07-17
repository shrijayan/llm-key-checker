"""
Validator for Google Gemini API keys
"""
import os
import json
import requests

def validate_gemini_key(api_key):
    """
    Validates if the provided Google Gemini API key is working
    
    Args:
        api_key (str): Google Gemini API key to validate
        
    Returns:
        dict: Dictionary containing validation result with status and message
    """
    if not api_key or not isinstance(api_key, str) or api_key.strip() == "":
        return {
            "valid": False,
            "message": "Invalid API key format"
        }
    
    # Google AI Studio API endpoint for models list
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key.strip()}"
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            return {
                "valid": True,
                "message": "Gemini API key is valid"
            }
        elif response.status_code in (400, 401, 403):
            return {
                "valid": False,
                "message": "Invalid Gemini API key"
            }
        else:
            return {
                "valid": False,
                "message": f"Gemini API error: {response.status_code}, {response.text}"
            }
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error validating Gemini API key: {str(e)}"
        }


if __name__ == "__main__":
    # For testing purposes only
    test_key = os.environ.get("GEMINI_API_KEY", "")
    result = validate_gemini_key(test_key)
    print(json.dumps(result, indent=2))
