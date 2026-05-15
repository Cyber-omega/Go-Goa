import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User, MapPin, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  type?: 'loading' | 'recommendation' | 'text';
  data?: any;
}

export const AIItineraryPlanner = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'Bem-vindo! I am your AI Heritage Concierge. I can design a sustainable journey through Goa based on your energy and the local rhythms. How are you feeling today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Analyzing heritage density and tide patterns for a regeneratie voyage...',
        type: 'loading'
      };
      setMessages(prev => [...prev, assistantMsg]);

      setTimeout(() => {
        setMessages(prev => {
          const filtered = prev.filter(m => m.type !== 'loading');
          return [...filtered, {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            text: 'I have refined a Susegad-mode discovery for you. We will start at the Fontainhas Latin Quarter early to catch the soft light on the azulejos, followed by a regenerative brunch at a restored Indo-Portuguese villa.',
            type: 'recommendation',
            data: {
              location: 'Fontainhas',
              time: '07:30 AM',
              impact: 'Community Positive'
            }
          }];
        });
      }, 2500);
    }, 1000);
  };

  return (
    <Card className="stacked-shadow border-none rounded-[40px] bg-white/40 backdrop-blur-xl overflow-hidden flex flex-col h-[600px] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-palm/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="p-6 border-b border-palm/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center glow-ocean">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-palm">AI Concierge</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-ocean animate-pulse" />
              <span className="text-[10px] font-bold text-ocean">Tuning to Goan Rhythms</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="border-earth/20 text-earth bg-earth/5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          Susegad Mode Active
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-earth/10' : 'bg-palm/10'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-earth" /> : <Sparkles className="w-4 h-4 text-palm" />}
                </div>
                
                <div className="space-y-2">
                  <div className={`p-4 rounded-[24px] ${
                    msg.role === 'user' 
                      ? 'bg-accent-gradient text-white premium-shadow rounded-tr-none border-none' 
                      : 'bg-white/80 backdrop-blur-md text-ink premium-shadow rounded-tl-none'
                  }`}>
                    {msg.type === 'loading' ? (
                      <div className="flex items-center gap-3 py-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-palm" />
                        <span className="text-xs font-bold italic text-palm/60 tracking-tight">Generating unique path...</span>
                      </div>
                    ) : (
                      <p className="text-sm font-sans font-light leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {msg.type === 'recommendation' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-teal p-4 rounded-[24px] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-palm" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-palm">{msg.data.location}</span>
                        </div>
                        <Badge className="bg-ocean/20 text-ocean border-none text-[8px] font-black uppercase tracking-widest">
                          {msg.data.impact}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-ink/40" />
                          <span className="text-[10px] font-medium text-ink/60">Today</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-ink/40" />
                          <span className="text-[10px] font-medium text-ink/60">{msg.data.time}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-brand-gradient text-white rounded-xl text-[10px] font-black uppercase tracking-widest h-8 border-none active:scale-95 transition-transform">
                        Integrate to Path
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 ml-10 p-3 bg-white/40 backdrop-blur-sm rounded-2xl w-fit"
             >
                <div className="flex gap-1">
                   {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-1.5 h-1.5 rounded-full bg-palm/40" 
                      />
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-palm/10 relative z-10 bg-white/20 backdrop-blur-md">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your mood or destination..."
            className="w-full bg-white/60 focus:bg-white backdrop-blur-xl border border-palm/10 rounded-[20px] py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-palm/20 transition-all outline-none font-sans"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center glow-ocean hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 border-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[8px] text-center mt-3 font-medium uppercase tracking-[0.2em] text-palm/40">
          Agentic AI tuned to local heritage and environmental data
        </p>
      </div>
    </Card>
  );
};
