import React, { useState, useRef, useEffect } from 'react';
import { generateLogisticsAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles, HelpCircle, Package, Car } from 'lucide-react';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Hi, I\'m Tele! Your personal logistics AI. How can I help you move something today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const context = "User is looking at the dashboard. Needs quick, efficient answers.";
    const responseText = await generateLogisticsAdvice(userMsg.text, context);

    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const QuickAction = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <button 
      onClick={() => handleSend(text)}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
    >
      <Icon size={12} />
      {text}
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] transition-all animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">Tele <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] uppercase font-bold tracking-wider">Beta</span></h3>
                <p className="text-xs text-slate-300">Logistics Intelligence</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-700 p-1 rounded transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Bot size={14} className="text-slate-600" />
                  </div>
                )}
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Bot size={14} className="text-slate-600" />
                  </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-xs text-gray-400">Tele is thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-1">
              <QuickAction icon={Package} text="Track my package" />
              <QuickAction icon={Car} text="Where is my ride?" />
              <QuickAction icon={HelpCircle} text="Support tracking" />
              <QuickAction icon={Sparkles} text="Cheapest option?" />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Tele anything..."
                className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="bg-slate-900 text-white p-2.5 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-800 scale-90' : 'bg-slate-900 hover:bg-blue-600'} text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 relative group`}
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        <MessageCircle size={28} />
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask Tele
        </span>
      </button>
    </div>
  );
};
