export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  {
    question: 'What areas do you serve?',
    answer:
      'We primarily serve the Utah area, including Salt Lake City, Provo, Springville, and surrounding communities. We also take on projects throughout the Intermountain West region. Contact us to discuss your location and project needs.',
    category: 'General',
  },
  {
    question: 'How long has Yeti Welding been in business?',
    answer:
      'Yeti Welding was founded in 2016 and has been serving customers with exceptional welding and fabrication services ever since. Our commitment to quality craftsmanship has made us a trusted name in the industry.',
    category: 'General',
  },
  {
    question: 'How do I get a quote?',
    answer:
      'You can request a quote through our contact form, by phone, or by email. For accurate pricing, please provide details about your project including dimensions, materials, and any specific requirements. We typically provide quotes within 24-48 hours.',
    category: 'Pricing & Quotes',
  },
  {
    question: 'What factors affect pricing?',
    answer:
      'Pricing depends on several factors including project complexity, materials required, quantity, finish options, and timeline. Custom fabrication projects are priced individually based on your specific needs. We provide transparent, detailed quotes with no hidden fees.',
    category: 'Pricing & Quotes',
  },
  {
    question: 'Do you offer payment plans?',
    answer:
      'Payment terms vary by project size and scope. For larger projects, we can discuss payment schedules. Typically, we require a deposit to begin work, with the balance due upon completion. Contact us to discuss payment options for your specific project.',
    category: 'Pricing & Quotes',
  },
  {
    question: 'What types of welding do you specialize in?',
    answer:
      'We specialize in structural welding, custom fabrication, and ornamental work. Our team is experienced with MIG, TIG, and stick welding techniques, working with various metals including steel, aluminum, and stainless steel.',
    category: 'Services',
  },
  {
    question: 'Can you work from my designs or drawings?',
    answer:
      "Absolutely! We can work from your existing designs, drawings, or specifications. If you need design assistance, we can also help develop your concept from initial ideas to finished product. Bring us your vision and we'll make it a reality.",
    category: 'Services',
  },
  {
    question: 'Do you provide installation services?',
    answer:
      'Yes, we offer installation services for many of our projects. Installation availability depends on the project type and location. We can discuss installation options when you request a quote for your project.',
    category: 'Services',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      "Project timelines vary based on complexity, size, and current workload. Custom fabrication projects typically take 2-6 weeks. We'll provide an estimated timeline when you request a quote.",
    category: 'Project Timeline',
  },
  {
    question: 'Can you accommodate rush orders?',
    answer:
      'We understand that sometimes projects have tight deadlines. We do our best to accommodate rush orders when possible, though rush fees may apply. Contact us as soon as possible to discuss your timeline and we\'ll work with you to find a solution.',
    category: 'Project Timeline',
  },
  {
    question: 'Will I receive updates during the project?',
    answer:
      "Yes, we believe in keeping our customers informed. We'll provide updates at key milestones and are always available to answer questions about your project's progress. Communication is important to us.",
    category: 'Project Timeline',
  },
  {
    question: 'What materials do you work with?',
    answer:
      'We work with a wide range of materials including various grades of steel, stainless steel, aluminum, and other metals. We can help you select the best material for your project based on your needs, budget, and application requirements.',
    category: 'Materials & Specifications',
  },
  {
    question: 'Do you offer different finish options?',
    answer:
      'Yes, we offer various finish options including powder coating, paint, and natural finishes. We can match existing finishes or help you choose the best option for your project. Discuss your finish preferences when requesting a quote.',
    category: 'Materials & Specifications',
  },
  {
    question: 'Can you match existing metalwork?',
    answer:
      "We can often match existing metalwork in terms of style, finish, and specifications. For the best results, provide photos or samples of what you'd like to match, and we'll work to create a cohesive look.",
    category: 'Materials & Specifications',
  },
];

export const faqCategories = [
  'All',
  'General',
  'Pricing & Quotes',
  'Services',
  'Project Timeline',
  'Materials & Specifications',
];
