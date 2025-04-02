
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function BrowserSettings() {
  return (
    <Card id="browser-settings" className="animated-panel">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="dashboard-subtitle">🌐 Browser Settings</h2>
          <Button variant="outline" size="sm">Save Settings</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="own-browser">Use Own Browser</Label>
                <p className="text-xs text-muted-foreground">Use your existing browser instance</p>
              </div>
              <Switch id="own-browser" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="keep-browser">Keep Browser Open</Label>
                <p className="text-xs text-muted-foreground">Keep Browser Open between Tasks</p>
              </div>
              <Switch id="keep-browser" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="headless">Headless Mode</Label>
                <p className="text-xs text-muted-foreground">Run browser without GUI</p>
              </div>
              <Switch id="headless" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="disable-security">Disable Security</Label>
                <p className="text-xs text-muted-foreground">Disable browser security features</p>
              </div>
              <Switch id="disable-security" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-recording">Enable Recording</Label>
                <p className="text-xs text-muted-foreground">Enable saving browser recordings</p>
              </div>
              <Switch id="enable-recording" defaultChecked />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="window-width">Window Width</Label>
                <Input id="window-width" type="number" defaultValue="1280" />
              </div>
              <div>
                <Label htmlFor="window-height">Window Height</Label>
                <Input id="window-height" type="number" defaultValue="1100" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="chrome-cdp">CDP URL</Label>
              <Input id="chrome-cdp" placeholder="http://localhost:9222" />
              <p className="text-xs text-muted-foreground mt-1">CDP for google remote debugging</p>
            </div>
            
            <div>
              <Label htmlFor="recording-path">Recording Path</Label>
              <Input id="recording-path" defaultValue="./tmp/record_videos" />
              <p className="text-xs text-muted-foreground mt-1">Path to save browser recordings</p>
            </div>
            
            <div>
              <Label htmlFor="trace-path">Trace Path</Label>
              <Input id="trace-path" defaultValue="./tmp/traces" />
              <p className="text-xs text-muted-foreground mt-1">Path to save Agent traces</p>
            </div>
            
            <div>
              <Label htmlFor="agent-history-path">Agent History Save Path</Label>
              <Input id="agent-history-path" defaultValue="./tmp/agent_history" />
              <p className="text-xs text-muted-foreground mt-1">Specify the directory where agent history should be saved</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
