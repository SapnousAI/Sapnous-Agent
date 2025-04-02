
"""
Utility functions for the browser-use application.
"""
import os
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def get_models_for_provider(provider):
    """
    Get available models for a given LLM provider.
    
    Args:
        provider (str): The provider name
        
    Returns:
        list: Available models
    """
    provider_models = {
        "openai": ["gpt-3.5-turbo", "gpt-4", "gpt-4o"],
        "ollama": ["llama2", "mistral", "mixtral"],
        "anthropic": ["claude-2", "claude-instant", "claude-3-opus"],
        "google": ["gemini-pro", "gemini-ultra"],
        "azure": ["gpt-4", "gpt-3.5-turbo"],
        "custom": ["custom-model"]
    }
    
    return provider_models.get(provider.lower(), [])

def get_latest_files(directory, extensions):
    """
    Get the latest files in a directory with specific extensions.
    
    Args:
        directory (str): Directory to search
        extensions (list): List of file extensions to include
        
    Returns:
        list: Metadata about the found files
    """
    results = []
    try:
        base_dir = Path(directory)
        if not base_dir.exists():
            logger.warning(f"Directory {directory} does not exist")
            return results
            
        # Find all files with matching extensions
        for ext in extensions:
            for file_path in base_dir.glob(f"*.{ext}"):
                if file_path.is_file():
                    results.append({
                        "name": file_path.name,
                        "path": str(file_path),
                        "size": file_path.stat().st_size,
                        "created": file_path.stat().st_ctime,
                        "modified": file_path.stat().st_mtime
                    })
                    
        # Sort by most recently modified
        results.sort(key=lambda x: x["modified"], reverse=True)
        return results
    except Exception as e:
        logger.error(f"Error getting latest files: {e}")
        return []

class ConfigManager:
    """Manager for handling configuration."""
    
    def __init__(self, config_file="config.json"):
        """Initialize with a configuration file path."""
        self.config_file = config_file
        self.config = self._load_config()
        
    def _load_config(self):
        """Load configuration from file."""
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading config: {e}")
        
        # Return default config if file doesn't exist or has an error
        return {
            "llm": {
                "provider": "openai",
                "model": "gpt-3.5-turbo",
                "temperature": 0.7
            },
            "browser": {
                "headless": False,
                "record_video": False,
                "persistent_session": False
            },
            "ui": {
                "theme": "light",
                "show_browser": True
            }
        }
        
    def save_current_config(self):
        """Save the current configuration to file."""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
            return self.config_file
        except Exception as e:
            logger.error(f"Error saving config: {e}")
            return None
            
    def update_ui_from_config(self, config_data):
        """Update UI configuration from loaded config."""
        if not config_data:
            return
            
        # Update the config with new data
        self.config.update(config_data)
        return self.save_current_config()
        
    def get_config(self, section=None):
        """Get configuration, optionally for a specific section."""
        if section:
            return self.config.get(section, {})
        return self.config

    def update_config(self, section, data):
        """Update a section of the configuration."""
        if section not in self.config:
            self.config[section] = {}
            
        self.config[section].update(data)
        return self.save_current_config()
