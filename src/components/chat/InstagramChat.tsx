import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { processAgentMessage, IntakeContext } from '../../services/aiAgentService';
import { InteractiveQuoteCard } from './InteractiveQuoteCard';
import { playMessageSentSound } from '../../utils/audioAlerts';
import { Send, Heart, Image, Info, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../common/Icons';

export const InstagramChat: React.FC = () => {
  const { businessConfig, addNewLeadFromIntake, setActiveProposalQuote } = useLeads();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ig_init_1',
      sender: 'agent',
      content: `Hey there! ✨ Thanks for reaching out to @${businessConfig.companyName.toLowerCase().replace(/\s+/g, '')}. \n\nI'm Aura, our AI Decor Concierge. Tell me a bit about your upcoming event date and guest count so I can send an instant quote right to your DM!`,
      timestamp: 'Just now',
      channel: 'instagram',
      quickReplies: ['Fall Wedding 2026', 'Milestone 30th Bday', 'Corporate Gala', 'Baby Shower 🌸']
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
      id: `msg_ig_u_${Date.now()}`,
      sender: 'client',
      content: text,
      timestamp: 'Just now',
      channel: 'instagram'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(async () => {
      const response = await processAgentMessage(text, context, businessConfig);
      setContext(response.updatedContext);

      const agentMsg: ChatMessage = {
        id: `msg_ig_a_${Date.now()}`,
        sender: 'agent',
        content: response.replyText,
        timestamp: 'Just now',
        channel: 'instagram',
        quickReplies: response.quickReplies,
        interactiveQuote: response.quoteGenerated
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);

      if (response.quoteGenerated) {
        addNewLeadFromIntake({
          clientName: 'Instagram Inquirer',
          clientHandle: '@ig_prospect_' + Math.floor(100 + Math.random() * 899),
          channel: 'instagram',
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
    }, 850);
  };

  return (
    <div className="flex flex-col h-[640px] max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-obsidian-950">
      {/* Instagram Header */}
      <div className="px-4 py-3.5 bg-obsidian-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <div className="w-full h-full bg-obsidian-900 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-obsidian-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight">{businessConfig.companyName}</h3>
              <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-[11px] text-slate-400">Direct Message • Active now</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <div className="px-2 py-1 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg text-[10px] text-purple-300 flex items-center gap-1">
            <InstagramIcon className="w-3 h-3" /> IG Direct
          </div>
          <button className="hover:text-slate-200"><Info className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-obsidian-950">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full mx-auto p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 mb-2">
            <div className="w-full h-full bg-obsidian-900 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-400" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-white">{businessConfig.companyName}</h4>
          <p className="text-xs text-slate-400">Luxe Event Styling & Luxury Production</p>
          <span className="text-[10px] text-slate-500 block mt-1">24.5K followers • 840 posts</span>
        </div>

        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div key={msg.id} className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm shadow-md ${
                  isAgent
                    ? 'bg-obsidian-800 text-slate-100 border border-slate-700/60 rounded-bl-sm'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

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
              </div>

              {isAgent && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(reply)}
                      className="text-xs px-3 py-1.5 rounded-full bg-obsidian-850 hover:bg-obsidian-750 border border-purple-500/40 text-purple-200 transition-all shadow-sm hover:scale-105"
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
          <div className="flex items-center space-x-1 px-4 py-3 rounded-full bg-obsidian-800 border border-slate-700 w-16">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.4s]"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-obsidian-900 border-t border-slate-800 flex items-center space-x-2">
        <button className="text-slate-400 hover:text-slate-200 p-1.5"><Image className="w-5 h-5" /></button>
        <button className="text-slate-400 hover:text-slate-200 p-1.5"><Heart className="w-5 h-5" /></button>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Message with date, guests, or theme..."
          className="flex-1 bg-obsidian-800 text-slate-100 text-sm px-4 py-2.5 rounded-full border border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-500"
        />
        {inputVal.trim() && (
          <button
            onClick={() => handleSendMessage()}
            className="text-purple-400 hover:text-purple-300 font-semibold text-sm px-3"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
};
