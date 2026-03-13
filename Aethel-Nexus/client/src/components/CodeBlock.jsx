import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoCheckmark, IoCopyOutline, IoTerminal } from "react-icons/io5";

const CodeBlock = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-4 border border-gray-200 dark:border-gray-700 shadow-sm bg-[#1e1e1e]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-gray-700">
        <div className="flex items-center gap-2">
           <IoTerminal className="text-gray-400" size={14} />
           <span className="font-mono text-xs font-medium text-gray-300 lowercase">{language || 'code'}</span>
        </div>
        
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          {isCopied ? <IoCheckmark className="text-emerald-400" size={14} /> : <IoCopyOutline size={14} />}
          <span>{isCopied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code Area */}
      <div className="font-mono text-sm leading-relaxed">
        <SyntaxHighlighter 
          language={language || 'javascript'} 
          style={vscDarkPlus}
          customStyle={{ 
            margin: 0, 
            padding: '1.25rem', 
            fontSize: '0.9rem', 
            backgroundColor: '#1e1e1e' 
          }}
          wrapLongLines={true}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;