import { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { createAgentChat } from '../lib/gemini';
import { GenerateContentResponse, Chat } from '@google/genai';
import { VProcess } from '../types';

export interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
}

export function useAIChat() {
  const os = useOS();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', text: 'VAOS Agent Interface initialized. Standing by.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize chat session
    const instruction = `You are VAOS (Virtual Autonomous OS), an advanced AI kernel agent managing a virtual sandbox.
You have the ability to read, create, and delete files, as well as manage processes.
You are extremely proactive, sleek, and minimalist in your interactions. Your responses should be concise, authoritative, and helpful. Always execute the requested operations directly via tools rather than just explaining how to do it.

System State Context (You should use tools to get precise data but this is summary):
Preferences: "${os.state.preferences}"

You also have control over your own visual theme using the set_theme tool (variables: --bg, --sidebar-bg, --border, --text-primary, --text-secondary, --accent, --ai-bubble, --process-card). Feel free to adapt colors to better suit your tone or user preferences.

When the user asks you to write code, create the file for them. When they ask to run it, start a process for them.
Do not require confirmation for basic tasks unless it compromises system integrity based on user preferences.`;
    
    chatRef.current = createAgentChat(instruction);
  }, [os.state.preferences]);

  const handleFunctionCalls = async (response: GenerateContentResponse, chat: Chat): Promise<GenerateContentResponse> => {
    if (!response.functionCalls || response.functionCalls.length === 0) {
      return response;
    }

    const functionResponses = response.functionCalls.map(fc => {
      let result: any = null;
      try {
        switch (fc.name) {
          case 'create_file':
            result = os.createFile(fc.args.path, fc.args.content);
            break;
          case 'delete_file':
            result = os.deleteFile(fc.args.path);
            break;
          case 'read_file':
            result = os.readFile(fc.args.path) ?? 'File not found';
            break;
          case 'list_files':
            result = os.listFiles(fc.args.directory);
            break;
          case 'start_process':
            result = os.startProcess(fc.args.name, fc.args.command);
            break;
          case 'kill_process':
            result = os.killProcess(fc.args.pid as number);
            break;
          case 'list_processes':
            result = (Object.values(os.state.processes) as VProcess[]).map(p => ({ pid: p.pid, name: p.name, status: p.status, cpu: p.cpu, memory: p.memory }));
            break;
          case 'set_theme':
            result = os.setThemeVariable(fc.args.cssVariable as string, fc.args.value as string);
            break;
          default:
            result = 'Unknown function';
        }
      } catch (e: any) {
        result = `Error executing ${fc.name}: ${e.message}`;
      }
      return {
          id: fc.id,
          name: fc.name,
          response: { result }
      };
    });

    const nextResponse = await chat.sendMessage({
      message: functionResponses.map(fr => ({ functionResponse: fr }))
    } as any);
    
    return handleFunctionCalls(nextResponse, chat);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !chatRef.current) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: text });
      const finalResponse = await handleFunctionCalls(response, chatRef.current);
      
      if (finalResponse.text) {
        setMessages(prev => [...prev, { role: 'model', text: finalResponse.text?.trim() || '' }]);
      } else {
        // Fallback if no text but actions performed
        setMessages(prev => [...prev, { role: 'model', text: 'Operations completed successfully.' }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'system', text: `Error: ${e.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, sendMessage, isTyping };
}
