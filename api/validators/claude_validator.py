"""
Validator for Anthropic Claude API keys
"""
import os
import json
import requests

def validate_claude_key(api_key):
    """
    Validates if the provided Anthropic Claude API key is working
    
    Args:
        api_key (str): Anthropic Claude API key to validate
        
    Returns:
        dict: Dictionary containing validation result with status and message
    """
    if not api_key or not isinstance(api_key, str) or api_key.strip() == "":
        return {
            "valid": False,
            "message": "Invalid API key format"
        }
    
    # Anthropic API endpoint for models list
    url = "https://api.anthropic.com/v1/models"
    headers = {
        "x-api-key": api_key.strip(),
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            return {
                "valid": True,
                "message": "Claude API key is valid"
            }
        elif response.status_code in (401, 403):
            return {
                "valid": False,
                "message": "Invalid Claude API key"
            }
        else:
            return {
                "valid": False,
                "message": f"Claude API error: {response.status_code}, {response.text}"
            }
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error validating Claude API key: {str(e)}"
        }


if __name__ == "__main__":
    # For testing purposes only
    test_key = os.environ.get("ANTHROPIC_API_KEY", "")
    result = validate_claude_key(test_key)
    print(json.dumps(result, indent=2))
