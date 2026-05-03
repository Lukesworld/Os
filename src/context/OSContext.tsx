import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { OSState, VFile, VProcess, SystemLog } from '../types';

interface OSContextType {
  state: OSState;
  createFile: (path: string, content: string) => string;
  deleteFile: (path: string) => string;
  readFile: (path: string) => string | null;
  listFiles: (directory: string) => string[];
  startProcess: (name: string, command: string) => number;
  killProcess: (pid: number) => string;
  addLog: (level: SystemLog['level'], message: string) => void;
  setPreferences: (prefs: string) => void;
  setThemeVariable: (key: string, value: string) => string;
}

const OSContext = createContext<OSContextType | null>(null);

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within OSProvider');
  return context;
};

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OSState>({
    files: {
      '/readme.txt': {
        path: '/readme.txt',
        name: 'readme.txt',
        content: 'Welcome to VAOS (Virtual Autonomous OS).\nThis sandbox is entirely isolated.\nUse the AI terminal to interact.',
        type: 'file',
        updatedAt: Date.now(),
      }
    },
    processes: {
      1: {
        pid: 1,
        name: 'init',
        command: '/sbin/init',
        status: 'running',
        cpu: 0.1,
        memory: 12.4,
        startTime: Date.now() - 100000,
        logs: ['System initialized'],
      },
      2: {
        pid: 2,
        name: 'ai_daemon',
        command: 'ai-core --autonomous',
        status: 'running',
        cpu: 2.4,
        memory: 256.0,
        startTime: Date.now() - 90000,
        logs: ['Listening for events'],
      }
    },
    logs: [
      { id: 'logger-1', timestamp: Date.now() - 10000, level: 'system', message: 'VAOS Kernel booted.' },
      { id: 'logger-2', timestamp: Date.now() - 5000, level: 'info', message: 'AI subsystem online.' }
    ],
    preferences: 'The AI is extremely proactive and helpful. Do not delete essential system files (like /readme.txt). Manage processes to optimize CPU.',
    theme: {
      '--bg': '#f9f9fb',
      '--sidebar-bg': '#ffffff',
      '--border': '#ececed',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#71717a',
      '--accent': '#8b5cf6', // A soft cloud/aether-like color
      '--ai-bubble': '#f1f1f3',
      '--process-card': '#fafafa'
    }
  });

  const nextPid = useRef(3);

  const addLog = useCallback((level: SystemLog['level'], message: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { id: Math.random().toString(36).substring(7), timestamp: Date.now(), level, message }].slice(-100) // keep last 100
    }));
  }, []);

  const createFile = useCallback((path: string, content: string) => {
    if (!path.startsWith('/')) path = '/' + path;
    setState(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [path]: { path, name: path.split('/').pop() || 'unnamed', content, type: 'file', updatedAt: Date.now() }
      }
    }));
    addLog('info', `File created: ${path}`);
    return `Success: Created file ${path}`;
  }, [addLog]);

  const deleteFile = useCallback((path: string) => {
    if (!path.startsWith('/')) path = '/' + path;
    let success = false;
    setState(prev => {
      const newFiles = { ...prev.files };
      if (newFiles[path]) {
        delete newFiles[path];
        success = true;
      }
      return { ...prev, files: newFiles };
    });
    if (success) {
      addLog('warn', `File deleted: ${path}`);
      return `Success: Deleted file ${path}`;
    }
    return `Error: File not found ${path}`;
  }, [addLog]);

  const readFile = useCallback((path: string) => {
    if (!path.startsWith('/')) path = '/' + path;
    return state.files[path]?.content || null;
  }, [state.files]);

  const listFiles = useCallback((directory: string) => {
    const dirPrefix = directory.endsWith('/') ? directory : directory + '/';
    const isRoot = directory === '/';
    return Object.keys(state.files).filter(path => {
      if (isRoot) return true;
      return path.startsWith(dirPrefix);
    });
  }, [state.files]);

  const startProcess = useCallback((name: string, command: string) => {
    const pid = nextPid.current++;
    setState(prev => ({
      ...prev,
      processes: {
        ...prev.processes,
        [pid]: {
          pid,
          name,
          command,
          status: 'running',
          cpu: Math.random() * 5,
          memory: Math.random() * 50 + 10,
          startTime: Date.now(),
          logs: [`Started process ${name} [${pid}]`]
        }
      }
    }));
    addLog('system', `Process started: ${name} (PID: ${pid})`);
    return pid;
  }, [addLog]);

  const killProcess = useCallback((pid: number) => {
    let success = false;
    setState(prev => {
      const newProcs = { ...prev.processes };
      if (newProcs[pid]) {
        newProcs[pid].status = 'terminated' as any;
        delete newProcs[pid]; // purely kill it for simplicity
        success = true;
      }
      return { ...prev, processes: newProcs };
    });
    if (success) {
      addLog('warn', `Process terminated: PID ${pid}`);
      return `Success: Killed process ${pid}`;
    }
    return `Error: Process not found ${pid}`;
  }, [addLog]);

  const setPreferences = useCallback((prefs: string) => {
    setState(prev => ({ ...prev, preferences: prefs }));
    addLog('system', 'System constraints/preferences updated.');
  }, [addLog]);

  const setThemeVariable = useCallback((key: string, value: string) => {
    const actualKey = key.startsWith('--') ? key : `--${key}`;
    setState(prev => ({
      ...prev,
      theme: { ...prev.theme, [actualKey]: value }
    }));
    addLog('system', `Theme variable ${actualKey} updated to ${value}`);
    return `Success: Theme updated ${actualKey}=${value}`;
  }, [addLog]);

  // Simulated passive dynamics: CPU memory fluctuating
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newProcs = { ...prev.processes };
        let changed = false;
        Object.keys(newProcs).forEach(key => {
          const p = newProcs[Number(key)];
          if (p.status === 'running') {
            newProcs[Number(key)] = {
              ...p,
              cpu: Math.max(0, Math.min(100, p.cpu + (Math.random() - 0.5) * 5)),
              memory: Math.max(1, p.memory + (Math.random() - 0.5) * 2),
            };
            changed = true;
          }
        });
        return changed ? { ...prev, processes: newProcs } : prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <OSContext.Provider value={{ state, createFile, deleteFile, readFile, listFiles, startProcess, killProcess, addLog, setPreferences, setThemeVariable }}>
      {children}
    </OSContext.Provider>
  );
};
