import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';

interface DriverChatProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
}

export const DriverChat: React.FC<DriverChatProps> = ({ isOpen, onClose, driverName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'driver', text: `Hi, I'm ${driverName}. I'm on my way!`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate driver response
    setTimeout(() => {
      const driverMsg: ChatMessage = { id: (Date.now()+1).toString(), role: 'driver', text: 'Got it, see you soon.', timestamp: Date.now() };
      setMessages(prev => [...prev, driverMsg]);
    }, 2000);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-96 animate-in slide-in-from-right-10">
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
            <img src="https://i.pravatar.cc/150?img=12" alt="Driver" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{driverName}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Active
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-slate-700 rounded-full">
            <Phone size={16} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message driver..."
            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
