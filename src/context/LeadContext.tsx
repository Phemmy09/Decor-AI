import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessConfig, CalculatedQuote, Lead, MessagingChannel, PipelineStage } from '../types';
import { INITIAL_MOCK_LEADS } from '../data/mockLeads';
import { DEFAULT_BUSINESS_CONFIG } from '../utils/pricingEngine';
import { playHighValueAlertSound } from '../utils/audioAlerts';
import { calculateLeadScore } from '../utils/leadScorer';

interface LeadContextType {
  leads: Lead[];
  activeLead: Lead | null;
  setActiveLead: (lead: Lead | null) => void;
  activeTab: 'simulator' | 'pipeline' | 'table' | 'analytics' | 'settings';
  setActiveTab: (tab: 'simulator' | 'pipeline' | 'table' | 'analytics' | 'settings') => void;
  activeChannel: MessagingChannel;
  setActiveChannel: (channel: MessagingChannel) => void;
  businessConfig: BusinessConfig;
  updateBusinessConfig: (config: Partial<BusinessConfig>) => void;
  updateLeadStage: (leadId: string, stage: PipelineStage) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;
  addNewLeadFromIntake: (intakeData: Partial<Lead>, quote?: CalculatedQuote) => Lead;
  unacknowledgedVipLeads: Lead[];
  acknowledgeVipAlert: (leadId: string) => void;
  dismissAllVipAlerts: () => void;
  activeProposalQuote: { lead: Lead; quote: CalculatedQuote } | null;
  setActiveProposalQuote: (item: { lead: Lead; quote: CalculatedQuote } | null) => void;
  resetToMockData: () => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

const LEADS_STORAGE_KEY = 'decor_ai_leads_v1';
const CONFIG_STORAGE_KEY = 'decor_ai_config_v1';

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(LEADS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load leads from localStorage:', e);
    }
    return INITIAL_MOCK_LEADS;
  });

  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) return { ...DEFAULT_BUSINESS_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to load config from localStorage:', e);
    }
    return DEFAULT_BUSINESS_CONFIG;
  });

  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'simulator' | 'pipeline' | 'table' | 'analytics' | 'settings'>('pipeline');
  const [activeChannel, setActiveChannel] = useState<MessagingChannel>('whatsapp');
  const [activeProposalQuote, setActiveProposalQuote] = useState<{ lead: Lead; quote: CalculatedQuote } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads to localStorage:', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(businessConfig));
    } catch (e) {
      console.error('Failed to save config to localStorage:', e);
    }
  }, [businessConfig]);

  const unacknowledgedVipLeads = leads.filter(l => l.isHighValueAlert && !l.alertAcknowledged);

  const updateBusinessConfig = (newCfg: Partial<BusinessConfig>) => {
    setBusinessConfig(prev => ({ ...prev, ...newCfg }));
  };

  const updateLeadStage = (leadId: string, stage: PipelineStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          stage,
          lastActivityAt: new Date().toISOString()
        };
      }
      return lead;
    }));

    if (activeLead && activeLead.id === leadId) {
      setActiveLead(prev => prev ? { ...prev, stage, lastActivityAt: new Date().toISOString() } : null);
    }
  };

  const updateLead = (updated: Lead) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    if (activeLead && activeLead.id === updated.id) {
      setActiveLead(updated);
    }
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (activeLead && activeLead.id === leadId) {
      setActiveLead(null);
    }
  };

  const acknowledgeVipAlert = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, alertAcknowledged: true } : l));
  };

  const dismissAllVipAlerts = () => {
    setLeads(prev => prev.map(l => ({ ...l, alertAcknowledged: true })));
  };

  const addNewLeadFromIntake = (intakeData: Partial<Lead>, quote?: CalculatedQuote): Lead => {
    const guestCount = intakeData.guestCount || (quote ? quote.guestCount : 80);
    const eventDate = intakeData.eventDate || (quote ? quote.eventDate : 'Upcoming Date');
    const selectedAddOns = intakeData.selectedAddOns || (quote ? quote.selectedAddOns : []);
    
    const scoreDetails = calculateLeadScore(
      quote,
      businessConfig,
      guestCount,
      eventDate,
      selectedAddOns
    );

    const isHighValue = scoreDetails.isHighValue;
    const stage: PipelineStage = isHighValue ? 'high_value_vip' : (quote ? 'quote_sent' : 'new_inquiry');

    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientName: intakeData.clientName || 'Inquiring Client',
      clientHandle: intakeData.clientHandle || `@client_${Math.floor(100 + Math.random() * 900)}`,
      channel: intakeData.channel || activeChannel,
      contact: {
        phone: intakeData.contact?.phone || '+1 (555) 000-0000',
        email: intakeData.contact?.email || 'client@example.com',
        location: intakeData.contact?.location || 'Local Area',
      },
      eventType: intakeData.eventType || (quote ? quote.eventType : 'Wedding'),
      eventDate,
      guestCount,
      venueType: intakeData.venueType || (quote ? quote.venueType : 'Event Space'),
      themeId: intakeData.themeId || (quote ? quote.themeId : 'luxury_royal_floral'),
      themeName: intakeData.themeName || (quote ? quote.themeName : 'Luxury Royal Floral'),
      selectedAddOns,
      budgetExpectation: intakeData.budgetExpectation || (quote ? quote.totalEstimatedValue : 3000),
      calculatedQuote: quote,
      stage,
      scoreDetails,
      isHighValueAlert: isHighValue,
      alertAcknowledged: false,
      messages: intakeData.messages || [],
      internalNotes: `Auto-qualified by ${businessConfig.aiPersonaName} via ${intakeData.channel || activeChannel}. Est. Quote: ${businessConfig.currencySymbol}${quote?.totalEstimatedValue || 0}`,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      assignedTo: isHighValue ? `${businessConfig.ownerName} (VIP Priority)` : `${businessConfig.aiPersonaName} Automated`,
      tags: isHighValue ? ['🔥 High-Value VIP', 'Auto-Captured', 'Needs Closing'] : ['Auto-Captured', 'New Prospect']
    };

    setLeads(prev => [newLead, ...prev]);

    // Play high value audio alert if enabled
    if (isHighValue && businessConfig.enableAudioAlerts) {
      playHighValueAlertSound();
    }

    return newLead;
  };

  const resetToMockData = () => {
    setLeads(INITIAL_MOCK_LEADS);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LEADS));
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        activeLead,
        setActiveLead,
        activeTab,
        setActiveTab,
        activeChannel,
        setActiveChannel,
        businessConfig,
        updateBusinessConfig,
        updateLeadStage,
        updateLead,
        deleteLead,
        addNewLeadFromIntake,
        unacknowledgedVipLeads,
        acknowledgeVipAlert,
        dismissAllVipAlerts,
        activeProposalQuote,
        setActiveProposalQuote,
        resetToMockData,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
