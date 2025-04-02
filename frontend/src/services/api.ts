import { useAuth0 } from "@auth0/auth0-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7788/api";

export async function getAuthStatus() {
  const response = await fetch(`${API_URL}/auth/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get auth status: ${response.statusText}`);
  }

  return await response.json();
}

export async function getLLMProviders() {
  const response = await fetch(`${API_URL}/llm/providers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get LLM providers: ${response.statusText}`);
  }

  return await response.json();
}

export async function getLLMModels(provider: string) {
  const response = await fetch(`${API_URL}/llm/models?provider=${provider}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get LLM models: ${response.statusText}`);
  }

  return await response.json();
}

export async function getLLMSettings() {
  const response = await fetch(`${API_URL}/settings/llm`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get LLM settings: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateLLMSettings(settings: any) {
  const response = await fetch(`${API_URL}/settings/llm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Failed to update LLM settings: ${response.statusText}`);
  }

  return await response.json();
}

export async function getBrowserSettings() {
  const response = await fetch(`${API_URL}/settings/browser`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get browser settings: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateBrowserSettings(settings: any) {
  const response = await fetch(`${API_URL}/settings/browser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Failed to update browser settings: ${response.statusText}`);
  }

  return await response.json();
}

export async function getSandboxSettings() {
  const response = await fetch(`${API_URL}/settings/sandbox`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get sandbox settings: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateSandboxSettings(settings: any) {
  const response = await fetch(`${API_URL}/settings/sandbox`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Failed to update sandbox settings: ${response.statusText}`);
  }

  return await response.json();
}

export async function runAgent(task: string, additionalInfo?: string) {
  const response = await fetch(`${API_URL}/run-agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task, additionalInfo }),
  });

  if (!response.ok) {
    throw new Error(`Failed to run agent: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Handle browser automation actions
  if (result.type === 'browser_automation') {
    const actions = result.actions || [];
    for (const action of actions) {
      // Wait for each action to complete and get its status
      const actionStatus = await fetch(`${API_URL}/browser/action-status/${action.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!actionStatus.ok) {
        throw new Error(`Failed to get action status: ${actionStatus.statusText}`);
      }
      
      const status = await actionStatus.json();
      if (!status.success) {
        throw new Error(`Browser automation failed: ${status.error || 'Unknown error'}`);
      }
    }
  }

  return result;
}

export async function stopAgent() {
  const response = await fetch(`${API_URL}/agent/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to stop agent: ${response.statusText}`);
  }

  return await response.json();
}

export async function getAgentStatus() {
  const response = await fetch(`${API_URL}/agent/status`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to get agent status: ${response.statusText}`);
  }

  return await response.json();
}

export async function executeSandboxCommand(command: string, timeout?: number) {
  const response = await fetch(`${API_URL}/sandbox/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command, timeout }),
  });

  if (!response.ok) {
    throw new Error(`Failed to execute command: ${response.statusText}`);
  }

  return await response.json();
}
