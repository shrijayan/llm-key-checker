"""
Validator for OpenAI API keys using the official OpenAI Python library
"""
import os
import json
from openai import OpenAI, APIError, AuthenticationError, RateLimitError

def validate_openai_key(api_key):
    """
    Validates if the provided OpenAI API key is working using the official OpenAI SDK
    
    Args:
        api_key (str): OpenAI API key to validate
        
    Returns:
        dict: Dictionary containing validation result with status and message
    """
    if not api_key or not isinstance(api_key, str) or api_key.strip() == "":
        return {
            "valid": False,
            "message": "Invalid API key format"
        }
    
    try:
        # Create client with the provided API key
        client = OpenAI(api_key=api_key.strip())
        
        # Make a lightweight call to models list to verify the key
        models = client.models.list()
        
        # If we get here without exception, the key is valid
        return {
            "valid": True,
            "message": "OpenAI API key is valid"
        }
    except AuthenticationError:
        return {
            "valid": False,
            "message": "Invalid OpenAI API key"
        }
    except RateLimitError:
        return {
            "valid": False,
            "message": "API rate limit exceeded, but the key appears valid"
        }
    except APIError as e:
        return {
            "valid": False,
            "message": f"OpenAI API error: {str(e)}"
        }
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error validating OpenAI API key: {str(e)}"
        }


if __name__ == "__main__":
    # For testing purposes only
    test_key = os.environ.get("OPENAI_API_KEY", "")
    result = validate_openai_key(test_key)
    print(json.dumps(result, indent=2))
