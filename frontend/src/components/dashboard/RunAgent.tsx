
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Square, Monitor, Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { executeSandboxCommand } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

interface RunAgentProps {
  onRunAgent: (task: string, additionalInfo?: string) => Promise<any>;
  onStopAgent: () => Promise<void>;
  agentStatus: {
    status: string;
    agent_status: string;
    browser_status: boolean;
    sandbox_status: boolean;
  };
}

export default function RunAgent({ onRunAgent, onStopAgent, agentStatus }: RunAgentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [showLiveBrowser, setShowLiveBrowser] = useState(true);
  const [showSandbox, setShowSandbox] = useState(true);
  const [fullscreenBrowser, setFullscreenBrowser] = useState(false);
  const [fullscreenSandbox, setFullscreenSandbox] = useState(false);
  const [task, setTask] = useState("go to google.com and type 'OpenAI' click search and give me the first url");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [results, setResults] = useState("");
  const [errors, setErrors] = useState("");
  const [actions, setActions] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [sandboxCommand, setSandboxCommand] = useState("echo Hello from the sandbox");
  const [sandboxOutput, setSandboxOutput] = useState("");

  // Update running state based on agent status
  useEffect(() => {
    setIsRunning(agentStatus.status === "running");
  }, [agentStatus]);

  const handleRun = async () => {
    setIsRunning(true);
    setResults("");
    setErrors("");
    setActions("");
    setThoughts("");
    
    try {
      const result = await onRunAgent(task, additionalInfo);
      if (result) {
        setResults(result.result || "Task completed with no specific results");
        setErrors(result.errors || "");
        setActions(JSON.stringify(result.actions || [], null, 2));
        setThoughts(JSON.stringify(result.thoughts || [], null, 2));
      }
    } catch (error) {
      setErrors(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = async () => {
    await onStopAgent();
    setIsRunning(false);
  };

  const handleSandboxCommand = async () => {
    try {
      const result = await executeSandboxCommand(sandboxCommand);
      if (result) {
        setSandboxOutput(result.stdout || result.output || "Command executed with no output");
        if (result.stderr && result.stderr.trim() !== "") {
          setSandboxOutput(prev => prev + "\nERROR: " + result.stderr);
        }
      }
    } catch (error) {
      setSandboxOutput("Error executing command: " + (error instanceof Error ? error.message : String(error)));
      toast({
        title: "Sandbox Error",
        description: "Failed to execute command",
        variant: "destructive"
      });
    }
  };

  return (
    <Card id="run-agent" className="animated-panel">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="dashboard-subtitle">🤖 AI Agent</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="live-browser" 
                checked={showLiveBrowser}
                onCheckedChange={setShowLiveBrowser}
              />
              <Label htmlFor="live-browser" className="flex items-center text-sm">
                <Monitor size={16} className="mr-1" />
                Browser
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="sandbox" 
                checked={showSandbox}
                onCheckedChange={setShowSandbox}
              />
              <Label htmlFor="sandbox" className="flex items-center text-sm">
                <Terminal size={16} className="mr-1" />
                Sandbox
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="task">Task Description</Label>
              <Textarea 
                id="task" 
                placeholder="Enter your task here..." 
                value={task}
                onChange={(e) => setTask(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">Describe what you want the agent to do</p>
            </div>

            <div>
              <Label htmlFor="additional-info">Additional Information</Label>
              <Textarea 
                id="additional-info" 
                placeholder="Add any helpful context or instructions..." 
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional hints to help the LLM complete the task</p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleRun} 
                disabled={isRunning}
                className="flex-1"
              >
                <Play size={16} className="mr-2" />
                Run Agent
              </Button>
              <Button 
                variant="outline" 
                disabled={!isRunning}
                onClick={handleStop}
              >
                <Square size={16} className="mr-2" />
                Stop
              </Button>
            </div>
            
            {showSandbox && (
              <div className="space-y-2 mt-4 border-t pt-4">
                <Label htmlFor="sandbox-command">Sandbox Command</Label>
                <div className="flex gap-2">
                  <Input
                    id="sandbox-command"
                    value={sandboxCommand}
                    onChange={(e) => setSandboxCommand(e.target.value)}
                    placeholder="Enter shell command..."
                    onKeyDown={(e) => e.key === "Enter" && handleSandboxCommand()}
                  />
                  <Button onClick={handleSandboxCommand}>Run</Button>
                </div>
                <Textarea
                  value={sandboxOutput}
                  readOnly
                  placeholder="Command output will appear here..."
                  className="h-24 font-mono text-xs"
                />
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFullscreenSandbox(true)}
                    className="text-xs"
                  >
                    <Terminal size={14} className="mr-1" /> Expand
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {showLiveBrowser ? (
              <div className="relative">
                <Card className="border border-border bg-card/50">
                  <div className="flex items-center justify-between p-2 border-b border-border">
                    <span className="text-xs font-medium">Live Browser Session</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFullscreenBrowser(true)}
                      className="h-6 px-2"
                    >
                      <Monitor size={14} className="mr-1" /> Expand
                    </Button>
                  </div>
                  <div className="aspect-video bg-black/10 flex items-center justify-center p-4">
                    {isRunning && agentStatus.browser_status ? (
                      <iframe 
                        src="about:blank" 
                        title="Browser View" 
                        className="w-full h-full border-0"
                        sandbox="allow-same-origin allow-scripts"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">Start the agent to see live browser session</p>
                        <p className="text-xs text-muted-foreground mt-2">The browser will appear here when running</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ) : null}

            <Tabs defaultValue="results">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="thoughts">Thoughts</TabsTrigger>
              </TabsList>
              <TabsContent value="results">
                <Card className="border">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="final-result" className="text-xs">Final Result</Label>
                      <Textarea 
                        id="final-result" 
                        value={results}
                        placeholder="Results will appear here..."
                        className="h-24 bg-secondary/30 resize-none"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="errors" className="text-xs">Errors</Label>
                      <Textarea 
                        id="errors" 
                        value={errors}
                        placeholder="Errors will appear here..."
                        className="h-16 bg-secondary/30 resize-none"
                        readOnly
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="actions">
                <Card className="border">
                  <CardContent className="p-4">
                    <Label htmlFor="model-actions" className="text-xs">Model Actions</Label>
                    <Textarea 
                      id="model-actions" 
                      value={actions}
                      placeholder="Actions will appear here..."
                      className="h-[168px] bg-secondary/30 resize-none"
                      readOnly
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="thoughts">
                <Card className="border">
                  <CardContent className="p-4">
                    <Label htmlFor="model-thoughts" className="text-xs">Model Thoughts</Label>
                    <Textarea 
                      id="model-thoughts" 
                      value={thoughts}
                      placeholder="Thoughts will appear here..."
                      className="h-[168px] bg-secondary/30 resize-none"
                      readOnly
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Fullscreen Browser Dialog */}
        <Dialog open={fullscreenBrowser} onOpenChange={setFullscreenBrowser}>
          <DialogContent className="max-w-4xl w-[90vw]">
            <DialogHeader>
              <DialogTitle>Live Browser View</DialogTitle>
            </DialogHeader>
            <div className="aspect-video bg-black/10 w-full">
              {isRunning && agentStatus.browser_status ? (
                <iframe 
                  src="about:blank" 
                  title="Browser View Fullscreen" 
                  className="w-full h-[60vh]"
                  sandbox="allow-same-origin allow-scripts"
                />
              ) : (
                <div className="flex items-center justify-center h-[60vh]">
                  <p className="text-muted-foreground">Start the agent to see live browser session</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Fullscreen Sandbox Dialog */}
        <Dialog open={fullscreenSandbox} onOpenChange={setFullscreenSandbox}>
          <DialogContent className="max-w-4xl w-[90vw]">
            <DialogHeader>
              <DialogTitle>Sandbox Terminal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={sandboxCommand} 
                  onChange={(e) => setSandboxCommand(e.target.value)}
                  placeholder="Enter shell command..."
                  onKeyDown={(e) => e.key === "Enter" && handleSandboxCommand()}
                />
                <Button onClick={handleSandboxCommand}>Run</Button>
              </div>
              <Textarea
                value={sandboxOutput}
                readOnly
                placeholder="Command output will appear here..."
                className="h-[50vh] font-mono text-xs bg-black text-green-500 p-4"
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
