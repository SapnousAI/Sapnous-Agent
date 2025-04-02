
"""
Agent controller for executing tasks autonomously
"""
import os
import logging
import json
import asyncio
from typing import Dict, List, Optional, Any

from src.sandbox import Sandbox

logger = logging.getLogger(__name__)

class AgentController:
    """
    Controller for autonomous agent that can execute tasks in sandbox
    and other environments
    """
    def __init__(self):
        self.sandbox = Sandbox()
        self.sandbox.start()
        self.tasks = []
        self.is_running = False
        self.current_task = None
    
    async def execute_task(self, task: str, additional_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Execute a task with the agent
        
        Args:
            task: The task to execute
            additional_context: Additional context or instructions
            
        Returns:
            Dict with execution results
        """
        self.is_running = True
        self.current_task = task
        
        try:
            # Execute the task in the sandbox if it requires shell access
            if any(keyword in task.lower() for keyword in ["execute", "run", "shell", "terminal", "command", "install"]):
                # Extract the command if possible or use a safe echo command
                command = task.split("run")[-1].strip() if "run" in task.lower() else task.split("execute")[-1].strip()
                if not command or len(command) < 3:
                    command = "echo 'Hello from sandbox'"
                    
                result = self.sandbox.execute_command(command)
                return {
                    "success": result.get("success", False),
                    "output": result.get("stdout", ""),
                    "error": result.get("stderr", ""),
                    "type": "sandbox"
                }
            
            # Here we would integrate with other systems based on the task type
            # For now, return a simple acknowledgement
            return {
                "success": True,
                "output": f"Task '{task}' received and processed",
                "type": "agent"
            }
            
        except Exception as e:
            logger.error(f"Error executing task: {e}")
            return {
                "success": False,
                "error": str(e),
                "type": "error"
            }
        finally:
            self.is_running = False
            
    def stop_execution(self):
        """Stop the current execution"""
        self.is_running = False
        return {"success": True, "message": "Execution stopped"}
