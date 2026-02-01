import { useState, KeyboardEvent } from 'react';
import { Plus, Smile, Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-2 sticky bottom-0">
      <div className="flex items-center gap-3 text-[#54656f]">
        <button className="hover:bg-black/10 p-1 rounded-full transition-colors">
          <Smile className="w-6 h-6" />
        </button>
        <button className="hover:bg-black/10 p-1 rounded-full transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 bg-white rounded-lg px-4 py-2 shadow-sm">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full text-[#111b21] placeholder:text-[#54656f] focus:outline-none bg-transparent"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex items-center gap-2">
        {message.trim() ? (
           <button 
             onClick={handleSend}
             className="bg-[#008069] text-white p-2 rounded-full hover:bg-[#00a884] transition-colors shadow-sm"
           >
             <Send className="w-5 h-5 pl-0.5" />
           </button>
        ) : (
          <button className="text-[#54656f] hover:bg-black/10 p-2 rounded-full transition-colors">
            <Mic className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
