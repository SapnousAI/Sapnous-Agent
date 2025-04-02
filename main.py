import argparse
import threading
import os
import sys

# Add the src directory to the path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))

# Import the API server and webui modules
from src.api.api_server import start_api_server
from webui import create_ui, main as webui_main

def start_api_server_thread(host, port):
    """Start the API server in a separate thread"""
    from src.api.api_server import start_api_server
    start_api_server(host=host, port=port)

def main():
    parser = argparse.ArgumentParser(description="Browser Use Web UI with API Server")
    parser.add_argument("--api-host", type=str, default="127.0.0.1", help="API server host")
    parser.add_argument("--api-port", type=int, default=7788, help="API server port")
    parser.add_argument("--ui-host", type=str, default="127.0.0.1", help="UI server host")
    parser.add_argument("--ui-port", type=int, default=7789, help="UI server port")
    parser.add_argument("--frontend-only", action="store_true", help="Start only the frontend")
    parser.add_argument("--api-only", action="store_true", help="Start only the API server")
    args = parser.parse_args()

    if args.frontend_only and args.api_only:
        print("Error: Cannot specify both --frontend-only and --api-only")
        return

    # Start API server
    if not args.frontend_only:
        print(f"Starting API server at http://{args.api_host}:{args.api_port}")
        if args.api_only:
            # If only API server is requested, start it in the main thread
            start_api_server(host=args.api_host, port=args.api_port)
        else:
            # Otherwise start it in a separate thread
            api_thread = threading.Thread(
                target=start_api_server_thread,
                args=(args.api_host, args.api_port),
                daemon=True
            )
            api_thread.start()

    # Start Gradio UI
    if not args.api_only:
        print(f"Starting Gradio UI at http://{args.ui_host}:{args.ui_port}")
        # Create and launch the Gradio UI
        demo = create_ui()
        demo.launch(server_name=args.ui_host, server_port=args.ui_port)

if __name__ == "__main__":
    main()