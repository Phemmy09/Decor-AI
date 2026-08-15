import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { processAgentMessage, IntakeContext } from '../../services/aiAgentService';
import { InteractiveQuoteCard } from './InteractiveQuoteCard';
import { playMessageSentSound } from '../../utils/audioAlerts';
import { Send, Sparkles, MessageCircle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const WebsiteWidgetChat: React.FC = () => {
  const { businessConfig, addNewLeadFromIntake, setActiveProposalQuote } = useLeads();
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'web_init_1',
      sender: 'agent',
      content: `Welcome to ${businessConfig.companyName}! ✨ \n\nI can calculate your personalized decoration quote in under 30 seconds. What kind of event are you hosting?`,
      timestamp: 'Just now',
      channel: 'website_widget',
      quickReplies: ['💍 Luxury Wedding', '🥂 Corporate Gala', '🎂 30th / 50th Bday', '✨ Anniversary']
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<IntakeContext>({ stage: 'greeting' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    playMessageSentSound();
    setInputVal('');

    const userMsg: ChatMessage = {
      id: `msg_web_u_${Date.now()}`,
      sender: 'client',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: 'website_widget'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(async () => {
      const response = await processAgentMessage(text, context, businessConfig);
      setContext(response.updatedContext);

      const agentMsg: ChatMessage = {
        id: `msg_web_a_${Date.now()}`,
        sender: 'agent',
        content: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'website_widget',
        quickReplies: response.quickReplies,
        interactiveQuote: response.quoteGenerated
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);

      if (response.quoteGenerated) {
        addNewLeadFromIntake({
          clientName: 'Website Visitor',
          clientHandle: 'Website Lead #' + Math.floor(1000 + Math.random() * 9000),
          channel: 'website_widget',
          eventType: response.quoteGenerated.eventType,
          eventDate: response.quoteGenerated.eventDate,
          guestCount: response.quoteGenerated.guestCount,
          venueType: response.quoteGenerated.venueType,
          themeId: response.quoteGenerated.themeId,
          themeName: response.quoteGenerated.themeName,
          selectedAddOns: response.quoteGenerated.selectedAddOns,
          budgetExpectation: response.quoteGenerated.totalEstimatedValue,
          messages: [...messages, userMsg, agentMsg],
        }, response.quoteGenerated);
      }
    }, 800);
  };

  return (
    <div className="relative max-w-xl mx-auto h-[640px] flex flex-col justify-end">
      {/* Background fake website showcase */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-black p-6 border border-slate-800 opacity-40 pointer-events-none flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-serif font-bold text-gold-400">{businessConfig.companyName}</span>
            <div className="flex gap-3 text-xs text-slate-400">
              <span>Portfolios</span>
              <span>Weddings</span>
              <span>Galas</span>
              <span>Contact</span>
            </div>
          </div>
          <div className="mt-8 max-w-sm">
            <h2 className="text-2xl font-serif font-bold text-white leading-tight">Elevate Every Moment With Bespoke Spatial Artistry</h2>
            <p className="text-xs text-slate-400 mt-2">Award-winning luxury wedding & event decor production.</p>
          </div>
        </div>
      </div>

      {/* Floating Website Widget Window */}
      {isOpen ? (
        <div className="relative z-10 w-full h-[600px] rounded-2xl overflow-hidden glass-card-gold flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border-b border-gold-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {businessConfig.companyName} Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h4>
                <p className="text-[10px] text-gold-400/80">Instant AI Estimate Calculator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-obsidian-950/80">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div key={msg.id} className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-md ${
                      isAgent
                        ? 'bg-obsidian-850 text-slate-100 border border-gold-500/20 rounded-tl-none'
                        : 'bg-gold-500 text-obsidian-950 font-medium rounded-tr-none'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                    {msg.interactiveQuote && (
                      <div className="mt-2 text-slate-100 font-normal">
                        <InteractiveQuoteCard
                          quote={msg.interactiveQuote}
                          onOpenProposal={() => {
                            const tempLead = addNewLeadFromIntake({}, msg.interactiveQuote);
                            setActiveProposalQuote({ lead: tempLead, quote: msg.interactiveQuote! });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {isAgent && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(reply)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 border border-gold-500/30 text-gold-300 transition-all hover:scale-105"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-obsidian-800 border border-slate-700 w-14">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-obsidian-900 border-t border-gold-500/20 flex items-center space-x-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tell Aura your date, guest count, or decor style..."
              className="flex-1 bg-obsidian-800 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-gold-500 placeholder-slate-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 transition-transform hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative z-10 self-end mb-4 mr-4 px-4 py-3 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-bold text-xs shadow-gold-glow flex items-center gap-2 hover:scale-105 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Get Instant Quote</span>
        </button>
      )}
    </div>
  );
};
