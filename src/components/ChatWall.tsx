import { useState, useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessage, Message } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { OPENAI_API_KEY } from '../config';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hello! Welcome to Arena Tuition Classes. How can I help you today?',
    sender: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: 'read'
  }
];

// --- Simulation Data (Fallback) ---
const TUITION_KEYWORDS = {
  pricing: ['price', 'cost', 'fee', 'much', 'pay'],
  subjects: ['subject', 'course', 'math', 'science', 'english', 'history'],
  schedule: ['time', 'schedule', 'when', 'hour', 'open'],
  location: ['where', 'location', 'place', 'address'],
  enroll: ['join', 'sign', 'register', 'enroll']
};

const TUITION_RESPONSE = {
  pricing: "Our fees are very affordable! \n• Primary: $100/month\n• Secondary: $150/month\n• Higher: $200/month\nDiscounts available for yearly payments!",
  subjects: "We offer comprehensive tutoring in:\n• Mathematics\n• Science (Physics, Chemistry, Biology)\n• English Literature & Language\n• History & Geography",
  schedule: "Classes are available:\n• Weekdays: 3:00 PM - 8:00 PM\n• Weekends: 9:00 AM - 5:00 PM\nFlexible slots are available upon request.",
  location: "We are located at:\n123 Education Lane,\nKnowledge City, KC 45000.\n(Near the Central Library)",
  enroll: "Great choice! You can enroll by visiting our center or filling out the form on our website at www.arenatuition.com/apply"
};

const DEFAULT_RESPONSE = "I'm here to help with any questions about Arena Tuition Classes! You can ask about our subjects, fees, schedule, or location.";

function getSimulatedResponse(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (TUITION_KEYWORDS.pricing.some(k => lowerText.includes(k))) return TUITION_RESPONSE.pricing;
  if (TUITION_KEYWORDS.subjects.some(k => lowerText.includes(k))) return TUITION_RESPONSE.subjects;
  if (TUITION_KEYWORDS.schedule.some(k => lowerText.includes(k))) return TUITION_RESPONSE.schedule;
  if (TUITION_KEYWORDS.location.some(k => lowerText.includes(k))) return TUITION_RESPONSE.location;
  if (TUITION_KEYWORDS.enroll.some(k => lowerText.includes(k))) return TUITION_RESPONSE.enroll;
  
  return DEFAULT_RESPONSE;
}

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

    let botText = "";

    try {
      // Convert messages to API format for the real request
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Attempt to hit the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (response.ok) {
        // API Success
        const data = await response.json();
        botText = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
      } else {
        throw new Error("Backend API failed");
      }

    } catch (error) {
      console.warn("Backend API unavailable, attempting client-side fallback...");
      
      try {
        if (!OPENAI_API_KEY) throw new Error("No client-side key");

        const systemPrompt = {
          role: 'system',
          content: `You are a helpful assistant for Arena Tuition Classes.
          
          Details:
          - Available Subjects: Mathematics, Science, English
          - Grades: 1st to 12th
          
          Fees Structure:
          - Primary (1-5): $40/month
          - Middle (6-8): $50/month
          - High School (9-12): $70/month
          
          Location: 123 Education Lane, Knowledge City
          Contact: +1 234 567 8900
          
          Instructions:
          - Be polite and helpful.
          - Keep responses concise, similar to WhatsApp messages.
          - If asked about enrolling, guide them to visit the office.
          - Use emojis occasionally.
          `
        };

        const apiMessages = updatedMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [systemPrompt, ...apiMessages],
          })
        });

        if (response.ok) {
           const data = await response.json();
           botText = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
        } else {
           throw new Error("Client-side API failed");
        }

      } catch (fallbackError) {
        console.warn("Client-side API failed, falling back to local simulation:", fallbackError);
        // Final Fallback to simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
        botText = getSimulatedResponse(text);
      }
    }

    // Finalize Bot Message
    
    // Mark user message as read
    setMessages(prev => prev.map(msg => msg.id === newUserMessage.id ? { ...msg, status: 'read' } : msg));

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
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
