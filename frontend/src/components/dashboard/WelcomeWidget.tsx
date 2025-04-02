
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WelcomeWidget() {
  return (
    <Card className="w-full border animated-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Welcome to Modern Agent Navigator</CardTitle>
          <Badge variant="outline" className="text-primary border-primary/30">v1.0.0</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          A powerful AI agent dashboard to control and monitor browser-based automation.
          Configure your LLM settings, manage browser sessions, and run complex tasks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="border border-primary/20 bg-card/50 clickable-card">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
              </div>
              <h3 className="font-medium mb-1">Run Browser Agent</h3>
              <p className="text-xs text-muted-foreground">Execute agent tasks in controlled browser sessions</p>
            </CardContent>
          </Card>
          <Card className="border border-primary/20 bg-card/50 clickable-card">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 21h4"></path><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path><path d="M17 21V7H7v14"></path></svg>
              </div>
              <h3 className="font-medium mb-1">Deep Research</h3>
              <p className="text-xs text-muted-foreground">Conduct comprehensive AI-powered research tasks</p>
            </CardContent>
          </Card>
          <Card className="border border-primary/20 bg-card/50 clickable-card">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 4 9.5c0-.617.236-1.234.706-1.704L6.317 6.19a.979.979 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707 2.402 2.402 0 0 1 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"></path></svg>
              </div>
              <h3 className="font-medium mb-1">Configure Settings</h3>
              <p className="text-xs text-muted-foreground">Customize LLM and browser settings for optimal performance</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
