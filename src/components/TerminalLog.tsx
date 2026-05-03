import React from 'react';
import { useOS } from '../context/OSContext';

export const TerminalLog: React.FC = () => {
    const { state } = useOS();
    const logs = state.logs;

    return (
        <div className="flex flex-col h-full pt-4">
            <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Kernel Event Log</div>
            <div className="flex-1 overflow-y-auto space-y-2 flex flex-col-reverse font-mono text-[10px]">
                <div className="flex flex-col justify-end min-h-full">
                    {logs.map(log => {
                        const date = new Date(log.timestamp).toISOString().split('T')[1].slice(0,-1);
                        let colorClass = 'text-[var(--text-secondary)]';
                        if (log.level === 'warn') colorClass = 'text-amber-500';
                        if (log.level === 'error') colorClass = 'text-red-500';
                        if (log.level === 'system') colorClass = 'text-[var(--accent)] font-medium';

                        return (
                            <div key={log.id} className={`flex gap-3 leading-relaxed transition-colors duration-500 ${colorClass}`}>
                                <span className="opacity-50 shrink-0">[{date}]</span>
                                <span className="transition-colors duration-500">{log.message}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
