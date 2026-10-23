// mockExam.ts

export interface MockQuestion {
  id: string;
  domain: 'Cloud Concepts' | 'Azure Architecture & Services' | 'Azure Management & Governance' | 'Security & Identity';
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface DomainScore {
  scorePercent: number;
  correct: number;
  total: number;
}

export interface Scorecard {
  score: number; // scaled out of 1000
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  domainBreakdown: Record<string, DomainScore>;
}

export const MOCK_EXAM_QUESTIONS: MockQuestion[] = [
  {
    id: 'me-1',
    domain: 'Cloud Concepts',
    question: 'Which cloud deployment model involves infrastructure owned, managed, and operated exclusively by a single enterprise organization?',
    options: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Multi-Cloud'],
    answerIndex: 1,
    explanation: 'A private cloud consists of computing resources used exclusively by one business or organization, physically located at the organization’s on-premises datacenter or hosted by a third party.'
  },
  {
    id: 'me-2',
    domain: 'Cloud Concepts',
    question: 'Under the Shared Responsibility Model, which layer is ALWAYS the sole responsibility of the customer across all cloud models (IaaS, PaaS, SaaS)?',
    options: ['Physical datacenter security', 'Information and data', 'Operating system updates', 'Network controls'],
    answerIndex: 1,
    explanation: 'Information and data governance, user credentials, and device access are always 100% the customer’s responsibility regardless of cloud service model.'
  },
  {
    id: 'me-3',
    domain: 'Cloud Concepts',
    question: 'Which benefit of cloud computing refers to the ability to quickly increase or decrease compute resources automatically in response to workload spikes?',
    options: ['High Availability', 'Predictability', 'Elasticity', 'Disaster Recovery'],
    answerIndex: 2,
    explanation: 'Elasticity is the ability to automatically adjust computing capacity in real-time as application demand fluctuates.'
  },
  {
    id: 'me-4',
    domain: 'Azure Architecture & Services',
    question: 'What is the minimum number of Availability Zones located within a typical Azure region that supports Availability Zones?',
    options: ['One zone', 'Two zones', 'Three distinct zones', 'Five zones'],
    answerIndex: 2,
    explanation: 'An Availability Zone-enabled Azure region typically contains a minimum of three separate zones, each with independent power, cooling, and networking.'
  },
  {
    id: 'me-5',
    domain: 'Azure Architecture & Services',
    question: 'Which Azure compute service allows you to run containerized microservices without provisioning or managing any virtual machines or Kubernetes control planes?',
    options: ['Azure Container Instances (ACI)', 'Azure Batch', 'Azure Virtual Machines', 'Azure Spring Apps'],
    answerIndex: 0,
    explanation: 'Azure Container Instances (ACI) is a serverless container solution allowing instant execution without managing underlying infrastructure.'
  },
  {
    id: 'me-6',
    domain: 'Azure Architecture & Services',
    question: 'Your company requires high-throughput file shares accessible simultaneously from Windows, Linux, and macOS via SMB and NFS protocols. Which service should you choose?',
    options: ['Azure Blob Storage', 'Azure Files', 'Azure Disk Storage', 'Azure Queue Storage'],
    answerIndex: 1,
    explanation: 'Azure Files provides fully managed cloud file shares accessible via standard Server Message Block (SMB) and Network File System (NFS) protocols.'
  },
  {
    id: 'me-7',
    domain: 'Azure Architecture & Services',
    question: 'Which Azure storage tier is intended for data that is rarely accessed and can tolerate retrieval latency of several hours?',
    options: ['Hot tier', 'Cool tier', 'Cold tier', 'Archive tier'],
    answerIndex: 3,
    explanation: 'The Archive tier has the lowest storage cost but the highest retrieval costs and takes several hours to rehydrate objects.'
  },
  {
    id: 'me-8',
    domain: 'Azure Architecture & Services',
    question: 'What Azure networking service connects on-premises networks to Azure over a dedicated, private fiber connection without using the public Internet?',
    options: ['Azure VPN Gateway', 'Azure ExpressRoute', 'Network Security Group', 'Azure Virtual WAN'],
    answerIndex: 1,
    explanation: 'Azure ExpressRoute lets you extend on-premises networks into the Microsoft cloud over private connections facilitated by a connectivity provider.'
  },
  {
    id: 'me-9',
    domain: 'Security & Identity',
    question: 'Which Microsoft Entra ID feature requires users to provide additional verification methods (e.g. phone prompt, authenticator app) during sign-in?',
    options: ['Single Sign-On (SSO)', 'Multifactor Authentication (MFA)', 'Conditional Access Baseline', 'Self-Service Password Reset'],
    answerIndex: 1,
    explanation: 'Multifactor Authentication (MFA) safeguards access to data and apps by requiring two or more authentication factors.'
  },
  {
    id: 'me-10',
    domain: 'Security & Identity',
    question: 'Which service allows administrators to activate temporary, time-bound elevated administrative privileges with justification and approval workflows?',
    options: ['Azure Role-Based Access Control (RBAC)', 'Privileged Identity Management (PIM)', 'Microsoft Defender for Identity', 'Azure Bastion'],
    answerIndex: 1,
    explanation: 'Microsoft Entra Privileged Identity Management (PIM) enables Just-In-Time (JIT) role activation to prevent 24/7 standing privileged access.'
  },
  {
    id: 'me-11',
    domain: 'Security & Identity',
    question: 'Where should application developers securely store API tokens, database connection strings, and TLS certificates to prevent accidental leak in source code?',
    options: ['Azure Blob Storage Container', 'Azure Key Vault', 'Azure Resource Group tags', 'Azure App Configuration'],
    answerIndex: 1,
    explanation: 'Azure Key Vault is designed specifically to safeguard cryptographic keys, secrets (passwords/connection strings), and certificates.'
  },
  {
    id: 'me-12',
    domain: 'Security & Identity',
    question: 'Which cloud-native tool provides intelligent Security Information and Event Management (SIEM) and Security Orchestration Automated Response (SOAR)?',
    options: ['Microsoft Sentinel', 'Microsoft Defender for Cloud', 'Azure Network Watcher', 'Azure Firewall Manager'],
    answerIndex: 0,
    explanation: 'Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the entire enterprise estate.'
  },
  {
    id: 'me-13',
    domain: 'Azure Management & Governance',
    question: 'Which Azure governance tool assesses resource compliance and blocks deployments that do not conform to organizational rules (e.g., blocking disallowed VM sizes)?',
    options: ['Azure Policy', 'Role-Based Access Control (RBAC)', 'Cost Management Budgets', 'Azure Service Health'],
    answerIndex: 0,
    explanation: 'Azure Policy enforces rules and effects over your resources so those resources stay compliant with corporate standards and service-level agreements.'
  },
  {
    id: 'me-14',
    domain: 'Azure Management & Governance',
    question: 'An administrator needs to deploy identical environments (subnets, VMs, policies, RBAC roles) repeatedly using declarative JSON or Bicep files. Which tool does this?',
    options: ['Azure Resource Manager (ARM) templates', 'Azure Advisor', 'Azure Automation Runbooks', 'Azure Cloud Shell'],
    answerIndex: 0,
    explanation: 'ARM templates and Bicep provide Infrastructure as Code (IaC) to declaratively define and deploy Azure infrastructure reliably.'
  },
  {
    id: 'me-15',
    domain: 'Azure Management & Governance',
    question: 'Which free tool analyzes resource configurations and telemetry to provide personalized recommendations in Reliability, Security, Performance, Operational Excellence, and Cost?',
    options: ['Azure Monitor', 'Azure Advisor', 'Azure Lighthouse', 'Azure Service Health'],
    answerIndex: 1,
    explanation: 'Azure Advisor is a personalized cloud consultant that helps you follow best practices to optimize your Azure deployments across the Well-Architected framework.'
  }
];

export class MockExamSimulator {
  questions: MockQuestion[];
  timeLimit: number; // in seconds
  timer: any;
  timeRemaining: number;
  userAnswers: Record<string, number>;
  currentIndex: number;

  constructor(questions: MockQuestion[] = MOCK_EXAM_QUESTIONS, timeLimitMinutes: number = 30) {
    this.questions = questions;
    this.timeLimit = timeLimitMinutes * 60;
    this.timer = null;
    this.timeRemaining = this.timeLimit;
    this.userAnswers = {};
    this.currentIndex = 0;
  }

  startExam(onTick?: (formattedTime: string) => void, onComplete?: (scorecard: Scorecard) => void): void {
    this.timeRemaining = this.timeLimit;
    this.userAnswers = {};
    this.currentIndex = 0;

    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (onTick) onTick(this.formatTime(this.timeRemaining));

      if (this.timeRemaining <= 0) {
        this.stopExam();
        if (onComplete) onComplete(this.generateScorecard());
      }
    }, 1000);
  }

  stopExam(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  selectAnswer(questionId: string, optionIndex: number): void {
    this.userAnswers[questionId] = optionIndex;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  generateScorecard(): Scorecard {
    let correctCount = 0;
    const domainStats: Record<string, { total: number; correct: number }> = {};

    this.questions.forEach((q) => {
      if (!domainStats[q.domain]) {
        domainStats[q.domain] = { total: 0, correct: 0 };
      }
      domainStats[q.domain].total++;

      const isCorrect = this.userAnswers[q.id] === q.answerIndex;
      if (isCorrect) {
        correctCount++;
        domainStats[q.domain].correct++;
      }
    });

    const scaledScore = Math.round((correctCount / this.questions.length) * 1000);
    const passed = scaledScore >= 700;

    const domainBreakdown: Record<string, DomainScore> = {};
    for (const [domain, stats] of Object.entries(domainStats)) {
      domainBreakdown[domain] = {
        scorePercent: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        correct: stats.correct,
        total: stats.total,
      };
    }

    return {
      score: scaledScore,
      passed,
      totalQuestions: this.questions.length,
      correctCount,
      domainBreakdown,
    };
  }
}
