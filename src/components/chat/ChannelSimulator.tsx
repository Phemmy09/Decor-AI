import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { MessagingChannel } from '../../types';
import { WhatsAppChat } from './WhatsAppChat';
import { InstagramChat } from './InstagramChat';
import { WebsiteWidgetChat } from './WebsiteWidgetChat';
import { DirectPortalChat } from './DirectPortalChat';
import { MessageSquare, Globe, Sparkles, Wand2, ShieldAlert } from 'lucide-react';
import { InstagramIcon } from '../common/Icons';

export const ChannelSimulator: React.FC = () => {
  const { activeChannel, setActiveChannel, businessConfig, addNewLeadFromIntake } = useLeads();

  const channels: { id: MessagingChannel; label: string; icon: React.ReactNode; badge: string; color: string }[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp Business',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: 'Active AI 24/7',
      color: 'hover:border-emerald-500 text-emerald-400'
    },
    {
      id: 'instagram',
      label: 'Instagram Direct DM',
      icon: <InstagramIcon className="w-4 h-4" />,
      badge: 'Social Leads',
      color: 'hover:border-pink-500 text-pink-400'
    },
    {
      id: 'website_widget',
      label: 'Website Live Widget',
      icon: <Globe className="w-4 h-4" />,
      badge: 'Website Concierge',
      color: 'hover:border-gold-500 text-gold-400'
    },
    {
      id: 'direct_portal',
      label: 'Direct Quote Portal',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'Full Intake Flow',
      color: 'hover:border-amber-400 text-amber-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Simulation Presets */}
      <div className="glass-panel p-4 rounded-2xl border border-gold-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Omnichannel AI Lead Intake Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how <span className="text-gold-300 font-semibold">{businessConfig.aiPersonaName}</span> converses with prospects across messaging channels, extracts event specs, and auto-qualifies high-value leads into your CRM.
          </p>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="flex items-center bg-obsidian-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          {channels.map((ch) => {
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-obsidian-800 text-white shadow-sm border border-gold-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={isActive ? 'text-gold-400' : ''}>{ch.icon}</span>
                <span className="hidden sm:inline">{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Channel View */}
      <div className="py-2">
        {activeChannel === 'whatsapp' && <WhatsAppChat />}
        {activeChannel === 'instagram' && <InstagramChat />}
        {activeChannel === 'website_widget' && <WebsiteWidgetChat />}
        {activeChannel === 'direct_portal' && <DirectPortalChat />}
      </div>
    </div>
  );
};
