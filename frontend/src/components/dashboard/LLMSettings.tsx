
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function LLMSettings() {
  const [provider, setProvider] = useState("openai");
  const [ollamaVisible, setOllamaVisible] = useState(false);

  const handleProviderChange = (value: string) => {
    setProvider(value);
    setOllamaVisible(value === "ollama");
  };

  return (
    <Card id="llm-settings" className="animated-panel">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="dashboard-subtitle">🤖 LLM Configuration</h2>
          <Button variant="outline" size="sm">Save Settings</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="llm-provider">Provider</Label>
              <Select 
                defaultValue={provider} 
                onValueChange={handleProviderChange}
              >
                <SelectTrigger id="llm-provider" className="w-full">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="ollama">Ollama</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                  <SelectItem value="azure">Azure OpenAI</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="llm-model">Model</Label>
              <Select defaultValue="gpt-4o">
                <SelectTrigger id="llm-model" className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {ollamaVisible && (
              <div>
                <Label htmlFor="ollama-ctx">Context Length</Label>
                <Input id="ollama-ctx" type="number" defaultValue="4096" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="temperature">
                Temperature: <span className="text-primary">0.6</span>
              </Label>
              <Slider 
                id="temperature"
                defaultValue={[0.6]} 
                max={2.0} 
                step={0.1} 
                className="py-4"
              />
              <p className="text-xs text-muted-foreground mt-1">Controls randomness in model outputs</p>
            </div>

            <div>
              <Label htmlFor="llm-base-url">Base URL</Label>
              <Input id="llm-base-url" placeholder="API endpoint URL (if required)" />
            </div>
            
            <div>
              <Label htmlFor="llm-api-key">API Key</Label>
              <Input id="llm-api-key" type="password" placeholder="Your API key (leave blank to use .env)" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
