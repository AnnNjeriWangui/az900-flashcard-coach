// cramSheet.ts

export interface CramTerm {
  term: string;
  desc: string;
  domain?: string;
}

export const CORE_SERVICES_CRAM: CramTerm[] = [
  { term: 'Microsoft Entra ID', desc: 'Cloud-based identity and access management service (formerly Azure AD). Handles authentication & SSO.', domain: 'Identity' },
  { term: 'Privileged Identity Management (PIM)', desc: 'Provides time-based and approval-based role activation (Just-In-Time JIT access).', domain: 'Identity' },
  { term: 'Azure Resource Manager (ARM)', desc: 'Management layer for deploy, update, and delete actions via declarative templates / Bicep.', domain: 'Governance' },
  { term: 'Azure Virtual Network (VNet)', desc: 'Fundamental building block for your private network in Azure for secure inter-resource routing.', domain: 'Networking' },
  { term: 'Microsoft Sentinel', desc: 'Scalable, cloud-native Security Information Event Management (SIEM) and SOAR solution.', domain: 'Security' },
  { term: 'Azure ExpressRoute', desc: 'Extends on-premises networks into Microsoft cloud over a private connection without internet.', domain: 'Networking' },
  { term: 'Azure Key Vault', desc: 'Secure HSM-backed store for application secrets, encryption keys, and TLS certificates.', domain: 'Security' },
  { term: 'Azure Service Health', desc: 'Personalized guidance and alerts when Azure service issues or maintenance affect your resources.', domain: 'Management' },
  { term: 'Azure Cosmos DB', desc: 'Globally distributed, multi-model NoSQL and relational database with guaranteed <10ms latency.', domain: 'Database' },
  { term: 'Azure Blob Storage', desc: 'Massively scalable object storage for unstructured data (images, logs, telemetry, videos).', domain: 'Storage' },
  { term: 'Azure Policy', desc: 'Enforces organizational standards and assesses compliance at scale across subscriptions.', domain: 'Governance' },
  { term: 'Azure Defender for Cloud', desc: 'Continuous security posture management (CSPM) and hybrid cloud threat protection.', domain: 'Security' },
  { term: 'Availability Zones (AZ)', desc: 'Physically separated datacenters within a region, each with independent power, cooling, and network.', domain: 'Architecture' },
  { term: 'Azure Advisor', desc: 'Personalized cloud consultant recommending cost, reliability, performance, and security optimizations.', domain: 'Management' }
];

export function openPrintableCramSheet(): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the printable cram sheet.');
    return;
  }
  
  const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AZ-900 Exam Cram Cheat Sheet</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #0f172a; line-height: 1.45; }
        .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px; }
        h1 { margin: 0 0 6px 0; color: #0369a1; font-size: 24px; }
        p.sub { margin: 0; color: #64748b; font-size: 13px; font-weight: 500; }
        .actions { margin-bottom: 16px; text-align: center; }
        .print-btn { padding: 9px 18px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .print-btn:hover { background: #0369a1; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .card { border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px 14px; border-radius: 8px; page-break-inside: avoid; }
        .term { font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; }
        .tag { font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
        .desc { font-size: 12.5px; color: #334155; }
        @media print {
          .actions { display: none; }
          body { padding: 0; }
          .card { border-color: #94a3b8; }
        }
      </style>
    </head>
    <body>
      <div class="actions">
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save to PDF</button>
      </div>
      <div class="header">
        <h1>AZ-900 Microsoft Azure Fundamentals — High-Yield Exam Cram</h1>
        <p class="sub">Essential definitions and architectural service models for final revision | Official Pass Mark: 700 / 1000</p>
      </div>
      
      <div class="grid">
        ${CORE_SERVICES_CRAM.map(s => `
          <div class="card">
            <div class="term">
              <span>${s.term}</span>
              ${s.domain ? `<span class="tag">${s.domain}</span>` : ''}
            </div>
            <div class="desc">${s.desc}</div>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
}
