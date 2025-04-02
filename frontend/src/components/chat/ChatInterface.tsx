
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Play, 
  Square, 
  Monitor,
  Terminal,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Blocks
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { runAgent, stopAgent, getAgentStatus, executeSandboxCommand } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

interface AgentAction {
  action: string;
  params: any;
  timestamp?: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your autonomous AI agent. I can help with browsing, creating documents, writing code, executing commands and much more. What would you like me to do?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showBrowser, setShowBrowser] = useState(true);
  const [showSandbox, setShowSandbox] = useState(true);
  const [fullscreenBrowser, setFullscreenBrowser] = useState(false);
  const [fullscreenSandbox, setFullscreenSandbox] = useState(false);
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('browser');
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [agentThoughts, setAgentThoughts] = useState<string[]>([]);
  const [commandOutput, setCommandOutput] = useState<string>('');
  const [sandboxCommand, setSandboxCommand] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      // Set running state
      setIsRunning(true);

      // Add system message to show we're processing
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: 'Processing your request...',
          timestamp: new Date()
        }
      ]);

      // Call the API
      const result = await runAgent(input);

      // Remove the system "processing" message
      setMessages(prev => prev.filter(msg => 
        !(msg.role === 'system' && msg.content === 'Processing your request...')
      ));

      // Handle browser automation response
      if (result.type === 'browser_automation') {
        const actions = result.actions || [];
        const actionMessages = actions.map((action: any) => ({
          role: 'system' as const,
          content: `Browser Action: ${action.action} - ${action.success ? 'Success' : `Failed: ${action.error}`}`,
          timestamp: new Date()
        }));

        setMessages(prev => [...prev, ...actionMessages]);

        // Switch to browser tab if automation is happening
        if (actions.length > 0) {
          setActiveTab('browser');
          if (!showBrowser) setShowBrowser(true);
        }
      }

      // Add assistant response
      const assistantResponse: Message = { 
        role: 'assistant', 
        content: result.output || result.result || "I've completed the task.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantResponse]);
      
      // If sandbox command was executed, show the output
      if (result.type === 'sandbox') {
        setCommandOutput(result.output || '');
        if (activeTab !== 'sandbox') {
          setActiveTab('sandbox');
        }
      }
      
      // Update actions and thoughts if available
      if (result.actions) {
        const formattedActions = Array.isArray(result.actions) 
          ? result.actions.map((action: any) => ({
              action: action.action || action.name || "Unknown action",
              params: action.params || action,
              timestamp: new Date()
            }))
          : [];
        setAgentActions(formattedActions);
      }
      
      if (result.thoughts) {
        setAgentThoughts(Array.isArray(result.thoughts) ? result.thoughts : [result.thoughts]);
      }
      
      // Handle errors
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
        
        setMessages(prev => [
          ...prev,
          {
            role: 'system',
            content: `Error: ${result.error}`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error("Error running agent:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to run the agent",
        variant: "destructive"
      });

      // Add error message
      setMessages(prev => [
        ...prev.filter(msg => 
          !(msg.role === 'system' && msg.content === 'Processing your request...')
        ), 
        { 
          role: 'system', 
          content: `Error: ${error instanceof Error ? error.message : "Failed to run the agent"}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = async () => {
    try {
      await stopAgent();
      setIsRunning(false);
      toast({
        title: "Agent stopped",
        description: "The agent has been stopped",
      });
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: 'Agent has been stopped.',
          timestamp: new Date() 
        }
      ]);
    } catch (error) {
      console.error("Error stopping agent:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to stop the agent",
        variant: "destructive"
      });
    }
  };

  const handleExecuteCommand = async () => {
    if (!sandboxCommand.trim()) return;

    try {
      setCommandOutput('Executing command...');
      const result = await executeSandboxCommand(sandboxCommand);
      
      if (result.success) {
        setCommandOutput(`${result.stdout}\n${result.stderr || ''}`);
      } else {
        setCommandOutput(`Error (exit code ${result.exit_code}):\n${result.stderr || ''}`);
      }
      
      // Add to messages
      setMessages(prev => [
        ...prev, 
        { 
          role: 'user', 
          content: `Command: ${sandboxCommand}`,
          timestamp: new Date()
        },
        {
          role: 'system',
          content: result.success 
            ? `Command executed successfully:\n${result.stdout}` 
            : `Command failed (exit code ${result.exit_code}):\n${result.stderr}`,
          timestamp: new Date()
        }
      ]);

      // Clear the command input
      setSandboxCommand('');
    } catch (error) {
      console.error("Error executing command:", error);
      setCommandOutput(`Failed to execute command: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute command",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-[calc(100vh-220px)] flex overflow-hidden">
      <div className={`chat-container ${expandedSidebar ? 'w-2/3' : 'w-full'}`}>
        <div className="chat-messages p-4 h-[calc(100%-80px)] overflow-y-auto">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-12' 
                  : message.role === 'system'
                    ? 'bg-muted text-muted-foreground border border-border'
                    : 'bg-secondary text-secondary-foreground mr-12'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-xs">
                  {message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'AI Assistant'}
                </span>
                {message.timestamp && (
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input border-t p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like me to help you with today?"
              className="flex-1"
              disabled={isRunning}
            />
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={handleStop}
                >
                  <Square className="h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  variant="default" 
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              )}
            </div>
          </form>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="live-browser" 
                  checked={showBrowser}
                  onCheckedChange={setShowBrowser}
                />
                <Label htmlFor="live-browser" className="flex items-center text-sm">
                  <Monitor size={16} className="mr-1" />
                  Browser
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="live-sandbox" 
                  checked={showSandbox}
                  onCheckedChange={setShowSandbox}
                />
                <Label htmlFor="live-sandbox" className="flex items-center text-sm">
                  <Terminal size={16} className="mr-1" />
                  Sandbox
                </Label>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedSidebar(!expandedSidebar)}
                className="ml-2 h-7 px-2"
              >
                {expandedSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {isRunning ? 'Agent is running...' : 'Agent ready'}
            </div>
          </div>
        </div>
      </div>
      
      {(showBrowser || showSandbox) && (
        <div className="side-panel border-l border-border flex flex-col transition-all duration-300" 
            style={{ width: expandedSidebar ? '40%' : '0%', overflow: 'hidden' }}>
          <div className="flex-1 h-0 relative">
            <div className="absolute inset-0 p-4">
              <Card className="h-full border bg-card/50">
                <div className="flex items-center justify-between p-2 border-b border-border">
                  <div className="flex space-x-1">
                    <Button 
                      variant={activeTab === 'browser' ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => setActiveTab('browser')}
                      className="h-7 px-2"
                      disabled={!showBrowser}
                    >
                      <Monitor size={14} className="mr-1" /> Browser
                    </Button>
                    <Button 
                      variant={activeTab === 'sandbox' ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => setActiveTab('sandbox')}
                      className="h-7 px-2"
                      disabled={!showSandbox}
                    >
                      <Terminal size={14} className="mr-1" /> Sandbox
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => activeTab === 'browser' ? setFullscreenBrowser(true) : setFullscreenSandbox(true)}
                      className="h-7 px-2"
                    >
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>

                {activeTab === 'browser' && showBrowser && (
                  <div className="aspect-video bg-black/5 flex items-center justify-center p-4">
                    <iframe 
                      src={isRunning ? "http://localhost:6080" : "about:blank"} 
                      title="Browser View" 
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                )}

                {activeTab === 'sandbox' && showSandbox && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 bg-black text-green-400 font-mono p-4 overflow-y-auto">
                      <pre>{commandOutput || "Sandbox terminal ready. Enter a command below."}</pre>
                    </div>
                    <div className="p-2 border-t border-border bg-card/50">
                      <div className="flex gap-2">
                        <Input
                          value={sandboxCommand}
                          onChange={(e) => setSandboxCommand(e.target.value)}
                          placeholder="Enter command..."
                          className="flex-1 font-mono text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand()}
                        />
                        <Button 
                          onClick={handleExecuteCommand} 
                          size="sm"
                        >
                          Run
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="thoughts">Thoughts</TabsTrigger>
              </TabsList>
              <TabsContent value="results" className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                {messages.filter(m => m.role === 'assistant' && !m.content.includes("Hello! I am your")).map((msg, i) => (
                  <div key={i} className="mb-2 p-2 border border-border rounded-md">
                    <div className="text-xs opacity-70 mb-1">
                      {msg.timestamp?.toLocaleString()}
                    </div>
                    {msg.content}
                  </div>
                ))}
                {messages.filter(m => m.role === 'assistant' && !m.content.includes("Hello! I am your")).length === 0 && (
                  "Results will appear here..."
                )}
              </TabsContent>
              <TabsContent value="actions" className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                {agentActions.length > 0 ? (
                  agentActions.map((action, i) => (
                    <div key={i} className="mb-2 p-2 border border-border rounded-md">
                      <div className="font-medium">{action.action}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {JSON.stringify(action.params)}
                      </div>
                      {action.timestamp && (
                        <div className="text-xs opacity-70 mt-1">
                          {action.timestamp.toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  "Agent actions will appear here..."
                )}
              </TabsContent>
              <TabsContent value="thoughts" className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                {agentThoughts.length > 0 ? (
                  agentThoughts.map((thought, i) => (
                    <div key={i} className="mb-2 p-2 border border-border rounded-md">
                      {thought}
                    </div>
                  ))
                ) : (
                  "Agent thoughts will appear here..."
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
      
      {/* Fullscreen Browser Dialog */}
      <Dialog open={fullscreenBrowser} onOpenChange={setFullscreenBrowser}>
        <DialogContent className="max-w-5xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Live Browser View</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black/10 w-full">
            <iframe 
              src={isRunning ? "http://localhost:6080" : "about:blank"} 
              title="Browser View Fullscreen" 
              className="w-full h-[70vh]"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Fullscreen Sandbox Dialog */}
      <Dialog open={fullscreenSandbox} onOpenChange={setFullscreenSandbox}>
        <DialogContent className="max-w-5xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Sandbox Terminal</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[70vh]">
            <div className="flex-1 bg-black text-green-400 font-mono p-4 overflow-y-auto">
              <pre>{commandOutput || "Sandbox terminal ready. Enter a command below."}</pre>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={sandboxCommand}
                  onChange={(e) => setSandboxCommand(e.target.value)}
                  placeholder="Enter command..."
                  className="flex-1 font-mono text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand()}
                />
                <Button onClick={handleExecuteCommand}>
                  Run
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
