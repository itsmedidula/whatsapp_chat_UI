import { useState, useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessage, Message } from './ChatMessage';
import { ChatInput } from './ChatInput';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hello! Welcome to Arena Tuition Classes. How can I help you today?',
    sender: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: 'read'
  }
];

// Constants moved to server-side

export function ChatWall() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    // Optimistically add user message
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Convert messages to API format
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      let botText = "Sorry, I'm having trouble connecting right now.";

      if (response.ok) {
        const data = await response.json();
        botText = data.choices?.[0]?.message?.content || botText;
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error && errorData.error.includes('OPENROUTER_API_KEY')) {
           botText = "⚠️ System Error: OPENROUTER_API_KEY is not set in Vercel environment variables.";
        } else {
           console.error("API Error:", errorData);
           // Fallback for demo if API fails (e.g. locally without env vars)
           botText = "⚠️ API Connection Failed. (Note: This requires a Vercel deployment with OPENROUTER_API_KEY set)."; 
        }
      }

      // Mark user message as read
      setMessages(prev => prev.map(msg => msg.id === newUserMessage.id ? { ...msg, status: 'read' } : msg));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Network Error:", error);
      const errorMessage: Message = {
         id: (Date.now() + 1).toString(),
         text: "⚠️ Network Error. Please check your connection.",
         sender: 'bot',
         timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#efeae2] shadow-2xl relative overflow-hidden md:border-x md:border-gray-300">
      {/* WhatsApp Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{
            backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '400px'
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader 
          name="Arena Tuition AI" 
          isVerified={true} 
          avatar="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=200&h=200"
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex justify-center my-4">
             <div className="bg-[#FFF5C4] px-3 py-1 rounded-lg text-xs text-[#54656f] shadow-sm text-center">
                Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
             </div>
          </div>
          
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isTyping && (
             <div className="flex justify-start w-full mb-2">
                 <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none shadow-sm flex items-center gap-1">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
             </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
