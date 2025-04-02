
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeWidget from "@/components/dashboard/WelcomeWidget";
import ChatInterface from "@/components/chat/ChatInterface";
import RunAgent from "@/components/dashboard/RunAgent";
import { useEffect, useState } from "react";
import { runAgent, getAgentStatus, stopAgent, executeSandboxCommand } from "@/services/api"; 
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [agentStatus, setAgentStatus] = useState<{status: string; agent_status: string; browser_status: boolean; sandbox_status: boolean}>({
    status: "idle",
    agent_status: "idle",
    browser_status: false,
    sandbox_status: false
  });

  // Poll for agent status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getAgentStatus();
        setAgentStatus(status);
      } catch (error) {
        console.error("Failed to check agent status:", error);
      }
    };
    
    // Initial check
    checkStatus();
    
    // Set up polling
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize sandbox on page load
  useEffect(() => {
    const initializeSandbox = async () => {
      try {
        // Execute a simple command to initialize the sandbox
        await executeSandboxCommand("echo 'Initializing sandbox environment'");
        toast({
          title: "Sandbox Initialized",
          description: "The sandbox environment is now ready to use"
        });
      } catch (error) {
        console.error("Failed to initialize sandbox:", error);
        toast({
          title: "Sandbox Initialization Failed",
          description: "Could not start the sandbox environment",
          variant: "destructive"
        });
      }
    };

    initializeSandbox();
  }, []);
  
  const handleRunAgent = async (task: string, additionalInfo?: string) => {
    try {
      toast({
        title: "Agent Starting",
        description: "Running task: " + task
      });
      
      const result = await runAgent(task, additionalInfo);
      
      if (result.success) {
        toast({
          title: "Task Completed",
          description: result.output || "Task executed successfully"
        });
        return result;
      } else {
        toast({
          title: "Task Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to run agent",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleStopAgent = async () => {
    try {
      await stopAgent();
      toast({
        title: "Agent Stopped",
        description: "Agent execution has been stopped"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop agent",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div id="dashboard" className="grid grid-cols-1 gap-6">
          <WelcomeWidget />
          <RunAgent 
            onRunAgent={handleRunAgent} 
            onStopAgent={handleStopAgent}
            agentStatus={agentStatus}
          />
        </div>
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
};

export default Index;
