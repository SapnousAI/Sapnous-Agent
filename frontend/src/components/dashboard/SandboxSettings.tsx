
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getSandboxSettings, updateSandboxSettings, executeSandboxCommand } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Terminal } from "lucide-react";

export default function SandboxSettings() {
  const [settings, setSettings] = useState({
    enabled: false,
    user: "sandbox",
    timeout: 300
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testCommand, setTestCommand] = useState("echo 'Hello from sandbox'");
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSandboxSettings();
        if (response.settings) {
          setSettings(response.settings);
        }
      } catch (error) {
        console.error("Failed to load sandbox settings:", error);
        toast({
          title: "Error",
          description: "Failed to load sandbox settings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSandboxSettings(settings);
      toast({
        title: "Success",
        description: "Sandbox settings updated successfully",
      });
    } catch (error) {
      console.error("Failed to save sandbox settings:", error);
      toast({
        title: "Error",
        description: "Failed to update sandbox settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestSandbox = async () => {
    setTesting(true);
    setTestOutput(null);
    try {
      const result = await executeSandboxCommand(testCommand);
      setTestOutput(
        `Exit code: ${result.exit_code}\n\nStdout:\n${result.stdout || "N/A"}\n\nStderr:\n${result.stderr || "N/A"}`
      );
    } catch (error) {
      console.error("Failed to test sandbox:", error);
      setTestOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sandbox Environment Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-sandbox" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" /> Enable Sandbox
            </Label>
            <Switch
              id="enable-sandbox"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sandbox-user">Sandbox User</Label>
                <Input
                  id="sandbox-user"
                  value={settings.user}
                  onChange={(e) => setSettings({ ...settings, user: e.target.value })}
                  placeholder="sandbox"
                />
              </div>
              <div>
                <Label htmlFor="sandbox-timeout">Command Timeout (seconds)</Label>
                <Input
                  id="sandbox-timeout"
                  type="number"
                  value={settings.timeout}
                  onChange={(e) => setSettings({ ...settings, timeout: parseInt(e.target.value) })}
                  min={1}
                  max={3600}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Settings
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Test Sandbox</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-command">Test Command</Label>
              <Input
                id="test-command"
                value={testCommand}
                onChange={(e) => setTestCommand(e.target.value)}
                placeholder="echo 'Hello from sandbox'"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter a shell command to test the sandbox environment
              </p>
            </div>
            
            <Button onClick={handleTestSandbox} disabled={testing || !settings.enabled}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Run Test Command
            </Button>
            
            {testOutput !== null && (
              <div className="mt-4">
                <Label>Command Output</Label>
                <pre className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
                  {testOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
