import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { OSState } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const toolsDeclarations: FunctionDeclaration[] = [
  {
    name: 'create_file',
    description: 'Create a new file in the virtual filesystem or overwrite an existing one.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: { type: Type.STRING, description: 'Absolute path of the file to create (e.g., /scripts/hello.py)' },
        content: { type: Type.STRING, description: 'Content of the file. To clear a file, provide an empty string.' },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'delete_file',
    description: 'Delete a file from the virtual filesystem.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: { type: Type.STRING, description: 'Absolute path of the file to delete (e.g., /scripts/hello.py)' },
      },
      required: ['path'],
    },
  },
  {
    name: 'read_file',
    description: 'Read the contents of a file.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: { type: Type.STRING, description: 'Absolute path of the file to read' },
      },
      required: ['path'],
    },
  },
  {
    name: 'list_files',
    description: 'List all files currently in the virtual filesystem.',
    parameters: {
      type: Type.OBJECT,
      properties: {
         directory: { type: Type.STRING, description: 'Directory to list files in. Use / for root.' },
      },
      required: ['directory'],
    },
  },
  {
    name: 'start_process',
    description: 'Start a new background process.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: 'A short readable name for the process.' },
        command: { type: Type.STRING, description: 'The command being executed (e.g. "python server.py").' },
      },
      required: ['name', 'command'],
    },
  },
  {
    name: 'kill_process',
    description: 'Terminate an active process by its ID.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        pid: { type: Type.NUMBER, description: 'The Process ID (PID) to kill.' },
      },
      required: ['pid'],
    },
  },
  {
    name: 'list_processes',
    description: 'List all currently running processes in the system.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Optional filter query.' }
      }
    }
  },
  {
    name: 'set_theme',
    description: 'Update the visual theme of the OS by setting CSS variables. The OS is currently sleek, minimalist, cloud-like. You can change colors to suit your mood or user request.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        cssVariable: { type: Type.STRING, description: 'The CSS variable to update (e.g., --bg, --text-primary, --text-secondary, --sidebar-bg, --border, --accent, --ai-bubble, --process-card)' },
        value: { type: Type.STRING, description: 'The color value (hex, rgb, etc.)' },
      },
      required: ['cssVariable', 'value'],
    },
  }
];

export const createAgentChat = (initialSystemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3.1-pro-preview',
    config: {
      systemInstruction: initialSystemInstruction,
      tools: [{ functionDeclarations: toolsDeclarations }],
      temperature: 0.1, // Keep it precise and technical
    },
  });
};
