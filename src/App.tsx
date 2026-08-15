import React, { useState } from 'react';
import { useLeads } from './context/LeadContext';
import { Lead } from './types';
import { Navbar } from './components/layout/Navbar';
import { PriorityAlertBanner } from './components/notifications/PriorityAlertBanner';
import { ChannelSimulator } from './components/chat/ChannelSimulator';
import { PipelineKanban } from './components/pipeline/PipelineKanban';
import { PipelineTableView } from './components/pipeline/PipelineTableView';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { LeadDetailModal } from './components/pipeline/LeadDetailModal';
import { ProposalInvoiceModal } from './components/common/ProposalInvoiceModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { Sparkles, Shield, Cloud, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, activeLead, setActiveLead, activeProposalQuote, setActiveProposalQuote } = useLeads();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedLeadForProposal, setSelectedLeadForProposal] = useState<Lead | null>(null);

  const handleOpenLeadDetails = (lead: Lead) => {
    setActiveLead(lead);
  };

  const handleOpenProposal = (lead: Lead) => {
    setSelectedLeadForProposal(lead);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNewLead={() => {}}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Floating Priority Alert Banner for High-Value Leads */}
        <PriorityAlertBanner onOpenDetails={handleOpenLeadDetails} />

        {/* Dynamic Views */}
        {activeTab === 'simulator' && <ChannelSimulator />}
        {activeTab === 'pipeline' && <PipelineKanban onOpenDetails={handleOpenLeadDetails} />}
        {activeTab === 'table' && <PipelineTableView onOpenDetails={handleOpenLeadDetails} />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Lead Detail Modal / Slide-over */}
      {activeLead && (
        <LeadDetailModal
          lead={activeLead}
          onClose={() => setActiveLead(null)}
          onOpenProposal={handleOpenProposal}
        />
      )}

      {/* Official Proposal / Invoice Document Modal */}
      {(selectedLeadForProposal || activeProposalQuote) && (
        <ProposalInvoiceModal
          data={activeProposalQuote ? activeProposalQuote : selectedLeadForProposal ? { lead: selectedLeadForProposal } : null}
          onClose={() => {
            setSelectedLeadForProposal(null);
            setActiveProposalQuote(null);
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-obsidian-950 py-6 mt-12 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-slate-300">DecorAI</span>
            <span>•</span>
            <span>24/7 AI Event Decor Lead Intake & Sales Pipeline OS</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Cloud className="w-3.5 h-3.5 text-amber-500" /> Cloudflare Pages Ready
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3.5 h-3.5" /> High-Value Auto-Qualification
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
