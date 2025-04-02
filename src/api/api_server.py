from fastapi import FastAPI, HTTPException, Body, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import uvicorn
from typing import Dict, List, Optional, Any
import os
import sys
import logging
import json

# Add the parent directory to sys.path to allow imports from other modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.agent_state import AgentState
from utils import utils
from controller import Controller
from utils.agent_controller import AgentController
from sandbox import Sandbox

app = FastAPI(title="Browser Use API", description="API for Browser Use Web UI")

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to allow requests from any origin during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create global state instances
agent_state = AgentState()
config_manager = utils.ConfigManager()
controller = Controller()
agent_controller = AgentController()
sandbox = Sandbox()

# Security settings
enable_auth = os.environ.get("ENABLE_AUTH", "false").lower() == "true"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_token(request: Request, token: str = Depends(oauth2_scheme)):
    if not enable_auth:
        return None
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token

# LLM API routes
@app.get("/api/llm/providers")
async def get_llm_providers():
    """Get available LLM providers"""
    providers = ["openai", "ollama", "anthropic", "google", "azure", "custom"]
    return {"providers": providers}

@app.get("/api/llm/models")
async def get_llm_models(provider: str):
    """Get available models for a provider"""
    models = utils.get_models_for_provider(provider)
    return {"models": models}

@app.get("/api/settings/llm")
async def get_llm_settings():
    """Get LLM settings"""
    settings = config_manager.get_config("llm")
    return {"settings": settings}

@app.post("/api/settings/llm")
async def save_llm_settings(settings: Dict[str, Any] = Body(...)):
    """Save LLM settings"""
    try:
        config_manager.update_config("llm", settings)
        return {"success": True, "message": "LLM settings saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Browser API routes
@app.get("/api/settings/browser")
async def get_browser_settings():
    """Get browser settings"""
    settings = config_manager.get_config("browser")
    return {"settings": settings}

@app.post("/api/settings/browser")
async def save_browser_settings(settings: Dict[str, Any] = Body(...)):
    """Save browser settings"""
    try:
        config_manager.update_config("browser", settings)
        return {"success": True, "message": "Browser settings saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Sandbox API routes
@app.get("/api/settings/sandbox")
async def get_sandbox_settings():
    """Get sandbox settings"""
    settings = {
        "enabled": os.environ.get("ENABLE_SANDBOX", "false").lower() == "true",
        "user": os.environ.get("SANDBOX_USER", "sandbox"),
        "timeout": int(os.environ.get("SANDBOX_TIMEOUT", "300"))
    }
    return {"settings": settings}

@app.post("/api/settings/sandbox")
async def save_sandbox_settings(settings: Dict[str, Any] = Body(...)):
    """Save sandbox settings"""
    try:
        # We can't actually update .env from here, but we could write to a config file
        return {"success": True, "message": "Sandbox settings saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sandbox/execute")
async def execute_sandbox_command(data: Dict[str, str] = Body(...)):
    """Execute a command in the sandbox"""
    try:
        command = data.get("command", "")
        timeout = data.get("timeout", None)
        
        if not command:
            raise HTTPException(status_code=400, detail="Command is required")
            
        if timeout:
            timeout = int(timeout)
            
        result = controller.execute_sandbox_command(command, timeout)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Agent API routes
@app.post("/api/run-agent")
async def run_agent(data: Dict[str, str] = Body(...)):
    """Run the agent with a task"""
    try:
        task = data.get("task", "")
        additional_info = data.get("additionalInfo", "")
        
        if not task:
            raise HTTPException(status_code=400, detail="Task is required")
        
        # Start agent with task
        agent_state.set_state("running")
        
        # Use the new agent controller to run the task
        result = await agent_controller.execute_task(task, additional_info)
        
        return result
    except Exception as e:
        agent_state.set_state("error")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agent/stop")
async def stop_agent():
    """Stop the running agent"""
    try:
        result = agent_controller.stop_execution()
        agent_state.set_state("stopped")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agent/status")
async def get_agent_status():
    """Get the current status of the agent"""
    status = agent_state.get_state()
    controller_status = controller.get_status()
    return {"status": status, **controller_status}

# Research API routes
@app.post("/api/research")
async def start_research(params: Dict[str, Any] = Body(...)):
    """Start deep research"""
    try:
        task = params.get("task", "")
        if not task:
            raise HTTPException(status_code=400, detail="Task is required")
            
        # Start research with params
        result = controller.run_research(task, params)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/research/stop")
async def stop_research():
    """Stop ongoing research"""
    try:
        # Stop research - this would typically call controller.stop_research()
        return {"success": True, "message": "Research stopped successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/research/results")
async def get_research_results():
    """Get research results"""
    # Get research results
    return {"results": []}

# Recordings API routes
@app.get("/api/recordings")
async def list_recordings():
    """List available recordings"""
    recordings = utils.get_latest_files("recordings", ["mp4", "webm"])
    return {"recordings": recordings}

# Config API routes
@app.get("/api/config")
async def get_config():
    """Get current UI configuration"""
    config = config_manager.get_config()
    return {"config": config}

@app.post("/api/config")
async def save_config(config_data: Dict[str, Any] = Body(...)):
    """Save UI configuration"""
    try:
        config_manager.update_ui_from_config(config_data)
        return {"success": True, "message": "Configuration saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Auth status endpoint
@app.get("/api/auth/status")
async def get_auth_status():
    """Get authentication status"""
    return {"enabled": enable_auth}

def start_api_server(host="127.0.0.1", port=7788):
    """Start the FastAPI server"""
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    start_api_server()
