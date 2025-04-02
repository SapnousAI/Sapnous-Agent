
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Settings, 
  LayoutDashboard, 
  Bot, 
  Globe, 
  Search, 
  Video, 
  FileJson, 
  ChevronLeft, 
  ChevronRight,
  Github
} from 'lucide-react';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "#dashboard",
      isActive: true,
    },
    {
      icon: <Bot size={20} />,
      label: "Chat",
      href: "#chat",
    },
    {
      icon: <Github size={20} />,
      label: "Models",
      href: "http://huggingface.co/collections/Sapnous-AI",
    }
  ];
  
  const setActiveItem = (index: number) => {
    return () => {
      const newNavItems = [...navItems];
      newNavItems.forEach((item, i) => {
        item.isActive = i === index;
      });
    };
  };

  return (
    <aside 
      className={cn(
        "h-screen flex flex-col border-r border-sidebar-border bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="https://i.ibb.co/61fFGZb/FUSION-zip-2.png" alt="Sapnous-AI" className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Sapnous-AI</h1>
          </div>
        )}
        {collapsed && <img src="https://i.ibb.co/61fFGZb/FUSION-zip-2.png" alt="Sapnous-AI" className="mx-auto h-6 w-6" />}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  item.isActive
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-secondary/50 hover:text-primary"
                )}
                onClick={setActiveItem(index)}
                target={item.href.startsWith("http") ? "_blank" : undefined}
              >
                <span className="mr-3 text-foreground">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </a>
            ))}
          </nav>
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="text-xs text-sidebar-foreground/70">
              Sapnous-AI Agent
            </div>
          )}
          <a
            href="https://huggingface.co/Sapnous-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
          >
            <Github size={collapsed ? 20 : 16} className={cn(collapsed && "mx-auto")} />
          </a>
        </div>
      </div>
    </aside>
  );
}
