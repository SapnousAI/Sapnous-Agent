
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";

export default function UIConfiguration() {
  return (
    <Card id="ui-config" className="animated-panel">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="dashboard-subtitle">📁 UI Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="config-file" className="mb-2 block">Load UI Settings from Config File</Label>
            <div className="border-2 border-dashed rounded-md border-muted p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-xs mt-2 text-muted-foreground">
                Drag and drop or click to select a config file
              </p>
              <Input id="config-file" type="file" className="hidden" />
            </div>
            <Button className="mt-4 w-full">
              <Upload size={16} className="mr-2" />
              Load Config
            </Button>
          </div>

          <div>
            <Label className="mb-2 block">Save Current UI Settings</Label>
            <Card className="border h-[118px] flex flex-col items-center justify-center">
              <p className="text-sm mb-4">Save the current UI configuration as a JSON file</p>
              <Button>
                <Download size={16} className="mr-2" />
                Save UI Settings
              </Button>
            </Card>
            <div className="mt-4">
              <Label htmlFor="config-status">Status</Label>
              <Input 
                id="config-status" 
                readOnly
                className="bg-secondary/30"
                value="Ready to save or load configuration"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
