
"""
Controller module for browser-use application.
Coordinates between the agent, browser, and API.
"""
import logging
from src.agent import Agent
from src.browser import Browser
from src.sandbox import Sandbox
from src.utils import utils

logger = logging.getLogger(__name__)

class Controller:
    def __init__(self):
        """Initialize the controller with agent and browser instances."""
        self.agent = Agent()
        self.browser = Browser()
        self.sandbox = Sandbox()
        self.config = utils.ConfigManager()
        
    def run_task(self, task, additional_info=None):
        """
        Run a task using the agent and browser.
        
        Args:
            task (str): The task description
            additional_info (str, optional): Additional context for the task
            
        Returns:
            dict: Result of the task execution
        """
        logger.info(f"Running task: {task}")
        
        try:
            # Initialize browser if not already running
            if not self.browser.is_running():
                self.browser.start()
            
            # Initialize sandbox if needed
            if "execute" in task.lower() or "shell" in task.lower() or "command" in task.lower() or "ubuntu" in task.lower():
                if not self.sandbox.is_running():
                    self.sandbox.start()
            
            # Pass task to agent
            result = self.agent.execute_task(
                task=task, 
                additional_info=additional_info,
                browser=self.browser,
                sandbox=self.sandbox
            )
            
            return {
                "success": True,
                "result": result.get("result", "Task completed successfully"),
                "actions": result.get("actions", []),
                "thoughts": result.get("thoughts", []),
                "errors": result.get("errors", None)
            }
        except Exception as e:
            logger.error(f"Error running task: {e}")
            return {
                "success": False,
                "result": None,
                "error": str(e)
            }

    def stop_task(self):
        """Stop the current task execution."""
        return self.agent.stop_execution()
        
    def get_status(self):
        """Get the status of the controller, agent, and browser."""
        return {
            "agent_status": self.agent.get_status(),
            "browser_status": self.browser.is_running(),
            "sandbox_status": self.sandbox.is_running() if hasattr(self, "sandbox") else False,
        }
        
    def run_research(self, task, settings=None):
        """Run a deep research task."""
        # Import here to avoid circular dependency
        from src.utils.deep_research import deep_research
        
        return deep_research(task, settings or {})
        
    def execute_sandbox_command(self, command, timeout=None):
        """
        Execute a command in the sandbox.
        
        Args:
            command (str): The command to execute
            timeout (int, optional): Timeout in seconds
            
        Returns:
            dict: Result of the command execution
        """
        if not self.sandbox.is_running():
            self.sandbox.start()
            
        return self.sandbox.execute_command(command, timeout)

