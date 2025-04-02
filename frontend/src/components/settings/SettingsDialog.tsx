
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import LLMSettings from '@/components/dashboard/LLMSettings';
import BrowserSettings from '@/components/dashboard/BrowserSettings';
import DeepResearch from '@/components/dashboard/DeepResearch';
import RecordingsGallery from '@/components/dashboard/RecordingsGallery';
import UIConfiguration from '@/components/dashboard/UIConfiguration';
import SandboxSettings from '@/components/dashboard/SandboxSettings';

interface SettingsDialogProps {
  activeTab: string | null;
  onClose: () => void;
}

export default function SettingsDialog({ activeTab, onClose }: SettingsDialogProps) {
  const tabs = {
    llm: "LLM Settings",
    browser: "Browser Settings",
    sandbox: "Sandbox Settings",
    deepResearch: "Deep Research",
    recordings: "Recordings",
    uiConfig: "UI Configuration",
  };

  return (
    <Dialog open={!!activeTab} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={activeTab || "llm"} className="w-full">
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="llm">LLM</TabsTrigger>
            <TabsTrigger value="browser">Browser</TabsTrigger>
            <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
            <TabsTrigger value="deepResearch">Research</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
            <TabsTrigger value="uiConfig">UI Config</TabsTrigger>
          </TabsList>
          <TabsContent value="llm" className="max-h-[70vh] overflow-y-auto">
            <LLMSettings />
          </TabsContent>
          <TabsContent value="browser" className="max-h-[70vh] overflow-y-auto">
            <BrowserSettings />
          </TabsContent>
          <TabsContent value="sandbox" className="max-h-[70vh] overflow-y-auto">
            <SandboxSettings />
          </TabsContent>
          <TabsContent value="deepResearch" className="max-h-[70vh] overflow-y-auto">
            <DeepResearch />
          </TabsContent>
          <TabsContent value="recordings" className="max-h-[70vh] overflow-y-auto">
            <RecordingsGallery />
          </TabsContent>
          <TabsContent value="uiConfig" className="max-h-[70vh] overflow-y-auto">
            <UIConfiguration />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
