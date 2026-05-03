import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import { Send, Settings } from 'lucide-react';
import { useOS } from '../context/OSContext';

export const ChatBox: React.FC = () => {
  const { messages, sendMessage, isTyping } = useAIChat();
  const { state, setPreferences } = useOS();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Settings Overlay */}
      {showSettings && (
        <div className="absolute top-0 left-0 right-0 bg-[var(--sidebar-bg)] border-b border-[var(--border)] p-6 z-20 shadow-sm backdrop-blur-lg bg-opacity-90 transition-colors duration-500">
          <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-3">AI Directives</label>
          <textarea 
            className="w-full bg-transparent text-[13px] text-[var(--text-primary)] p-0 rounded-none border-b border-[var(--border)] focus:border-[var(--accent)] outline-none min-h-[60px] resize-none pb-2 transition-colors duration-500"
            defaultValue={state.preferences}
            onBlur={(e) => setPreferences(e.target.value)}
          />
        </div>
      )}

      {/* Settings Toggle in Chat Area */}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={() => setShowSettings(!showSettings)} className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors p-2 bg-[var(--bg)] rounded-full shadow-sm border border-[var(--border)]">
          <Settings size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-12 space-y-8 pb-32" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
               <div className="px-6 py-2 text-[var(--text-secondary)] text-right max-w-[70%] text-[14px]">
                 {m.text}
               </div>
            ) : m.role === 'system' ? (
               <div className="bg-[var(--ai-bubble)] opacity-60 px-4 py-2 rounded-lg text-[var(--text-secondary)] text-xs italic transition-colors mx-auto my-2">
                 {m.text}
               </div>
            ) : (
               <div className="max-w-[85%] bg-[var(--ai-bubble)] p-6 rounded-2xl rounded-tl-sm text-[var(--text-primary)] leading-relaxed text-[15px] shadow-sm transition-colors duration-500">
                 <strong className="block mb-2 font-semibold text-[var(--accent)] text-[13px]">Aether Intelligence</strong>
                 {m.text}
               </div>
            )}
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-[var(--ai-bubble)] p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 transition-colors duration-500">
                <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-8 left-10 right-10">
        <form onSubmit={handleSubmit} className="relative flex items-center bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-6 py-4 transition-colors duration-500">
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none text-[15px] transition-colors"
            placeholder="Instruct the AI or type a command..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isTyping}
            autoFocus
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()} 
            className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors disabled:opacity-30 ml-4"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
