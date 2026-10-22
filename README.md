# AZ-900 Flashcard Coach

An interactive, AI-assisted flashcard application and study suite built to help learners master the **Microsoft Azure Fundamentals (AZ-900)** certification exam.

---

## 📌 Project Overview

This repository contains the core dataset, schema validation, and application logic for the AZ-900 Flashcard Coach. The dataset is derived directly from structured study notes covering key Azure services, security models, governance tools, and management frameworks.

## 🗂️ Exam Domains Covered in Flashcard Dataset

The initial dataset (`data/az900-flashcards.json`) covers 18 core flashcard items across the main AZ-900 exam domains:

- **Azure Compute Services:** Virtual Machines, App Service, Container Instances (ACI), Azure Kubernetes Service (AKS), Azure Functions, Azure Batch.
- **Azure Database & Analytics Services:** Azure SQL Database, Azure Database for MySQL/PostgreSQL, Cosmos DB, Synapse Analytics, Redis Cache.
- **Azure Networking Services:** Virtual Network (VNet), Subnets, Network Security Groups (NSG), Load Balancer, Application Gateway, VPN Gateway, ExpressRoute, Azure DNS.
- **Azure Storage Services:** Blob Storage, File Storage, Queue Storage, Table Storage, Disk Storage, Data Lake Storage Gen2 (ADLS Gen2).
- **Azure Security Services:** Microsoft Defender for Cloud, Azure Key Vault, Azure Firewall, Azure DDoS Protection, Microsoft Sentinel (SIEM/SOAR), Azure Policy.
- **Identity & Governance:** Microsoft Entra ID (Azure AD), Role-Based Access Control (RBAC), Privileged Identity Management (PIM).
- **Monitoring & Management:** Azure Monitor, Log Analytics, Azure Alerts, Action Groups, Azure Advisor, Activity Log, Service Health, Azure Automation.

## 📁 Repository Structure

```text
az900-flashcard-coach/
├── data/
│   ├── az900-flashcards.json   # JSON dataset containing 18 core AZ-900 flashcards
│   └── az900-schema.json       # JSON Schema definition for validation
├── README.md                   # Repository documentation
└── package.json                # Node.js project metadata and test scripts
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AnnNjeriWangui/az900-flashcard-coach.git
cd az900-flashcard-coach
```

### 2. Dataset Format Example

Each flashcard entry inside `data/az900-flashcards.json` follows this structure:

```json
{
  "id": "az900-001",
  "domain": "Azure Architecture and Services",
  "subtopic": "Networking Services",
  "question": "What is an Azure Virtual Network (VNet)?",
  "answer": "A VNet is a fundamental private network in Azure that enables Azure resources to securely communicate with each other, the internet, and on-premises networks.",
  "difficulty": "easy",
  "tags": ["vnet", "networking", "infrastructure"]
}
```

### 3. Contributors

• Ann Njeri Wangui — Repository Maintainer / Developer
• Davis Nguthu — Software Developer / Contributor
• Kevin Mwangi — Software Developer / Contributor
• Christine Wanjira — Software Developer / Contributor
• Elly Onunga — Software Developer / Contributor
