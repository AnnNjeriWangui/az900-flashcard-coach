export type CategoryId =
  | 'cloud-concepts'
  | 'azure-architecture'
  | 'management-governance';

export type CardStatus = 'new' | 'got-it' | 'need-practice';

export interface Flashcard {
  id: string;
  category: CategoryId;
  question: string;
  answer: string;
  explanation: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  accent: string;
}

export const categories: Category[] = [
  {
    id: 'cloud-concepts',
    name: 'Cloud Concepts',
    description: 'Understand the core ideas behind cloud computing.',
    icon: 'Cloud',
    accent: 'sky',
  },
  {
    id: 'azure-architecture',
    name: 'Azure Architecture and Services',
    description: 'Explore the building blocks of Azure infrastructure.',
    icon: 'Server',
    accent: 'blue',
  },
  {
    id: 'management-governance',
    name: 'Azure Management and Governance',
    description: 'Learn how to manage, secure, and govern Azure resources.',
    icon: 'ShieldCheck',
    accent: 'cyan',
  },
];

export const flashcards: Flashcard[] = [
  {
    id: 'cc-1',
    category: 'cloud-concepts',
    question: 'What is cloud computing?',
    answer: 'The delivery of computing services over the internet on a pay-as-you-go basis.',
    explanation:
      'Instead of buying and maintaining physical hardware, you rent compute, storage, and networking resources from a cloud provider and pay only for what you use.',
  },
  {
    id: 'cc-2',
    category: 'cloud-concepts',
    question: 'What are the three main cloud service models?',
    answer: 'IaaS, PaaS, and SaaS.',
    explanation:
      'IaaS (Infrastructure as a Service) gives you virtual machines and networking. PaaS (Platform as a Service) gives you a managed platform for apps. SaaS (Software as a Service) gives you ready-to-use software like email or Office apps.',
  },
  {
    id: 'cc-3',
    category: 'cloud-concepts',
    question: 'What is the difference between CapEx and OpEx?',
    answer: 'CapEx is upfront spending on hardware; OpEx is ongoing spending for services you use.',
    explanation:
      'Cloud computing shifts costs from capital expenses (buying servers) to operational expenses (paying monthly for usage), which is more flexible and predictable.',
  },
  {
    id: 'cc-4',
    category: 'cloud-concepts',
    question: 'What are the three cloud deployment models?',
    answer: 'Public, private, and hybrid cloud.',
    explanation:
      'A public cloud is shared and run by a provider, a private cloud is dedicated to one organization, and a hybrid cloud combines both by connecting them.',
  },
  {
    id: 'cc-5',
    category: 'cloud-concepts',
    question: 'Which cloud model offers the most control over the operating system?',
    answer: 'IaaS (Infrastructure as a Service).',
    explanation:
      'IaaS gives you virtual machines where you control the OS, middleware, and apps, while the provider handles the physical hardware and networking.',
  },
  {
    id: 'aa-1',
    category: 'azure-architecture',
    question: 'What is an Azure region?',
    answer: 'A geographical area that contains one or more datacenters.',
    explanation:
      'Regions let you deploy applications close to your users for lower latency. Each region is paired with another for redundancy and disaster recovery.',
  },
  {
    id: 'aa-2',
    category: 'azure-architecture',
    question: 'What is an Availability Zone?',
    answer: 'A physically separate location within a region with its own power and networking.',
    explanation:
      'Availability Zones protect applications from datacenter failures. Using at least two zones ensures that if one fails, the other keeps your app running.',
  },
  {
    id: 'aa-3',
    category: 'azure-architecture',
    question: 'What is a resource group in Azure?',
    answer: 'A container that holds related Azure resources for a single application or solution.',
    explanation:
      'Resources can only live in one resource group, but a resource group can contain resources from different regions. It is the basic unit for managing and billing related resources together.',
  },
  {
    id: 'aa-4',
    category: 'azure-architecture',
    question: 'What is Azure Virtual Machines?',
    answer: 'A service that lets you run virtualized computers in the Azure cloud.',
    explanation:
      'You choose the size, operating system, and configuration. You are responsible for the OS and apps, while Azure handles the underlying physical hardware.',
  },
  {
    id: 'aa-5',
    category: 'azure-architecture',
    question: 'What is the Azure Marketplace?',
    answer: 'A catalog of pre-built cloud solutions you can deploy directly from Azure.',
    explanation:
      'It includes virtual machine images, applications, and services from Microsoft and partners, so you can start quickly without building everything yourself.',
  },
  {
    id: 'aa-6',
    category: 'azure-architecture',
    question: 'What is Azure Blob Storage used for?',
    answer: 'Storing large amounts of unstructured data like images, videos, and documents.',
    explanation:
      'Blob Storage is ideal for files and backups. You can choose hot, cool, or archive tiers depending on how often you need to access the data.',
  },
  {
    id: 'mg-1',
    category: 'management-governance',
    question: 'What does the Azure portal do?',
    answer: 'It is the web-based interface for managing everything in your Azure account.',
    explanation:
      'Through the portal you can create resources, set permissions, monitor usage, and configure billing without writing code.',
  },
  {
    id: 'mg-2',
    category: 'management-governance',
    question: 'What is Azure Resource Manager (ARM)?',
    answer: 'The deployment and management service that organizes resources in Azure.',
    explanation:
      'ARM lets you create, update, and delete resources using a consistent management layer. Templates written as JSON let you deploy resources repeatedly and reliably.',
  },
  {
    id: 'mg-3',
    category: 'management-governance',
    question: 'What is the purpose of Azure RBAC?',
    answer: 'To control who can access which Azure resources and what they can do with them.',
    explanation:
      'Role-Based Access Control assigns roles like Owner, Contributor, or Reader to users and groups, so each person only has the permissions they need.',
  },
  {
    id: 'mg-4',
    category: 'management-governance',
    question: 'What is Azure Policy?',
    answer: 'A service that enforces rules over your resources to keep them compliant.',
    explanation:
      'Policy can block non-compliant resources from being created, for example requiring a specific region or blocking expensive virtual machine sizes.',
  },
  {
    id: 'mg-5',
    category: 'management-governance',
    question: 'What is the Azure Advisor?',
    answer: 'A free service that gives you best-practice recommendations for your Azure resources.',
    explanation:
      'Advisor analyzes your setup and suggests improvements for reliability, security, performance, and cost, helping you follow Microsoft recommended practices.',
  },
];

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id) ?? categories[0];
}

export function cardsByCategory(id: CategoryId): Flashcard[] {
  return flashcards.filter((c) => c.category === id);
}
