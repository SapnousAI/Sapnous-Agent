import asyncio


class AgentState:
    _instance = None

    def __init__(self):
        if not hasattr(self, '_stop_requested'):
            self._stop_requested = asyncio.Event()
            self.last_valid_state = None  # store the last valid browser state
            self.browser_state = {
                "is_running": False,
                "current_url": None,
                "last_action": None,
                "last_action_result": None
            }

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AgentState, cls).__new__(cls)
        return cls._instance

    def request_stop(self):
        self._stop_requested.set()

    def clear_stop(self):
        self._stop_requested.clear()
        self.last_valid_state = None

    def is_stop_requested(self):
        return self._stop_requested.is_set()

    def set_last_valid_state(self, state):
        self.last_valid_state = state

    def get_last_valid_state(self):
        return self.last_valid_state

    def get_state(self):
        return {
            "stop_requested": self.is_stop_requested(),
            "last_valid_state": self.get_last_valid_state()
        }

    def set_state(self, state):
        self.last_valid_state = state
