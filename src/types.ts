export interface VFile {
  path: string;
  name: string;
  content: string;
  type: 'file';
  updatedAt: number;
}

export interface VDirectory {
  path: string;
  name: string;
  type: 'directory';
  children: (VFile | VDirectory)[];
}

export interface VProcess {
  pid: number;
  name: string;
  command: string;
  status: 'running' | 'sleeping' | 'stopped';
  cpu: number;
  memory: number;
  startTime: number;
  logs: string[];
}

export interface SystemLog {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'system';
  message: string;
}

export interface OSState {
  files: Record<string, VFile>;
  processes: Record<number, VProcess>;
  logs: SystemLog[];
  preferences: string; // The user's preferences for what AI can/cannot do
  theme: Record<string, string>;
}
