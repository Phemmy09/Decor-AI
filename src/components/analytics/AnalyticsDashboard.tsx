import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { DECOR_THEMES } from '../../data/decorThemes';
import { formatCurrency } from '../../utils/pricingEngine';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Crown, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  PieChart, 
  Flame,
  MessageSquare,
  Globe
} from 'lucide-react';
import { InstagramIcon } from '../common/Icons';

export const AnalyticsDashboard: React.FC = () => {
  const { leads, businessConfig } = useLeads();
  const sym = businessConfig.currencySymbol;

  // Revenue Metrics
  const totalPipelineRevenue = leads.reduce((sum, l) => {
    return sum + (l.calculatedQuote?.totalEstimatedValue || l.budgetExpectation || 0);
  }, 0);

  const bookedLeads = leads.filter(l => l.stage === 'booked_deposit');
  const bookedRevenue = bookedLeads.reduce((sum, l) => {
    return sum + (l.calculatedQuote?.totalEstimatedValue || l.budgetExpectation || 0);
  }, 0);

  const vipLeads = leads.filter(l => l.isHighValueAlert || (l.calculatedQuote?.totalEstimatedValue || 0) >= businessConfig.highValueThreshold);
  const avgDealSize = leads.length > 0 ? Math.round(totalPipelineRevenue / leads.length) : 0;
  const winRate = leads.length > 0 ? Math.round((bookedLeads.length / leads.length) * 100) : 0;

  // Theme Popularity Breakdown
  const themeCounts: { [id: string]: { count: number; value: number } } = {};
  leads.forEach(l => {
    const tId = l.themeId || 'luxury_royal_floral';
    const val = l.calculatedQuote?.totalEstimatedValue || l.budgetExpectation || 0;
    if (!themeCounts[tId]) {
      themeCounts[tId] = { count: 0, value: 0 };
    }
    themeCounts[tId].count += 1;
    themeCounts[tId].value += val;
  });

  // Channel Breakdown
  const channelCounts = {
    whatsapp: leads.filter(l => l.channel === 'whatsapp').length,
    instagram: leads.filter(l => l.channel === 'instagram').length,
    website_widget: leads.filter(l => l.channel === 'website_widget').length,
    direct_portal: leads.filter(l => l.channel === 'direct_portal').length,
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gold-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-serif">
            {formatCurrency(totalPipelineRevenue, sym)}
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Across {leads.length} active event leads
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booked Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-serif">
            {formatCurrency(bookedRevenue, sym)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {bookedLeads.length} events confirmed & deposit paid
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">🔥 High-Value VIP Leads</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-serif">
            {vipLeads.length} Deals
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block font-medium">
            Deals &gt; {formatCurrency(businessConfig.highValueThreshold, sym)}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Deal Size & Win Rate</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-serif">
            {formatCurrency(avgDealSize, sym)}
          </div>
          <span className="text-[11px] text-cyan-400 mt-1 block font-medium">
            {winRate}% Conversion Velocity
          </span>
        </div>
      </div>

      {/* Grid: Theme Breakdown + Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Popularity List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold-400" />
              Most Requested Decor Themes & Revenue
            </h3>
            <span className="text-xs text-slate-400">Ranked by Demand</span>
          </div>

          <div className="space-y-3">
            {DECOR_THEMES.map((theme) => {
              const data = themeCounts[theme.id] || { count: 0, value: 0 };
              const percentage = leads.length > 0 ? Math.round((data.count / leads.length) * 100) : 0;

              return (
                <div key={theme.id} className="p-3 rounded-xl bg-obsidian-850 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-slate-700">
                        <img src={theme.bgImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-200">{theme.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gold-400 font-serif">
                        {formatCurrency(data.value, sym)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        ({data.count} {data.count === 1 ? 'lead' : 'leads'})
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Messaging Channel Share & 24/7 AI Automation Stats */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Inflow by Channel
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">WhatsApp Business</span>
                </div>
                <span className="font-bold text-white">{channelCounts.whatsapp} leads</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span className="text-slate-300 font-medium">Instagram Direct</span>
                </div>
                <span className="font-bold text-white">{channelCounts.instagram} leads</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gold-400" />
                  <span className="text-slate-300 font-medium">Website Live Widget</span>
                </div>
                <span className="font-bold text-white">{channelCounts.website_widget} leads</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 font-medium">Direct Portal</span>
                </div>
                <span className="font-bold text-white">{channelCounts.direct_portal} leads</span>
              </div>
            </div>
          </div>

          {/* 24/7 Autonomous Sales Impact Box */}
          <div className="glass-card-gold p-5 rounded-2xl border border-gold-500/40 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h4 className="text-xs font-bold text-gold-300 uppercase tracking-wider">
                24/7 Automated Sales Engine
              </h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Your AI Concierge operates around the clock across WhatsApp, Instagram, and web chat — calculating instant quotes and qualifying high-ticket clients while you sleep.
            </p>
            <div className="pt-2 border-t border-gold-500/20 flex items-center justify-between text-[11px] text-gold-200">
              <span>Avg. Response Time: <strong>&lt; 2 seconds</strong></span>
              <span>Zero Missed Leads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
