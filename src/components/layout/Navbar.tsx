import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { 
  Sparkles, 
  Layers, 
  Table, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Flame, 
  Bell, 
  PlusCircle 
} from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenNewLead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenNewLead }) => {
  const { activeTab, setActiveTab, unacknowledgedVipLeads, businessConfig, leads } = useLeads();

  const totalVipCount = unacknowledgedVipLeads.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-obsidian-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & 24/7 Pulse Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-amber-400 to-gold-300 p-0.5 shadow-gold-sm flex items-center justify-center">
            <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white font-serif tracking-tight">
                Decor<span className="text-gold-400">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                24/7 Autonomous
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {businessConfig.companyName} • AI Sales Pipeline OS
            </p>
          </div>
        </div>

        {/* Center Main Nav Tabs */}
        <nav className="flex items-center space-x-1 bg-obsidian-900/90 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'simulator'
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Intake Simulator</span>
            <span className="md:hidden">Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pipeline'
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sales Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lead Directory</span>
            <span className="md:hidden">Table</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Right Action Icons & VIP Badge */}
        <div className="flex items-center space-x-2.5">
          {totalVipCount > 0 && (
            <button
              onClick={() => setActiveTab('pipeline')}
              className="relative p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title={`${totalVipCount} High-Value VIP Lead(s) Ready to Close`}
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="hidden sm:inline">{totalVipCount} VIP</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors"
            title="Configure Business & AI Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
