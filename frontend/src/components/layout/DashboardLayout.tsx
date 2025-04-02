
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SettingsDialog from '../settings/SettingsDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>(null);

  const handleSettingsClick = (settingType: string) => {
    setActiveSettingsTab(settingType);
  };

  const handleCloseSettings = () => {
    setActiveSettingsTab(null);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSettingsClick={handleSettingsClick} />
        <main className="flex-1 overflow-auto p-6 gradient-bg">
          {children}
        </main>
      </div>
      
      <SettingsDialog 
        activeTab={activeSettingsTab} 
        onClose={handleCloseSettings} 
      />
    </div>
  );
}
