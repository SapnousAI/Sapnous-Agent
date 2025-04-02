import logging
from typing import Dict, Any, Optional
from playwright.async_api import Page

logger = logging.getLogger(__name__)

class BrowserAutomation:
    def __init__(self, page: Page):
        self.page = page
        
    async def navigate(self, url: str) -> Dict[str, Any]:
        """Navigate to a URL"""
        try:
            logger.info(f"Navigating to {url}")
            await self.page.goto(url)
            return {"success": True, "message": f"Successfully navigated to {url}"}
        except Exception as e:
            logger.error(f"Failed to navigate to {url}: {e}")
            return {"success": False, "error": str(e)}
    
    async def input_text(self, selector: str, text: str) -> Dict[str, Any]:
        """Input text into an element"""
        try:
            logger.info(f"Inputting text '{text}' into element '{selector}'")
            await self.page.fill(selector, text)
            return {"success": True, "message": f"Successfully input text into {selector}"}
        except Exception as e:
            logger.error(f"Failed to input text: {e}")
            return {"success": False, "error": str(e)}
    
    async def click(self, selector: str) -> Dict[str, Any]:
        """Click an element"""
        try:
            logger.info(f"Clicking element '{selector}'")
            await self.page.click(selector)
            return {"success": True, "message": f"Successfully clicked {selector}"}
        except Exception as e:
            logger.error(f"Failed to click element: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_current_url(self) -> str:
        """Get the current page URL"""
        return self.page.url
    
    async def execute_action(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a browser action"""
        logger.info(f"Executing browser action: {action} with params: {params}")
        
        if action == "navigate":
            return await self.navigate(params.get("url", ""))
        elif action == "input_text":
            return await self.input_text(params.get("selector", ""), params.get("text", ""))
        elif action == "click":
            return await self.click(params.get("selector", ""))
        else:
            logger.error(f"Unknown browser action: {action}")
            return {"success": False, "error": f"Unknown action: {action}"}