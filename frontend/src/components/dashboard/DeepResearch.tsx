
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Square, Download } from "lucide-react";

export default function DeepResearch() {
  const [isResearching, setIsResearching] = useState(false);

  const handleResearch = () => {
    setIsResearching(true);
    // Mock research functionality
    setTimeout(() => {
      setIsResearching(false);
    }, 5000);
  };

  return (
    <Card id="deep-research" className="animated-panel">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="dashboard-subtitle">🧐 Deep Research</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="research-task">Research Task</Label>
            <Textarea 
              id="research-task" 
              placeholder="Describe your research task..." 
              defaultValue="Compose a report on the use of Reinforcement Learning for training Large Language Models, encompassing its origins, current advancements, and future prospects, substantiated with examples of relevant models and techniques. The report should reflect original insights and analysis, moving beyond mere summarization of existing literature."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Detailed research objective for the agent</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-search-iter">Max Search Iteration</Label>
              <Input id="max-search-iter" type="number" defaultValue="3" />
            </div>
            <div>
              <Label htmlFor="max-query-iter">Max Query per Iteration</Label>
              <Input id="max-query-iter" type="number" defaultValue="1" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleResearch}
              disabled={isResearching}
              className="flex-1"
            >
              <Play size={16} className="mr-2" />
              Run Deep Research
            </Button>
            <Button 
              variant="outline" 
              disabled={!isResearching}
              onClick={() => setIsResearching(false)}
            >
              <Square size={16} className="mr-2" />
              Stop
            </Button>
          </div>

          <Card className="border mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">Research Report</Label>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-2" />
                  Download Report
                </Button>
              </div>
              <div className="bg-secondary/30 rounded-md p-4 h-64 overflow-y-auto">
                <p className="text-muted-foreground text-sm">Research results will appear here...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
