// cramSheet.js

export const CORE_SERVICES_CRAM = [
  { term: 'Microsoft Entra ID', desc: 'Cloud-based identity and access management service (formerly Azure AD).' },
  { term: 'Privileged Identity Management (PIM)', desc: 'Provides time-based and approval-based role activation (Just-In-Time access).' },
  { term: 'Azure Resource Manager (ARM)', desc: 'Management layer for deploy, update, and delete actions via declarative templates.' },
  { term: 'Azure Virtual Network (VNet)', desc: 'Fundamental building block for your private network in Azure.' },
  { term: 'Microsoft Sentinel', desc: 'Scalable, cloud-native Security Information Event Management (SIEM) solution.' },
  { term: 'Azure ExpressRoute', desc: 'Extends on-premises networks into Microsoft cloud over a private connection.' },
  { term: 'Azure Key Vault', desc: 'Secure store for secrets, encryption keys, and TLS certificates.' },
  { term: 'Azure Service Health', desc: 'Personalized guidance and support when Azure service issues affect your resources.' },
  { term: 'Azure Cosmos DB', desc: 'Globally distributed, multi-model database service with 99.999% SLA availability.' },
  { term: 'Azure Blob Storage', desc: 'Massively scalable object storage for unstructured data (images, logs, videos).' },
  { term: 'Azure Policy', desc: 'Enforces organizational standards and assesses compliance at scale across subscriptions.' },
  { term: 'Azure Defender for Cloud', desc: 'Continuous security posture management (CSPM) and hybrid cloud threat protection.' }
];

export function openPrintableCramSheet() {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the printable cram sheet.');
    return;
  }
  
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AZ-900 Exam Cram Cheat Sheet</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #1e293b; line-height: 1.45; }
        .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px; }
        h1 { margin: 0 0 6px 0; color: #0369a1; font-size: 24px; }
        p.sub { margin: 0; color: #64748b; font-size: 13px; font-weight: 500; }
        .actions { margin-bottom: 16px; text-align: center; }
        .print-btn { padding: 9px 18px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .print-btn:hover { background: #0369a1; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .card { border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px 14px; border-radius: 8px; page-break-inside: avoid; }
        .term { font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
        .term::before { content: "•"; color: #0284c7; font-size: 18px; line-height: 0; }
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
        <p class="sub">Essential definitions and architectural service models for final revision | Pass Mark: 700 / 1000</p>
      </div>
      
      <div class="grid">
        ${CORE_SERVICES_CRAM.map(s => `
          <div class="card">
            <div class="term">${s.term}</div>
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
