import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { VFile } from '../types';

export const FileExplorer: React.FC = () => {
  const { state, deleteFile, readFile, createFile } = useOS();
  const files = Object.values(state.files).sort((a,b) => (a as VFile).path.localeCompare((b as VFile).path)) as VFile[];
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const fileContents = selectedFile ? readFile(selectedFile) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-2">
        <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Filesystem</div>
      </div>
      
      <div className="flex-1 overflow-auto flex flex-col px-4 text-[13px]">
        <div className="flex-1 overflow-auto min-h-[50%]">
          {files.map(f => (
            <div 
              key={f.path} 
              onClick={() => handleSelect(f.path)}
              className={`group flex items-center justify-between py-2 px-3 mb-1 cursor-pointer rounded-lg transition-colors ${selectedFile === f.path ? 'bg-[var(--ai-bubble)] font-medium' : 'hover:bg-[var(--ai-bubble)] text-[var(--text-secondary)]'}`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="opacity-40 text-[10px]">▢</span>
                <span className={`truncate ${selectedFile === f.path ? 'text-[var(--text-primary)]' : ''}`}>{f.name}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteFile(f.path); if(selectedFile===f.path) setSelectedFile(null); }}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          {files.length === 0 && <div className="text-[var(--text-secondary)] py-2 px-3 italic">Directory empty.</div>}
        </div>

        {selectedFile && fileContents !== null && (
          <div className="h-1/2 flex flex-col mt-4 rounded-lg border border-[var(--border)] overflow-hidden bg-white shadow-sm transition-colors duration-500">
             <div className="px-4 py-2 border-b border-[var(--border)] text-xs text-[var(--text-secondary)] bg-[var(--ai-bubble)] flex justify-between font-medium transition-colors duration-500">
                {selectedFile}
                <button onClick={() => setSelectedFile(null)}>✕</button>
             </div>
             <div className="flex-1 overflow-auto p-4 bg-transparent text-[var(--text-primary)] transition-colors duration-500">
                <pre className="text-[12px] leading-relaxed font-mono whitespace-pre-wrap">{fileContents}</pre>
             </div>
          </div>
        )}
      </div>

      <div className="p-6 mt-auto">
         <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Storage</div>
         <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden mb-2 transition-colors duration-500">
            <div className="h-full bg-[var(--text-primary)] rounded-full w-1/3 opacity-50 transition-colors duration-500"></div>
         </div>
         <div className="text-[11px] text-[var(--text-secondary)]">12.4 GB used</div>
      </div>
    </div>
  );

  function handleSelect(path: string) {
    if (selectedFile === path) setSelectedFile(null);
    else setSelectedFile(path);
  }
};
