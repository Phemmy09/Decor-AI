import { BusinessConfig, CalculatedQuote, LeadScoreDetails } from '../types';

export function calculateLeadScore(
  quote: CalculatedQuote | undefined,
  config: BusinessConfig,
  guestCount: number,
  eventDate: string,
  selectedAddOns: string[]
): LeadScoreDetails {
  const reasons: string[] = [];
  let budgetScore = 20;
  let guestCountScore = 15;
  let urgencyScore = 15;
  let addOnScore = 10;

  const quoteTotal = quote ? quote.totalEstimatedValue : 0;

  // 1. Budget Evaluation
  if (quoteTotal >= config.highValueThreshold * 1.5) {
    budgetScore = 40;
    reasons.push(`High Quote Value (${config.currencySymbol}${quoteTotal.toLocaleString()}) exceeding tier threshold`);
  } else if (quoteTotal >= config.highValueThreshold) {
    budgetScore = 30;
    reasons.push(`Meets High-Value Qualification Standard (${config.currencySymbol}${quoteTotal.toLocaleString()})`);
  } else if (quoteTotal >= 1500) {
    budgetScore = 20;
  }

  // 2. Guest Count
  if (guestCount >= 180) {
    guestCountScore = 25;
    reasons.push(`Large Scale Event with ${guestCount} attendees`);
  } else if (guestCount >= 100) {
    guestCountScore = 18;
    reasons.push(`Grand scale guest list (${guestCount} guests)`);
  } else {
    guestCountScore = 10;
  }

  // 3. Add-on selection
  if (selectedAddOns.length >= 3) {
    addOnScore = 20;
    reasons.push(`Selected ${selectedAddOns.length} luxury add-ons`);
  } else if (selectedAddOns.length >= 1) {
    addOnScore = 14;
  }

  // 4. Urgency evaluation (if within next 45 days)
  try {
    const targetDate = new Date(eventDate);
    if (!isNaN(targetDate.getTime())) {
      const diffDays = (targetDate.getTime() - Date.now()) / (1000 * 3600 * 24);
      if (diffDays > 0 && diffDays <= 45) {
        urgencyScore = 20;
        reasons.push('High booking urgency (event within 45 days)');
      }
    }
  } catch (e) {
    // ignore
  }

  const totalScore = Math.min(100, budgetScore + guestCountScore + urgencyScore + addOnScore);
  const isHighValue = totalScore >= 75 || quoteTotal >= config.highValueThreshold;

  return {
    totalScore,
    isHighValue,
    budgetScore,
    guestCountScore,
    urgencyScore,
    addOnScore,
    reasons: reasons.length > 0 ? reasons : ['Standard inquiry profile captured'],
  };
}
