import { cn } from '../utils/cn';
import { CheckCheck } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className={cn(
      "flex w-full mb-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] md:max-w-[60%] px-3 py-2 rounded-lg shadow-sm relative text-sm md:text-base leading-relaxed break-words",
        isUser ? "bg-[#E7FFDB] rounded-tr-none" : "bg-white rounded-tl-none"
      )}>
        <p className="text-[#111b21]">{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-[#667781] min-w-[50px] text-right">
            {formatTime(message.timestamp)}
          </span>
          {isUser && (
            <span className={cn(
               "text-[15px]",
               message.status === 'read' ? "text-[#53bdeb]" : "text-[#8696a0]"
            )}>
              <CheckCheck className="w-4 h-4" />
            </span>
          )}
        </div>
        
        {/* Triangle for bubble tail */}
        <div className={cn(
          "absolute top-0 w-0 h-0 border-[6px] border-transparent",
          isUser 
            ? "right-[-6px] border-t-[#E7FFDB] border-r-0 border-b-0" 
            : "left-[-6px] border-t-white border-l-0 border-b-0"
        )} />
      </div>
    </div>
  );
}
