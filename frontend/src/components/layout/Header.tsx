import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  Settings,
  User,
  LogIn
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface HeaderProps {
  className?: string;
  onSettingsClick: (settingType: string) => void;
}

export default function Header({ className, onSettingsClick }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <header className={cn("h-14 border-b px-6 flex items-center justify-between bg-white", className)}>
      <div className="flex items-center gap-2">
        <img 
          src="https://i.ibb.co/61fFGZb/FUSION-zip-2.png" 
          alt="Sapnous-AI Logo" 
          className="h-8 w-8"
        />
        <h1 className="text-lg font-medium">Sapnous-AI</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>
        <DropdownMenu open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => onSettingsClick("llm")}>
                LLM Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onSettingsClick("browser")}>
                Browser Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onSettingsClick("deepResearch")}>
                Deep Research
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onSettingsClick("recordings")}>
                Recordings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onSettingsClick("uiConfig")}>
                UI Configuration
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="http://huggingface.co/collections/Sapnous-AI" target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                Model Repository
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="rounded-full h-8 w-8" />
                ) : (
                  <User size={18} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled>{user?.name}</DropdownMenuItem>
              <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={() => loginWithRedirect()} className="flex items-center gap-2">
            <LogIn size={16} />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
