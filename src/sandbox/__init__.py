
"""
Sandbox module for executing shell commands in a safe environment.
"""
import logging
import os
import subprocess
import tempfile
import shlex
import uuid
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class Sandbox:
    def __init__(self):
        """Initialize the sandbox environment."""
        self._running = False
        # Load environment variables from .env file if present
        from dotenv import load_dotenv
        load_dotenv()
        self.sandbox_enabled = os.environ.get("ENABLE_SANDBOX", "false").lower() == "true"
        self.sandbox_user = os.environ.get("SANDBOX_USER", "sandbox")
        self.sandbox_home = os.environ.get("SANDBOX_HOME", "/home/sandbox")
        self.sandbox_timeout = int(os.environ.get("SANDBOX_TIMEOUT", "300"))
        self.session_id = str(uuid.uuid4())
        self.working_directory = os.path.join(tempfile.gettempdir(), f"ai-sandbox-{self.session_id}")
        
        if not os.path.exists(self.working_directory) and self.sandbox_enabled:
            os.makedirs(self.working_directory, exist_ok=True)
            logger.info(f"Created sandbox working directory: {self.working_directory}")
        
    def start(self):
        """Start the sandbox environment."""
        if not self.sandbox_enabled:
            logger.warning("Sandbox is disabled. Enable it by setting ENABLE_SANDBOX=true")
            return False
            
        try:
            logger.info("Starting sandbox environment...")
            self._running = True
            return True
        except Exception as e:
            logger.error(f"Failed to start sandbox: {e}")
            self._running = False
            return False
    
    def is_running(self):
        """Check if the sandbox is running."""
        return self._running and self.sandbox_enabled
    
    def stop(self):
        """Stop the sandbox environment."""
        if self._running:
            logger.info("Stopping sandbox environment...")
            self._running = False
            return True
        return False
    
    def execute_command(self, command: str, timeout: Optional[int] = None) -> Dict:
        """
        Execute a shell command in the sandbox environment.
        
        Args:
            command: The command to execute
            timeout: Timeout in seconds (defaults to sandbox_timeout)
            
        Returns:
            dict: Result containing stdout, stderr, and exit code
        """
        if not self.is_running():
            if self.sandbox_enabled:
                self.start()
            else:
                return {
                    "success": False,
                    "stdout": "",
                    "stderr": "Sandbox is not enabled. Set ENABLE_SANDBOX=true in .env",
                    "exit_code": 1
                }
                
        if not timeout:
            timeout = self.sandbox_timeout
            
        try:
            # Use subprocess.run with safe arguments
            args = shlex.split(command)
            logger.info(f"Executing command in sandbox: {command}")
            
            env = os.environ.copy()
            env["SANDBOX_SESSION_ID"] = self.session_id
            
            result = subprocess.run(
                args,
                capture_output=True,
                text=True,
                cwd=self.working_directory,
                timeout=timeout,
                env=env,
                shell=False
            )
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "exit_code": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "stdout": "",
                "stderr": f"Command timed out after {timeout} seconds",
                "exit_code": 124
            }
        except Exception as e:
            logger.error(f"Error executing command: {e}")
            return {
                "success": False,
                "stdout": "",
                "stderr": str(e),
                "exit_code": 1
            }
    
    def create_file(self, file_path: str, content: str) -> Dict:
        """
        Create a file in the sandbox environment.
        
        Args:
            file_path: The path to the file
            content: The content of the file
            
        Returns:
            dict: Result of the operation
        """
        if not self.is_running():
            if self.sandbox_enabled:
                self.start()
            else:
                return {
                    "success": False,
                    "error": "Sandbox is not enabled. Set ENABLE_SANDBOX=true in .env"
                }
                
        try:
            # Make sure the file path is within the working directory
            full_path = os.path.join(self.working_directory, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, 'w') as f:
                f.write(content)
                
            return {
                "success": True,
                "path": full_path
            }
        except Exception as e:
            logger.error(f"Error creating file: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def read_file(self, file_path: str) -> Dict:
        """
        Read a file from the sandbox environment.
        
        Args:
            file_path: The path to the file
            
        Returns:
            dict: Result containing the file content or error
        """
        if not self.is_running():
            if self.sandbox_enabled:
                self.start()
            else:
                return {
                    "success": False,
                    "error": "Sandbox is not enabled. Set ENABLE_SANDBOX=true in .env"
                }
                
        try:
            # Make sure the file path is within the working directory
            full_path = os.path.join(self.working_directory, file_path)
            
            with open(full_path, 'r') as f:
                content = f.read()
                
            return {
                "success": True,
                "content": content,
                "path": full_path
            }
        except Exception as e:
            logger.error(f"Error reading file: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def list_files(self, directory: str = "") -> Dict:
        """
        List files in a directory within the sandbox environment.
        
        Args:
            directory: The directory to list files from (relative to working directory)
            
        Returns:
            dict: Result containing the list of files
        """
        if not self.is_running():
            if self.sandbox_enabled:
                self.start()
            else:
                return {
                    "success": False,
                    "error": "Sandbox is not enabled. Set ENABLE_SANDBOX=true in .env"
                }
                
        try:
            # Make sure the directory path is within the working directory
            full_path = os.path.join(self.working_directory, directory)
            
            files = os.listdir(full_path)
            
            return {
                "success": True,
                "files": files,
                "directory": full_path
            }
        except Exception as e:
            logger.error(f"Error listing files: {e}")
            return {
                "success": False,
                "error": str(e)
            }

