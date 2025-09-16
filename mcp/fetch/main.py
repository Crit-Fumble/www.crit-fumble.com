import sys
import json
import os
from typing import Dict, Any

def handle_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """Handle incoming MCP file operation requests."""
    operation = request.get('operation')
    try:
        if operation == 'read':
            with open(request['path'], 'r', encoding='utf-8') as f:
                return {'content': f.read()}
        elif operation == 'write':
            os.makedirs(os.path.dirname(request['path']), exist_ok=True)
            with open(request['path'], 'w', encoding='utf-8') as f:
                f.write(request['content'])
            return {'success': True}
        else:
            return {'error': f'Unknown operation: {operation}'}
    except Exception as e:
        return {'error': f'{type(e).__name__}: {str(e)}'}

def main() -> None:
    """Main entry point for the MCP fetch server."""
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            
            request = json.loads(line)
            response = handle_request(request)
            print(json.dumps(response), flush=True)
        except Exception as e:
            print(json.dumps({'error': f'{type(e).__name__}: {str(e)}'}), flush=True)

if __name__ == '__main__':
    main()