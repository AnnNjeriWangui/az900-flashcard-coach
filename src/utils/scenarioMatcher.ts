// scenarioMatcher.ts

export interface ScenarioItem {
  id: string;
  category: string;
  scenario: string;
  correctService: string;
  options: string[];
  explanation: string;
}

export interface ScenarioCheckResult {
  isCorrect: boolean;
  correctService: string;
  explanation: string;
}

export const SCENARIO_BANK: ScenarioItem[] = [
  {
    id: 'sc-1',
    category: 'Storage Architecture',
    scenario: 'Your media company needs massive unstructured storage with high throughput to stream 4K video files globally.',
    correctService: 'Azure Blob Storage',
    options: ['Azure Blob Storage', 'Azure Files', 'Azure Disk Storage', 'Azure Cosmos DB'],
    explanation: 'Azure Blob Storage is optimized for storing massive amounts of unstructured data like video streams, audio, and documents.'
  },
  {
    id: 'sc-2',
    category: 'Databases & Global Scale',
    scenario: 'A retail web app requires a globally distributed, low-latency multi-model database for dynamic shopping carts and product catalogs.',
    correctService: 'Azure Cosmos DB',
    options: ['Azure SQL Database', 'Azure Cosmos DB', 'Azure Database for PostgreSQL', 'Azure Blob Storage'],
    explanation: 'Azure Cosmos DB provides turnkey global distribution with single-digit millisecond latency for multi-model NoSQL and relational data.'
  },
  {
    id: 'sc-3',
    category: 'Identity & Access Management',
    scenario: 'Administrators require Just-in-Time (JIT) privileged access to manage critical subscription settings without persistent admin privileges.',
    correctService: 'Microsoft Entra Privileged Identity Management (PIM)',
    options: ['Microsoft Entra ID Protection', 'Microsoft Entra Privileged Identity Management (PIM)', 'Azure Key Vault', 'Role-Based Access Control (RBAC)'],
    explanation: 'Microsoft Entra PIM provides time-bound and approval-based role activation to mitigate risk of persistent access.'
  },
  {
    id: 'sc-4',
    category: 'Hybrid Networking',
    scenario: 'A financial enterprise needs private, dedicated network connectivity directly into Azure datacenters that bypasses the public internet completely.',
    correctService: 'Azure ExpressRoute',
    options: ['Azure VPN Gateway', 'Azure ExpressRoute', 'Network Security Group (NSG)', 'Azure Front Door'],
    explanation: 'Azure ExpressRoute provides dedicated, private fiber connections to Azure without traversing the public internet.'
  },
  {
    id: 'sc-5',
    category: 'Governance & Compliance',
    scenario: 'The security team must enforce an organization-wide rule preventing virtual machines from ever being deployed outside of European regions.',
    correctService: 'Azure Policy',
    options: ['Azure Policy', 'Role-Based Access Control (RBAC)', 'Microsoft Defender for Cloud', 'Azure Blueprints'],
    explanation: 'Azure Policy enforces governance guardrails and compliance rules across all resource deployments regardless of user roles.'
  },
  {
    id: 'sc-6',
    category: 'Monitoring & Telemetry',
    scenario: 'An IT operations team needs to collect, correlate, and analyze log and performance telemetry from 500 virtual machines and web apps using KQL queries.',
    correctService: 'Azure Monitor & Log Analytics',
    options: ['Azure Monitor & Log Analytics', 'Azure Advisor', 'Azure Service Health', 'Azure Cost Management'],
    explanation: 'Azure Monitor collects comprehensive telemetry and Log Analytics provides KQL querying across all enterprise resources.'
  },
  {
    id: 'sc-7',
    category: 'Compute & Microservices',
    scenario: 'A development team needs to deploy lightweight Docker containers instantly on demand without managing Kubernetes nodes or underlying virtual machines.',
    correctService: 'Azure Container Instances (ACI)',
    options: ['Azure Kubernetes Service (AKS)', 'Azure Container Instances (ACI)', 'Azure Virtual Machines', 'Azure Batch'],
    explanation: 'Azure Container Instances (ACI) lets you run Docker containers directly in serverless fashion with per-second billing and zero cluster overhead.'
  },
  {
    id: 'sc-8',
    category: 'Secrets & Cryptography',
    scenario: 'An engineering team needs a centralized, HSM-backed cloud repository to securely store database passwords, TLS certificates, and cryptographic keys.',
    correctService: 'Azure Key Vault',
    options: ['Azure Key Vault', 'Azure App Configuration', 'Azure Dedicated Host', 'Azure Confidential Ledger'],
    explanation: 'Azure Key Vault centralizes application secrets, keys, and certificates with strict RBAC and access policies.'
  }
];

export function checkScenarioAnswer(scenarioId: string, selectedOption: string): ScenarioCheckResult | null {
  const item = SCENARIO_BANK.find((s) => s.id === scenarioId);
  if (!item) return null;

  const isCorrect = item.correctService === selectedOption;
  return {
    isCorrect,
    correctService: item.correctService,
    explanation: item.explanation
  };
}
