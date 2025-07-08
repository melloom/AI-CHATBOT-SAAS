// Centralized pricing configuration for ChatHub SaaS and Web Development services
// This ensures consistency across all pages and components

export interface PricingPlan {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  popular?: boolean
  current?: boolean
  icon?: any
  timeline?: string
}

export interface AddonService {
  name: string
  price: string
  description: string
  icon?: any
}

// ChatHub SaaS Plans
export const chathubPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "$99",
    period: "month",
    description: "Perfect for small businesses getting started",
    features: [
      "Up to 2 chatbots",
      "5,000 conversations/month",
      "Basic analytics",
      "Email support",
      "Standard templates",
      "Mobile responsive",
      "Basic integrations",
      "Knowledge base support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$299",
    period: "month",
    description: "Best for growing businesses",
    features: [
      "Up to 8 chatbots",
      "50,000 conversations/month",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
      "Team collaboration",
      "Multi-language support",
      "Advanced integrations",
      "Custom training",
      "Dedicated account manager",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$799",
    period: "month",
    description: "For large organizations",
    features: [
      "Unlimited chatbots",
      "Unlimited conversations",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
      "On-premise deployment",
      "Custom AI training",
      "Advanced reporting",
      "Multi-tenant support",
    ],
    popular: false,
  },
]

// Web Development Plans
export const webDevelopmentPlans: PricingPlan[] = [
  {
    name: "Basic Website Package",
    price: "$2,500",
    description: "Perfect for small businesses and startups",
    features: [
      "Custom website design",
      "Responsive design (mobile-friendly)",
      "Up to 5 pages",
      "Contact form",
      "Basic SEO optimization",
      "Google Analytics integration",
      "Social media integration",
      "Content management system",
      "1 month of support",
      "Domain & hosting setup"
    ],
    timeline: "2-4 weeks",
    popular: false,
  },
  {
    name: "Professional Website Package",
    price: "$5,000",
    description: "Ideal for growing businesses",
    features: [
      "Everything in Basic, plus:",
      "Up to 10 pages",
      "Advanced SEO optimization",
      "Blog functionality",
      "Newsletter integration",
      "Advanced contact forms",
      "Social media feeds",
      "Google My Business setup",
      "Performance optimization",
      "3 months of support",
      "Training session included"
    ],
    timeline: "4-6 weeks",
    popular: true,
  },
  {
    name: "E-commerce Website Package",
    price: "$8,000",
    description: "Complete online store solution",
    features: [
      "Everything in Professional, plus:",
      "Product catalog management",
      "Shopping cart functionality",
      "Payment gateway integration",
      "Inventory management",
      "Order processing system",
      "Customer accounts",
      "Product reviews & ratings",
      "Shipping calculator",
      "Tax calculation",
      "6 months of support"
    ],
    timeline: "6-8 weeks",
    popular: false,
  },
  {
    name: "Custom Enterprise Solutions",
    price: "$15,000+",
    description: "Tailored solutions for large organizations",
    features: [
      "Custom functionality development",
      "Advanced user management",
      "API integrations",
      "Custom database design",
      "Advanced security features",
      "Performance optimization",
      "Scalability planning",
      "Custom reporting",
      "Multi-language support",
      "12 months of support",
      "Dedicated project manager"
    ],
    timeline: "8-16 weeks",
    popular: false,
  }
]

// Web Development Add-ons
export const webDevelopmentAddons: AddonService[] = [
  {
    name: "Mobile App Development",
    price: "$8,000+",
    description: "Native iOS and Android applications",
  },
  {
    name: "ChatHub Integration",
    price: "$200/month",
    description: "AI chatbot for customer support",
  },
  {
    name: "Advanced SEO Package",
    price: "$1,500",
    description: "Comprehensive search engine optimization",
  },
  {
    name: "Monthly Maintenance",
    price: "$50/month",
    description: "Updates, security, and support",
  },
  {
    name: "Custom Design",
    price: "$1,000",
    description: "Unique visual design and branding",
  },
  {
    name: "Performance Optimization",
    price: "$800",
    description: "Speed and performance improvements",
  }
]

// Hosting & Maintenance Plans
export const hostingPlans: PricingPlan[] = [
  {
    name: "Basic Hosting",
    price: "$20/month",
    description: "Essential hosting for small websites",
    features: [
      "Shared hosting environment",
      "10GB storage",
      "Unlimited bandwidth",
      "SSL certificate included",
      "Daily backups",
      "Email support",
      "99.9% uptime guarantee",
      "Basic security features"
    ],
    popular: false,
  },
  {
    name: "Professional Hosting",
    price: "$50/month",
    description: "Enhanced hosting for growing businesses",
    features: [
      "VPS hosting environment",
      "50GB storage",
      "Unlimited bandwidth",
      "SSL certificate included",
      "Daily backups",
      "Priority support",
      "99.9% uptime guarantee",
      "Advanced security features",
      "CDN included",
      "Performance monitoring"
    ],
    popular: true,
  },
  {
    name: "Enterprise Hosting",
    price: "$100/month",
    description: "Dedicated hosting for large applications",
    features: [
      "Dedicated server resources",
      "Unlimited storage",
      "Unlimited bandwidth",
      "SSL certificate included",
      "Hourly backups",
      "24/7 support",
      "99.99% uptime guarantee",
      "Advanced security features",
      "Global CDN",
      "Performance optimization",
      "Custom configurations"
    ],
    popular: false,
  }
]

// Maintenance Services
export const maintenanceServices: PricingPlan[] = [
  {
    name: "Basic Maintenance",
    price: "$50/month",
    description: "Essential website maintenance and updates",
    features: [
      "Weekly security updates",
      "Monthly backups",
      "Performance monitoring",
      "Uptime monitoring",
      "Basic troubleshooting",
      "Email support",
      "Plugin updates",
      "Content updates (5 hours/month)",
      "SEO monitoring",
      "Analytics reporting"
    ],
  },
  {
    name: "Professional Maintenance",
    price: "$100/month",
    description: "Comprehensive maintenance with priority support",
    features: [
      "Everything in Basic, plus:",
      "Daily security scans",
      "Weekly backups",
      "Performance optimization",
      "Priority support",
      "Content updates (10 hours/month)",
      "Advanced SEO optimization",
      "Social media management",
      "Monthly reports",
      "Training sessions"
    ],
  },
  {
    name: "Enterprise Maintenance",
    price: "$200/month",
    description: "Full-service maintenance with dedicated support",
    features: [
      "Everything in Professional, plus:",
      "24/7 monitoring",
      "Instant security patches",
      "Real-time backups",
      "Dedicated support team",
      "Unlimited content updates",
      "Custom development hours",
      "Strategic consulting",
      "Quarterly reviews",
      "Emergency response"
    ],
  }
]

// ChatHub Integration Plans
export const chathubIntegrationPlans: PricingPlan[] = [
  {
    name: "Basic Integration",
    price: "$200/month",
    description: "Essential chatbot for small businesses",
    features: [
      "Basic chatbot setup",
      "Up to 1,000 conversations/month",
      "Standard templates",
      "Email support",
      "Basic analytics",
      "Mobile responsive",
      "Integration with website",
      "Training session included"
    ],
    popular: false,
  },
  {
    name: "Professional Integration",
    price: "$500/month",
    description: "Advanced chatbot for growing businesses",
    features: [
      "Advanced chatbot setup",
      "Up to 10,000 conversations/month",
      "Custom templates",
      "Priority support",
      "Advanced analytics",
      "Multi-language support",
      "API access",
      "Custom branding",
      "Team collaboration",
      "Advanced integrations"
    ],
    popular: true,
  },
  {
    name: "Enterprise Integration",
    price: "$1,000/month",
    description: "Full-service chatbot solution",
    features: [
      "Custom chatbot development",
      "Unlimited conversations",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "Advanced AI training",
      "SLA guarantee",
      "On-premise deployment",
      "Custom reporting",
      "Dedicated account manager"
    ],
    popular: false,
  }
]

// Personal AI Agent Plans
export const personalAIAgentPlans: PricingPlan[] = [
  {
    name: "Personal Assistant",
    price: "$19/month",
    description: "Your personal AI assistant for daily tasks",
    features: [
      "Email management & drafting",
      "Calendar scheduling & reminders",
      "Task organization & to-do lists",
      "Basic research & information gathering",
      "Document writing assistance",
      "Personal productivity coaching",
      "Voice-to-text capabilities",
      "Mobile app access",
      "Email support",
      "Basic integrations (Gmail, Calendar)"
    ],
    popular: false,
  },
  {
    name: "Smart Assistant",
    price: "$39/month",
    description: "Advanced AI assistant for professionals",
    features: [
      "Everything in Personal, plus:",
      "Advanced email automation",
      "Meeting scheduling & preparation",
      "Document analysis & summaries",
      "Research & data analysis",
      "Presentation creation assistance",
      "Project management support",
      "Priority support",
      "Advanced integrations (Slack, Teams)",
      "Custom workflow automation"
    ],
    popular: true,
  },
  {
    name: "Executive Assistant",
    price: "$79/month",
    description: "Premium AI assistant for executives",
    features: [
      "Everything in Smart, plus:",
      "Executive-level communication",
      "Strategic planning assistance",
      "Financial analysis & reporting",
      "Travel planning & coordination",
      "Stakeholder management",
      "Crisis management support",
      "Dedicated support",
      "Custom AI training",
      "API access for integrations"
    ],
    popular: false,
  }
]

// AI Agent Specialized Services
export const aiAgentServices: AddonService[] = [
  {
    name: "Email Management",
    price: "$15/month",
    description: "Automated email sorting, drafting, and response management",
  },
  {
    name: "Calendar Optimization",
    price: "$10/month",
    description: "Smart scheduling, conflict resolution, and time management",
  },
  {
    name: "Document Assistant",
    price: "$20/month",
    description: "Document creation, editing, and formatting assistance",
  },
  {
    name: "Research Assistant",
    price: "$25/month",
    description: "Deep research, fact-checking, and information synthesis",
  },
  {
    name: "Voice Assistant",
    price: "$30/month",
    description: "Voice commands, transcription, and hands-free operation",
  },
  {
    name: "Custom Training",
    price: "$100",
    description: "Personalized AI training for your specific needs and preferences",
  }
]

// Custom Development Services
export const customDevelopmentServices: AddonService[] = [
  {
    name: "Custom Website Development",
    price: "Starting from $2,500",
    description: "Tailored website solutions built specifically for your business needs",
  },
  {
    name: "E-commerce Development",
    price: "Starting from $8,000",
    description: "Complete online store solutions with payment processing",
  },
  {
    name: "Web Application Development",
    price: "Starting from $15,000",
    description: "Custom web applications and business software",
  },
  {
    name: "API Development",
    price: "Starting from $5,000",
    description: "Custom API development and third-party integrations",
  }
]

// Company & Business Services
export const companyServices: AddonService[] = [
  {
    name: "Company Formation & Legal Setup",
    price: "$500",
    description: "Complete company registration, legal structure, and compliance setup",
  },
  {
    name: "Business Plan Development",
    price: "$1,200",
    description: "Comprehensive business plan with market analysis and financial projections",
  },
  {
    name: "Legal Document Templates",
    price: "$300",
    description: "Custom legal documents including contracts, terms of service, and privacy policies",
  },
  {
    name: "Compliance & Regulatory Services",
    price: "$800",
    description: "Industry-specific compliance setup and regulatory guidance",
  },
  {
    name: "Intellectual Property Protection",
    price: "$600",
    description: "Trademark registration, copyright protection, and IP strategy",
  },
  {
    name: "Tax Planning & Setup",
    price: "$400",
    description: "Business tax structure optimization and accounting setup",
  },
  {
    name: "HR & Employment Law",
    price: "$350",
    description: "Employment contracts, policies, and HR compliance documentation",
  },
  {
    name: "Data Protection & GDPR",
    price: "$450",
    description: "Privacy policy, data protection compliance, and GDPR implementation",
  },
  {
    name: "Contract Review & Negotiation",
    price: "$200/hour",
    description: "Legal contract review, negotiation support, and risk assessment",
  },
  {
    name: "Corporate Governance",
    price: "$750",
    description: "Board structure, governance policies, and corporate compliance",
  }
]

// Industry-Specific Services
export const industryServices: AddonService[] = [
  {
    name: "Healthcare Compliance (HIPAA)",
    price: "$1,500",
    description: "HIPAA compliance setup, security protocols, and healthcare regulations",
  },
  {
    name: "Financial Services Compliance",
    price: "$2,000",
    description: "FINRA, SEC compliance, and financial regulatory requirements",
  },
  {
    name: "E-commerce Legal Package",
    price: "$800",
    description: "Terms of service, return policies, and e-commerce legal compliance",
  },
  {
    name: "SaaS Legal Framework",
    price: "$1,200",
    description: "SaaS agreements, subscription terms, and service level agreements",
  },
  {
    name: "Real Estate Legal Services",
    price: "$900",
    description: "Property contracts, lease agreements, and real estate compliance",
  },
  {
    name: "Restaurant & Food Service",
    price: "$600",
    description: "Food safety compliance, licensing, and restaurant legal requirements",
  },
  {
    name: "Technology & Software",
    price: "$1,000",
    description: "Software licensing, open source compliance, and tech legal framework",
  },
  {
    name: "Non-Profit & Charity",
    price: "$400",
    description: "501(c)(3) setup, nonprofit compliance, and charitable organization legal",
  }
]

// Consulting & Advisory Services
export const consultingServices: AddonService[] = [
  {
    name: "Business Strategy Consulting",
    price: "$150/hour",
    description: "Strategic planning, market analysis, and business growth consulting",
  },
  {
    name: "Financial Planning & Analysis",
    price: "$200/hour",
    description: "Financial modeling, budgeting, and investment strategy",
  },
  {
    name: "Risk Management",
    price: "$175/hour",
    description: "Risk assessment, mitigation strategies, and insurance planning",
  },
  {
    name: "Mergers & Acquisitions",
    price: "$300/hour",
    description: "M&A strategy, due diligence, and transaction support",
  },
  {
    name: "International Business",
    price: "$250/hour",
    description: "International expansion, cross-border compliance, and global strategy",
  },
  {
    name: "Crisis Management",
    price: "$400/hour",
    description: "Crisis response, reputation management, and legal defense",
  }
]

// Budget Ranges for Contact Forms
export const budgetRanges = [
  "Under $1,000",
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $20,000",
  "$20,000+"
]

// Payment Terms
export const paymentTerms = [
  {
    step: "1",
    title: "50% Upfront",
    description: "Required to start your project"
  },
  {
    step: "2",
    title: "50% Upon Completion",
    description: "Due when project is delivered"
  },
  {
    step: "3",
    title: "Monthly Services",
    description: "Billed monthly with net-30 terms"
  }
]

// What's Included in All Plans
export const whatsIncluded = [
  "Free consultation call",
  "Detailed project proposal",
  "Regular progress updates",
  "Training and documentation",
  "Post-launch support"
] 