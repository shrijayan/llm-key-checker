"""
Validator for AWS Bedrock API keys
"""
import os
import json
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

def validate_bedrock_key(aws_access_key_id, aws_secret_access_key, region="us-east-1"):
    """
    Validates if the provided AWS credentials can access Bedrock
    
    Args:
        aws_access_key_id (str): AWS Access Key ID
        aws_secret_access_key (str): AWS Secret Access Key
        region (str, optional): AWS region. Defaults to "us-east-1".
        
    Returns:
        dict: Dictionary containing validation result with status and message
    """
    if (not aws_access_key_id or not isinstance(aws_access_key_id, str) or 
            not aws_secret_access_key or not isinstance(aws_secret_access_key, str)):
        return {
            "valid": False,
            "message": "Invalid AWS credentials format"
        }
    
    try:
        # Create a Bedrock client with the provided credentials
        session = boto3.Session(
            aws_access_key_id=aws_access_key_id.strip(),
            aws_secret_access_key=aws_secret_access_key.strip(),
            region_name=region
        )
        
        # Create a Bedrock client and try to list the foundation models
        bedrock = session.client('bedrock')
        
        # List foundation models to validate the credentials
        response = bedrock.list_foundation_models()
        
        # If we get here without exception, the credentials are valid
        return {
            "valid": True,
            "message": "AWS Bedrock credentials are valid"
        }
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        error_message = e.response.get('Error', {}).get('Message', str(e))
        
        if error_code in ('AccessDeniedException', 'UnauthorizedException', 'UnrecognizedClientException'):
            return {
                "valid": False,
                "message": "Invalid AWS credentials or insufficient permissions for Bedrock"
            }
        else:
            return {
                "valid": False,
                "message": f"AWS Bedrock error: {error_code}, {error_message}"
            }
    except NoCredentialsError:
        return {
            "valid": False,
            "message": "No AWS credentials provided"
        }
    except Exception as e:
        return {
            "valid": False,
            "message": f"Error validating AWS Bedrock credentials: {str(e)}"
        }


if __name__ == "__main__":
    # For testing purposes only
    test_access_key = os.environ.get("AWS_ACCESS_KEY_ID", "")
    test_secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
    test_region = os.environ.get("AWS_REGION", "us-east-1")
    
    result = validate_bedrock_key(test_access_key, test_secret_key, test_region)
    print(json.dumps(result, indent=2))
