import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { playHighValueAlertSound } from '../../utils/audioAlerts';
import { 
  X, 
  Settings, 
  Sparkles, 
  DollarSign, 
  Volume2, 
  Bell, 
  Key, 
  Webhook, 
  RotateCcw, 
  CheckCircle2,
  Building,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { businessConfig, updateBusinessConfig, resetToMockData } = useLeads();
  const [formData, setFormData] = useState({ ...businessConfig });
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestAudio = () => {
    playHighValueAlertSound();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-2xl border border-gold-500/30 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-obsidian-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">DecorAI Pipeline & Agent Configuration</h3>
              <p className="text-xs text-slate-400">Manage business branding, pricing formulas, and AI intake rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Section 1: Business Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" /> Business Profile & Branding
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Business / Brand Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Lead Stylist / Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Business Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing Engine Base Rates */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Pricing Engine Calibration ({formData.currencySymbol})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Wedding Base ($)</label>
                <input
                  type="number"
                  value={formData.basePrices.Wedding}
                  onChange={(e) => setFormData({
                    ...formData,
                    basePrices: { ...formData.basePrices, Wedding: Number(e.target.value) }
                  })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Gala Base ($)</label>
                <input
                  type="number"
                  value={formData.basePrices['Luxury Gala']}
                  onChange={(e) => setFormData({
                    ...formData,
                    basePrices: { ...formData.basePrices, 'Luxury Gala': Number(e.target.value) }
                  })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Birthday Base ($)</label>
                <input
                  type="number"
                  value={formData.basePrices['Birthday Celebration']}
                  onChange={(e) => setFormData({
                    ...formData,
                    basePrices: { ...formData.basePrices, 'Birthday Celebration': Number(e.target.value) }
                  })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Cost / Guest ($)</label>
                <input
                  type="number"
                  value={formData.costPerGuest}
                  onChange={(e) => setFormData({ ...formData, costPerGuest: Number(e.target.value) })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: High-Value VIP Alerts & Sound */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> High-Value VIP Lead Trigger & Audio Notifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  High-Value Threshold ({formData.currencySymbol})
                </label>
                <input
                  type="number"
                  step="250"
                  value={formData.highValueThreshold}
                  onChange={(e) => setFormData({ ...formData, highValueThreshold: Number(e.target.value) })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Quotes at or above this threshold trigger priority closing alerts.
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableAudioAlerts}
                    onChange={(e) => setFormData({ ...formData, enableAudioAlerts: e.target.checked })}
                    className="rounded bg-obsidian-800 border-slate-700 text-gold-500 focus:ring-0"
                  />
                  <span className="text-slate-200 font-semibold">Enable Synthesizer Chime on VIP Lead</span>
                </label>

                <button
                  type="button"
                  onClick={handleTestAudio}
                  className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 border border-slate-700 text-slate-300 text-[11px] flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-gold-400" /> Test Chime Sound
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: AI Concierge Persona & Integrations */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Stylist Persona & Webhook Dispatch
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">AI Stylist Name</label>
                <input
                  type="text"
                  value={formData.aiPersonaName}
                  onChange={(e) => setFormData({ ...formData, aiPersonaName: e.target.value })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Cloudflare / Zapier Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://api.cloudflare.com/webhook/decor-leads"
                  value={formData.webhookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  className="w-full bg-obsidian-850 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={resetToMockData}
              className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-slate-700 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Seed Demo Leads
            </button>

            <div className="flex items-center space-x-2">
              {savedSuccess && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Settings Saved!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs shadow-gold-sm transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
