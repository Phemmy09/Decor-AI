import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, CalculatedQuote } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { processAgentMessage, IntakeContext } from '../../services/aiAgentService';
import { InteractiveQuoteCard } from './InteractiveQuoteCard';
import { playMessageSentSound } from '../../utils/audioAlerts';
import { Send, Phone, Video, MoreVertical, CheckCheck, Sparkles, Smile, Paperclip, Mic } from 'lucide-react';

export const WhatsAppChat: React.FC = () => {
  const { businessConfig, addNewLeadFromIntake, setActiveProposalQuote } = useLeads();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'wa_init_1',
      sender: 'agent',
      content: `Hello! ✨ I'm ${businessConfig.aiPersonaName}, your 24/7 AI Event Stylist at *${businessConfig.companyName}*. \n\nI can instantly calculate an itemized quote for your celebration. What type of event are you planning?`,
      timestamp: 'Just now',
      channel: 'whatsapp',
      quickReplies: ['💍 Luxury Wedding', '🥂 Corporate Gala', '🎂 Milestone Birthday', '🍼 Baby Shower']
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<IntakeContext>({ stage: 'greeting' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    playMessageSentSound();
    setInputVal('');

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'client',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: 'whatsapp'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate realistic typing delay
    setTimeout(async () => {
      const response = await processAgentMessage(text, context, businessConfig);
      setContext(response.updatedContext);

      const agentMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'agent',
        content: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'whatsapp',
        quickReplies: response.quickReplies,
        interactiveQuote: response.quoteGenerated
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);

      // If a quote was generated, automatically log/sync the lead into CRM
      if (response.quoteGenerated) {
        const lead = addNewLeadFromIntake({
          clientName: response.updatedContext.clientName || 'WhatsApp Prospect',
          channel: 'whatsapp',
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
    }, 900);
  };

  return (
    <div className="flex flex-col h-[640px] max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#0B141A]">
      {/* WhatsApp Header */}
      <div className="px-4 py-3 bg-[#202C33] flex items-center justify-between border-b border-[#2A3942]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 to-amber-400 p-0.5 flex items-center justify-center text-obsidian-950 font-bold">
              <Sparkles className="w-5 h-5 text-obsidian-950" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#202C33]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-slate-100">{businessConfig.companyName}</h3>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-medium">Verified AI</span>
            </div>
            <p className="text-xs text-slate-400">{isTyping ? 'typing...' : 'Online 24/7 Concierge'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-slate-400">
          <button className="hover:text-slate-200 transition-colors"><Phone className="w-4 h-4" /></button>
          <button className="hover:text-slate-200 transition-colors"><Video className="w-4 h-4" /></button>
          <button className="hover:text-slate-200 transition-colors"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* WhatsApp Message Body with background pattern */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B141A] bg-opacity-95" style={{ backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`, backgroundSize: '16px 16px' }}>
        {/* Security / Encryption Notice */}
        <div className="text-center my-2">
          <span className="px-3 py-1 text-[11px] rounded-lg bg-[#182229] text-amber-200/80 border border-[#222E35] inline-block shadow-sm">
            🔒 Messages with AI Concierge are instantly logged into CRM
          </span>
        </div>

        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div key={msg.id} className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${
                  isAgent
                    ? 'bg-[#202C33] text-slate-100 rounded-tl-none border border-[#2A3942]'
                    : 'bg-[#005C4B] text-slate-100 rounded-tr-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                {/* Interactive Quote Card if attached */}
                {msg.interactiveQuote && (
                  <div className="mt-2">
                    <InteractiveQuoteCard
                      quote={msg.interactiveQuote}
                      onOpenProposal={() => {
                        const tempLead = addNewLeadFromIntake({}, msg.interactiveQuote);
                        setActiveProposalQuote({ lead: tempLead, quote: msg.interactiveQuote! });
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isAgent && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </div>

              {/* Quick Reply Chips */}
              {isAgent && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(reply)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#182229] hover:bg-[#202C33] border border-gold-500/30 text-gold-300 transition-all shadow-sm hover:scale-105"
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
          <div className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-[#202C33] rounded-tl-none border border-[#2A3942] w-20">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp Input Bar */}
      <div className="px-3 py-2.5 bg-[#202C33] border-t border-[#2A3942] flex items-center space-x-2">
        <button className="text-slate-400 hover:text-slate-200 p-1.5"><Smile className="w-5 h-5" /></button>
        <button className="text-slate-400 hover:text-slate-200 p-1.5"><Paperclip className="w-5 h-5" /></button>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Describe your event date, guests, or decor theme..."
          className="flex-1 bg-[#2A3942] text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-emerald-500 placeholder-slate-400"
        />
        {inputVal.trim() ? (
          <button
            onClick={() => handleSendMessage()}
            className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#029071] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button className="text-slate-400 hover:text-slate-200 p-2">
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
