import React from 'react';
import {
  Cpu,
  HardDrive,
  Network,
  KeyRound,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';

export interface FlashcardData {
  id: string;
  domain: string;
  subtopic: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export type ExamDomain =
  | 'Compute'
  | 'Storage'
  | 'Networking'
  | 'Identity'
  | 'Security'
  | 'Governance';

export interface DomainMeta {
  domain: ExamDomain;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  highlighterClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  bulletBg: string;
  accentHex: string;
}

// Color-coded pastel highlight headers mapped dynamically to exam domains
export const DOMAIN_CONFIGS: Record<ExamDomain, DomainMeta> = {
  Compute: {
    domain: 'Compute',
    name: 'Compute Services',
    icon: Cpu,
    highlighterClass: 'highlighter-compute',
    borderClass: 'border-sky-300',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    bulletBg: 'bg-sky-500',
    accentHex: '#0284c7',
  },
  Storage: {
    domain: 'Storage',
    name: 'Storage & Database Services',
    icon: HardDrive,
    highlighterClass: 'highlighter-storage',
    borderClass: 'border-amber-300',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    bulletBg: 'bg-amber-500',
    accentHex: '#d97706',
  },
  Networking: {
    domain: 'Networking',
    name: 'Networking Services',
    icon: Network,
    highlighterClass: 'highlighter-networking',
    borderClass: 'border-emerald-300',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    bulletBg: 'bg-emerald-600',
    accentHex: '#059669',
  },
  Identity: {
    domain: 'Identity',
    name: 'Identity & Access (IAM)',
    icon: KeyRound,
    highlighterClass: 'highlighter-identity',
    borderClass: 'border-purple-300',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    bulletBg: 'bg-purple-600',
    accentHex: '#7c3aed',
  },
  Security: {
    domain: 'Security',
    name: 'Security Services',
    icon: ShieldAlert,
    highlighterClass: 'highlighter-security',
    borderClass: 'border-rose-300',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    bulletBg: 'bg-rose-500',
    accentHex: '#e11d48',
  },
  Governance: {
    domain: 'Governance',
    name: 'Governance & Monitoring',
    icon: FileCheck2,
    highlighterClass: 'highlighter-governance',
    borderClass: 'border-orange-300',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-900',
    bulletBg: 'bg-orange-500',
    accentHex: '#ea580c',
  },
};

/**
 * Dynamically resolves each flashcard to one of the 6 core exam domains
 */
export function resolveExamDomain(card: {
  domain?: string;
  subtopic?: string;
  tags?: string[];
}): ExamDomain {
  const text = `${card.subtopic || ''} ${card.domain || ''} ${(card.tags || []).join(' ')}`.toLowerCase();

  if (
    text.includes('compute') ||
    text.includes('app service') ||
    text.includes('function') ||
    text.includes('virtual machine') ||
    text.includes('container') ||
    text.includes('aci')
  ) {
    return 'Compute';
  }
  if (
    text.includes('storage') ||
    text.includes('blob') ||
    text.includes('cosmos') ||
    text.includes('database') ||
    text.includes('synapse') ||
    text.includes('sql')
  ) {
    return 'Storage';
  }
  if (
    text.includes('networking') ||
    text.includes('network') ||
    text.includes('vnet') ||
    text.includes('expressroute') ||
    text.includes('load balancer') ||
    text.includes('gateway')
  ) {
    return 'Networking';
  }
  if (
    text.includes('identity') ||
    text.includes('iam') ||
    text.includes('entra') ||
    text.includes('rbac') ||
    text.includes('pim') ||
    text.includes('sso') ||
    text.includes('mfa')
  ) {
    return 'Identity';
  }
  if (
    text.includes('sentinel') ||
    text.includes('key vault') ||
    text.includes('threat') ||
    text.includes('siem') ||
    (text.includes('security') && !text.includes('governance'))
  ) {
    return 'Security';
  }
  if (
    text.includes('governance') ||
    text.includes('policy') ||
    text.includes('advisor') ||
    text.includes('activity log') ||
    text.includes('devops') ||
    text.includes('management') ||
    text.includes('pipeline')
  ) {
    return 'Governance';
  }
  return 'Governance';
}

/**
 * Splits an answer string into clean, readable study bullet points for the back of the card
 */
export function formatAnswerBullets(answer: string): string[] {
  if (!answer) return [];

  // Check for lists formatted with parentheses e.g. "Azure Boards (...), Azure Repos (...)"
  if (answer.includes('),') || answer.includes(');')) {
    const rawItems = answer.split(/\),\s*/);
    return rawItems
      .map((item, idx) => (idx < rawItems.length - 1 && !item.endsWith(')') ? `${item})` : item))
      .map((item) => item.replace(/^(and\s+)/i, '').trim())
      .filter(Boolean);
  }

  // Check for semicolon delimited items
  if (answer.includes(';')) {
    return answer
      .split(';')
      .map((item) => item.trim().replace(/^\w+:\s*/, ''))
      .filter(Boolean);
  }

  // Check for contrast sentences with "while" or "whereas"
  if (answer.includes(', while ') || answer.includes(', whereas ')) {
    const splitWord = answer.includes(', while ') ? ', while ' : ', whereas ';
    const parts = answer.split(splitWord);
    return [parts[0].trim(), parts[1].trim()].filter(Boolean);
  }

  // Check for multi-sentence answers
  const sentences = answer
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length > 1) {
    return sentences;
  }

  // Single sentence with comma-separated list of items
  if (answer.includes(', and ') || (answer.match(/,/g) || []).length >= 2) {
    const clauses = answer.split(/,\s*(?:and\s+)?/);
    if (clauses.length >= 2 && clauses.length <= 4) {
      return clauses.map((c) => c.trim()).filter(Boolean);
    }
  }

  return [answer];
}
