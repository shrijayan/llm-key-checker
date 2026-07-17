#!/usr/bin/env python3
"""
Stdin/stdout JSON bridge so Node (Next.js API route) can invoke the Python
validators as a subprocess instead of statically importing a .py file from
TypeScript (which no JS bundler can resolve).

Contract: reads one JSON object from stdin, always writes exactly one JSON
object to stdout, and always exits 0 - all failures are captured in the
returned JSON body rather than via exit code/stderr, so the Node caller
never has to distinguish "crashed" from "returned invalid".
"""
import sys
import json

from validators import (
    validate_openai_key,
    validate_claude_key,
    validate_gemini_key,
    validate_bedrock_key,
)


def main():
    try:
        payload = json.loads(sys.stdin.read())
    except Exception as e:
        print(json.dumps({"valid": False, "message": f"Invalid request payload: {e}"}))
        return

    provider = (payload.get("provider") or "").lower()

    try:
        if provider == "openai":
            result = validate_openai_key(payload.get("apiKey"))
        elif provider == "claude":
            result = validate_claude_key(payload.get("apiKey"))
        elif provider == "gemini":
            result = validate_gemini_key(payload.get("apiKey"))
        elif provider == "bedrock":
            result = validate_bedrock_key(
                payload.get("awsAccessKey"),
                payload.get("awsSecretKey"),
                payload.get("awsRegion") or "us-east-1",
            )
        else:
            result = {"valid": False, "message": f"Unsupported provider: {provider}"}
    except Exception as e:
        result = {"valid": False, "message": f"Validator crashed: {e}"}

    print(json.dumps(result))


if __name__ == "__main__":
    main()
