import React from 'react';
import { FileExplorer } from './FileExplorer';
import { ProcessMonitor } from './ProcessMonitor';
import { ChatBox } from './ChatBox';
import { TerminalLog } from './TerminalLog';
import { useOS } from '../context/OSContext';

export const Desktop: React.FC = () => {
  const { state } = useOS();
  return (
    <div 
      className="w-full h-screen flex flex-col font-sans overflow-hidden transition-colors duration-500" 
      style={{ ...state.theme, backgroundColor: 'var(--bg)', color: 'var(--text-primary)' } as any}
    >
      {/* Top Header */}
      <header className="h-14 border-b border-[var(--border)] bg-[rgba(255,255,255,0.5)] backdrop-blur-md flex items-center px-8 justify-between shrink-0 z-10 transition-colors duration-500">
        <div className="font-bold text-sm tracking-tight text-[var(--accent)]">
          Aether OS // AI Core
        </div>
        <div className="text-xs text-[var(--text-secondary)] flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE
          </span>
          <span>UPTIME: {Math.floor(Date.now() / 60000 % 60)}M</span>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 border-r border-[var(--border)] bg-[var(--sidebar-bg)] flex flex-col shrink-0 transition-colors duration-500">
          <FileExplorer />
        </aside>

        {/* Center Main panel */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg)] relative transition-colors duration-500">
          <ChatBox />
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-72 border-l border-[var(--border)] bg-[var(--sidebar-bg)] flex flex-col shrink-0 p-6 overflow-hidden gap-6 transition-colors duration-500">
           <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <ProcessMonitor />
           </div>
           <div className="h-48 shrink-0 flex flex-col">
              <TerminalLog />
           </div>
        </aside>
      </div>
    </div>
  );
};
