// aiExplainer.ts

export const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const API_KEY_STORAGE_KEY = 'az900_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(API_KEY_STORAGE_KEY) ||
    (import.meta.env?.VITE_GEMINI_API_KEY as string) ||
    ''
  );
}

export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } else {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  }
}

/**
 * Curated offline fallback analogies for core Azure AZ-900 exam concepts.
 * Ensures learners always get rich, helpful analogies even without an active API key or when offline.
 */
const OFFLINE_ANALOGIES: Record<string, string> = {
  vnet: `🏢 **The Gated Corporate Office Park**
• Think of an **Azure Virtual Network (VNet)** as your company's private, gated office complex.
• Inside the gates, different teams (Subnets) can freely walk between buildings and talk securely without anyone on the outside public road listening in.
• To talk to people outside (the Internet or on-premises), you install a security checkpoint (Gateway or Firewall).

💡 **Key Takeaway to Remember:** A VNet is your private island in Azure where your resources communicate safely by default.`,

  region: `🌍 **The City Postal Area vs. Individual Buildings**
• An **Azure Region** is like an entire metropolitan city (e.g., Chicago) containing multiple facilities within a short drive of each other.
• An **Availability Zone (AZ)** is like 3 distinct, earthquake-proof skyscrapers across that city, each with its own independent backup generator, water supply, and fiber cables.
• If one building suffers a power blackout, the other two continue operating normally without interruption.

💡 **Key Takeaway to Remember:** A Region is the geographic area; Availability Zones are isolated power/cooling data centers inside that region for high availability.`,

  blob: `📦 **The Mega Storage Locker vs. A High-Speed Desk Drawer**
• **Azure Blob Storage** is like renting a massive self-storage unit where you can toss photos, audio files, backups, and moving boxes of any shape or size without worrying about running out of space.
• **Azure Disk Storage**, in contrast, is like the dedicated hard drive bolted directly onto your laptop for fast operating system boots.

💡 **Key Takeaway to Remember:** Blob Storage is for massive, unstructured files accessible from anywhere via HTTP/HTTPS.`,

  vm: `💻 **Renting a Fully Furnished Computer in the Cloud**
• An **Azure Virtual Machine (IaaS)** is like leasing a computer in a secure digital warehouse.
• You pick how much RAM and CPU it has, choose Windows or Linux, and you are responsible for updating the operating system and installing your own programs.
• You don't have to worry about buying physical computer towers or replacing dead hard drives.

💡 **Key Takeaway to Remember:** A VM provides full OS control with Infrastructure-as-a-Service (IaaS) responsibility.`,

  functions: `⚡ **The Automatic Vending Machine (Serverless)**
• **Azure Functions** is like an automated vending machine: it sits idle consuming almost zero electricity until someone presses a button (an event or HTTP trigger).
• The moment a request arrives, it spins into action, dispenses your snack (executes your code in milliseconds), and goes back to sleep.
• You never pay for it while it's waiting — only for the exact seconds it was actively serving.

💡 **Key Takeaway to Remember:** Functions run event-driven snippets of code on demand without managing servers (Serverless / FaaS).`,

  rbac: `🔑 **The Company Keycard Access Levels**
• **Role-Based Access Control (RBAC)** is like programmed keycards in a corporate headquarters.
• The receptionist can only enter the front lobby; the IT engineer can enter the server room; and the CEO has access to every floor.
• Instead of giving every employee a unique custom key, you assign them a "Role" (e.g., Reader, Contributor, Owner) matching their job duties.

💡 **Key Takeaway to Remember:** RBAC gives users only the minimum permissions needed to do their specific job (Least Privilege).`,

  policy: `🚧 **The Corporate Guardrails and Building Codes**
• **Azure Policy** is like city zoning laws and building safety codes (e.g., "All buildings must have fire sprinklers and cannot exceed 10 stories").
• It doesn't care *who* you are; it simply blocks anyone from building in the wrong zone (e.g., forbidding deployment of expensive VMs or outside of approved regions).
• While RBAC controls *who* can enter, Policy controls *what* can physically be built.

💡 **Key Takeaway to Remember:** Azure Policy enforces governance guardrails and compliance rules across all resource deployments.`,

  sentinel: `🕵️‍♂️ **The Master Security Control Room & AI Investigator**
• **Microsoft Sentinel** is like having an ultra-smart security surveillance center for your entire estate.
• It continuously collects video feeds, door badge logs, and sensor alerts from every corner, using AI to instantly spot when someone suspicious is trying three back doors at 2 AM.
• It can even trigger automated responses, like automatically locking down gates before an intruder slips in.

💡 **Key Takeaway to Remember:** Microsoft Sentinel is a cloud-native SIEM and SOAR system that detects and responds to threats across your entire digital environment.`,

  keyvault: `🏦 **The Bank Safety Deposit Box**
• **Azure Key Vault** is like renting an ultra-secure, armored bank vault with biometric scanners.
• Instead of scribbling your house keys and banking passwords on sticky notes stuck to your monitor (hardcoded in code), you store secrets, SSL certificates, and encryption keys in the vault.
• Your application simply knocks on the vault door with authorized credentials when it needs a secret.

💡 **Key Takeaway to Remember:** Key Vault centralizes and secures application secrets, API keys, and certificates away from source code.`,

  defender: `🛡️ **The Building Health Inspector & Security Advisor**
• **Microsoft Defender for Cloud** is like a seasoned building inspector who walks around your premises with a clipboard.
• It checks if your fire alarms are working, notices open windows, gives you a overall "Secure Score", and hands you a step-by-step to-do list to make your building burglar-proof.

💡 **Key Takeaway to Remember:** Defender for Cloud provides continuous security posture management (CSPM) and threat protection for hybrid cloud resources.`,
};

function findFallbackAnalogy(title: string, definition: string): string | null {
  const text = `${title} ${definition}`.toLowerCase();
  for (const [key, analogy] of Object.entries(OFFLINE_ANALOGIES)) {
    if (text.includes(key)) {
      return analogy;
    }
  }
  return null;
}

/**
 * Generates an everyday real-life analogy for a given Azure concept or flashcard question.
 * @param conceptTitle - e.g., "Azure Blob Storage vs Azure Disk Storage"
 * @param conceptDefinition - e.g., "Unstructured object storage vs block storage for VMs"
 * @param customKey - Optional explicitly supplied API key
 */
export async function getRealLifeAnalogy(
  conceptTitle: string,
  conceptDefinition: string,
  customKey?: string
): Promise<string> {
  const apiKey = customKey || getStoredApiKey();

  // If no API key is provided, return rich curated analogy or helpful mock
  if (!apiKey) {
    const fallback = findFallbackAnalogy(conceptTitle, conceptDefinition);
    if (fallback) {
      return fallback;
    }

    return `🏪 **The Everyday Scenario Analogy**
• Think of **${conceptTitle}** like an organized municipal service or department store system.
• Instead of every customer building their own private warehouse or power grid, Azure provides this service on-demand so you only pay for the exact resources you consume.
• It handles maintenance, scaling, and physical security behind the scenes so you can focus on running your business.

💡 **Key Takeaway to Remember:** ${conceptTitle} simplifies cloud management by handling infrastructure heavy lifting automatically.
*(Add your Gemini API key in settings for real-time custom analogies!)*`;
  }

  const prompt = `
    You are an expert, encouraging tutor for the Microsoft Azure AZ-900 certification exam.
    Explain the following Azure concept using a simple, relatable, real-life everyday analogy (like cooking, running a bakery/shop, commuting, public libraries, or managing a household).
    
    Concept: ${conceptTitle}
    Official Definition: ${conceptDefinition}

    Requirements:
    1. Structure with an engaging analogy title (e.g. 🏢 The Corporate Office Park).
    2. Provide 2-3 short bullet points comparing the cloud mechanics to the real-life scenario.
    3. Use friendly, simple language suitable for complete beginners.
    4. Conclude with a single highlighted sentence: "💡 Key Takeaway to Remember: <summary>".
  `;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini API Error: ${response.status} - ${errText}`);
      const fallback = findFallbackAnalogy(conceptTitle, conceptDefinition);
      if (fallback) return fallback;
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const explanationText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (explanationText && explanationText.trim()) {
      return explanationText.trim();
    }

    const fallback = findFallbackAnalogy(conceptTitle, conceptDefinition);
    return fallback || 'Could not generate an explanation at this time.';
  } catch (error) {
    console.error('AI Analogy Error:', error);
    const fallback = findFallbackAnalogy(conceptTitle, conceptDefinition);
    if (fallback) {
      return fallback;
    }
    return '💡 *Analogy unavailable offline. Try again when connected or check your API key.*';
  }
}
