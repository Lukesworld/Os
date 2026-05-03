import React from 'react';
import { useOS } from '../context/OSContext';
import { VProcess } from '../types';

export const ProcessMonitor: React.FC = () => {
  const { state, killProcess } = useOS();
  const procs = Object.values(state.processes) as VProcess[];

  return (
    <div className="flex flex-col h-full">
      <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Active Processes</div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 border-b border-[var(--border)] pb-4 transition-colors duration-500">
        {procs.map(p => (
           <div key={p.pid} className="group bg-[var(--process-card)] border border-[var(--border)] rounded-xl p-4 shadow-sm transition-all hover:border-[var(--accent)] relative duration-500">
              <div className="flex justify-between items-start mb-1">
                 <div className="font-semibold text-sm text-[var(--text-primary)] truncate max-w-[80%] transition-colors duration-500">{p.name}</div>
                 <button onClick={() => killProcess(p.pid)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity absolute top-4 right-4">
                   ✕
                 </button>
              </div>
              <div className="flex items-center text-[11px] text-[var(--text-secondary)] transition-colors duration-500">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
                 {p.cpu.toFixed(1)}% CPU <span className="mx-2">•</span> {p.memory.toFixed(1)} MB
              </div>
           </div>
        ))}
        {procs.length === 0 && (
           <div className="text-[13px] text-[var(--text-secondary)] italic">System idle.</div>
        )}
      </div>
    </div>
  );
};
