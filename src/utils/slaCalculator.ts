// slaCalculator.ts

export interface SLAResult {
  compositeSLA: number;
  downtimePerYear: string;
  downtimeMinutesPerYear: number;
  downtimeHoursPerYear: number;
  downtimePerMonth: string;
}

export interface ArchitecturePreset {
  name: string;
  description: string;
  services: { name: string; sla: number }[];
}

export const ARCHITECTURE_PRESETS: ArchitecturePreset[] = [
  {
    name: 'Basic Web Application',
    description: 'Azure App Service (PaaS) connected to Azure SQL Database.',
    services: [
      { name: 'Azure App Service', sla: 99.95 },
      { name: 'Azure SQL Database', sla: 99.99 },
    ],
  },
  {
    name: 'Three-Tier Cloud Store',
    description: 'Front Door + App Service + Cosmos DB + Azure Blob Storage.',
    services: [
      { name: 'Azure Front Door', sla: 99.99 },
      { name: 'Azure App Service', sla: 99.95 },
      { name: 'Azure Cosmos DB (Multi-region)', sla: 99.999 },
      { name: 'Azure Blob Storage (Hot GRS)', sla: 99.9 },
    ],
  },
  {
    name: 'Containerized Microservices on AKS',
    description: 'Application Gateway + Azure Kubernetes Service + Azure SQL Database.',
    services: [
      { name: 'Application Gateway', sla: 99.95 },
      { name: 'Azure Kubernetes Service (Uptime SLA)', sla: 99.95 },
      { name: 'Azure SQL Database (Business Critical)', sla: 99.995 },
    ],
  },
];

/**
 * Calculates Composite SLA for services chained in series (e.g., SLA_1 * SLA_2).
 * @param slaPercentages - e.g. [99.9, 99.99]
 */
export function calculateCompositeSLA(slaPercentages: number[]): SLAResult {
  if (slaPercentages.length === 0) {
    return {
      compositeSLA: 100,
      downtimePerYear: '0 mins/year',
      downtimeMinutesPerYear: 0,
      downtimeHoursPerYear: 0,
      downtimePerMonth: '0 mins/month',
    };
  }

  const compositeDecimal = slaPercentages.reduce((acc, sla) => acc * (sla / 100), 1);
  const compositePercent = (compositeDecimal * 100).toFixed(4);

  // Annual downtime calculation (365 days * 24 hours * 60 mins = 525,600 minutes)
  const totalMinutesInYear = 525600;
  const downtimeMinutes = (1 - compositeDecimal) * totalMinutesInYear;
  const downtimeHours = downtimeMinutes / 60;
  const downtimeMinutesPerMonth = downtimeMinutes / 12;

  let downtimeFormatted = `${downtimeMinutes.toFixed(2)} mins/year`;
  if (downtimeMinutes > 60) {
    downtimeFormatted = `${downtimeHours.toFixed(2)} hours/year`;
  }

  let monthlyFormatted = `${downtimeMinutesPerMonth.toFixed(2)} mins/month`;
  if (downtimeMinutesPerMonth > 60) {
    monthlyFormatted = `${(downtimeMinutesPerMonth / 60).toFixed(2)} hours/month`;
  }

  return {
    compositeSLA: parseFloat(compositePercent),
    downtimePerYear: downtimeFormatted,
    downtimeMinutesPerYear: parseFloat(downtimeMinutes.toFixed(2)),
    downtimeHoursPerYear: parseFloat(downtimeHours.toFixed(2)),
    downtimePerMonth: monthlyFormatted,
  };
}

export interface CostModelConcept {
  type: 'CapEx' | 'OpEx';
  title: string;
  description: string;
  examples: string[];
  azureRelevance: string;
}

export const CAPEX_VS_OPEX: CostModelConcept[] = [
  {
    type: 'CapEx',
    title: 'Capital Expenditure (CapEx)',
    description: 'Up-front spending on physical infrastructure and assets that are capitalized on balance sheets over time.',
    examples: ['Purchasing physical server racks', 'Building datacenter real estate', 'Cooling & backup generators'],
    azureRelevance: 'Traditional on-premises approach. Involves high upfront costs, long procurement cycles, and risk of idle hardware capacity.'
  },
  {
    type: 'OpEx',
    title: 'Operational Expenditure (OpEx)',
    description: 'Spending on ongoing services and operational subscriptions on an as-needed, pay-as-you-go consumption model.',
    examples: ['Monthly cloud subscriptions', 'Per-second VM execution billing', 'Pay-per-GB storage fees'],
    azureRelevance: 'Core cloud economics model. Zero upfront equipment investment, immediate provisioning, and full elasticity.'
  }
];
