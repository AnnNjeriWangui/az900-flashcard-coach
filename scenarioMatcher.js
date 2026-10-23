// scenarioMatcher.js

export const SCENARIO_BANK = [
  {
    id: 'sc-1',
    scenario: 'Your company needs unstructured storage with high throughput to stream 4K video files globally.',
    correctService: 'Azure Blob Storage',
    options: ['Azure Blob Storage', 'Azure Files', 'Azure Disk Storage', 'Azure Cosmos DB'],
    explanation: 'Azure Blob Storage is optimized for storing massive amounts of unstructured data like video streams, audio, and documents.'
  },
  {
    id: 'sc-2',
    scenario: 'A retail web app requires a globally distributed, low-latency multi-model database for dynamic shopping carts.',
    correctService: 'Azure Cosmos DB',
    options: ['Azure SQL Database', 'Azure Cosmos DB', 'Azure Database for PostgreSQL', 'Azure Blob Storage'],
    explanation: 'Azure Cosmos DB provides turnkey global distribution with single-digit millisecond latency for multi-model data.'
  },
  {
    id: 'sc-3',
    scenario: 'Administrators require Just-in-Time (JIT) privileged access to manage critical subscription settings.',
    correctService: 'Microsoft Entra Privileged Identity Management (PIM)',
    options: ['Microsoft Entra ID Protection', 'Microsoft Entra Privileged Identity Management (PIM)', 'Azure Key Vault', 'Role-Based Access Control (RBAC)'],
    explanation: 'Microsoft Entra PIM provides time-bound and approval-based role activation to mitigate risk of persistent access.'
  },
  {
    id: 'sc-4',
    scenario: 'A financial enterprise needs private, dedicated network connectivity directly into Azure that bypasses the public internet completely.',
    correctService: 'Azure ExpressRoute',
    options: ['Azure VPN Gateway', 'Azure ExpressRoute', 'Network Security Group (NSG)', 'Azure Front Door'],
    explanation: 'Azure ExpressRoute provides dedicated, private fiber connections to Azure without traversing the public internet.'
  },
  {
    id: 'sc-5',
    scenario: 'The security team must enforce a policy preventing virtual machines from ever being deployed outside of European regions.',
    correctService: 'Azure Policy',
    options: ['Azure Policy', 'Role-Based Access Control (RBAC)', 'Microsoft Defender for Cloud', 'Azure Blueprints'],
    explanation: 'Azure Policy enforces governance guardrails and compliance rules across all resource deployments regardless of user roles.'
  },
  {
    id: 'sc-6',
    scenario: 'An IT operations team needs to collect, correlate, and analyze log and performance telemetry from 500 virtual machines and web apps.',
    correctService: 'Azure Monitor & Log Analytics',
    options: ['Azure Monitor & Log Analytics', 'Azure Advisor', 'Azure Service Health', 'Azure Cost Management'],
    explanation: 'Azure Monitor collects comprehensive telemetry and Log Analytics provides KQL querying across all enterprise resources.'
  }
];

export function checkScenarioAnswer(scenarioId, selectedOption) {
  const item = SCENARIO_BANK.find((s) => s.id === scenarioId);
  if (!item) return null;

  const isCorrect = item.correctService === selectedOption;
  return {
    isCorrect,
    correctService: item.correctService,
    explanation: item.explanation
  };
}
