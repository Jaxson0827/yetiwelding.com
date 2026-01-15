import React from 'react';

// Company Statistics
export interface CompanyStats {
  foundingYear: number;
  yearsInBusiness: number;
  projectsCompleted: number;
  teamMembers: number;
  certifications: string[];
}

export const companyStats: CompanyStats = {
  foundingYear: 1984,
  yearsInBusiness: 40,
  projectsCompleted: 10000,
  teamMembers: 15,
  certifications: [
    'AWS Certified',
    'OSHA Compliant',
    'State Licensed',
  ],
};

// Mission Content
export interface MissionContent {
  title: string;
  primaryStatement: string;
  supportingStatement: string;
}

export const missionContent: MissionContent = {
  title: 'OUR MISSION',
  primaryStatement: 'To deliver exceptional welding and fabrication services with uncompromising quality, precision, and craftsmanship that exceeds expectations and builds lasting partnerships.',
  supportingStatement: 'With decades of combined experience, we bring traditional techniques and modern innovation together to create solutions that stand the test of time. Every project is approached with the same dedication to excellence that has defined our work from day one.',
};

// Team Members
export interface TeamMember {
  name: string;
  title: string;
  image?: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
}

export const teamMembers: TeamMember[] = [
  // Template structure - to be filled in
  { name: 'Name', title: 'Title', image: '/path/to/image.jpg', linkedinUrl: 'https://linkedin.com/in/...' },
  // Add more as needed
];

// Vision Content
export interface VisionContent {
  title: string;
  statement: string;
}

export const visionContent: VisionContent = {
  title: 'OUR VISION',
  statement: 'To be the premier welding and fabrication company in our region, recognized for exceptional craftsmanship, innovative solutions, and unwavering commitment to excellence. We envision a future where traditional expertise and modern innovation continue to drive our success, building lasting relationships with clients and maintaining our legacy of quality for generations to come.',
};

// Values
export interface Value {
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

export const values: Value[] = [
  {
    title: 'Quality',
    tagline: 'DELIVERING BUILDINGS\nTHAT EXCEED THE\nEXPECTATIONS OF OUR\nCLIENTS',
    description: 'Uncompromising standards in materials, workmanship, and attention to detail. Every project meets the highest quality standards.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'Integrity',
    tagline: 'DOING THE RIGHT\nTHING WHEN NO ONE IS\nLOOKING.',
    description: 'Honest communication, transparent processes, and commitments we stand behind. Your trust is our foundation.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
  },
  {
    title: 'Craftsmanship',
    tagline: 'USING OUR TALENTS\nAND EXPERTISE TO\nTRANSFORM OUR\nCLIENTS VISION INTO\nREALITY',
    description: 'Every weld, every cut, every detail executed with precision and artistry. We take pride in work that speaks for itself.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Experience',
    tagline: 'INVESTING IN OUR\nCOMMUNITIES\nTHROUGH THE EFFORTS\nOF OUR EMPLOYEE\nOWNERS',
    description: 'Decades of knowledge passed down through generations. The wisdom that comes only from years in the trade.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Innovation',
    tagline: 'LEVERAGING\nTECHNOLOGY IN\nDESIGN AND\nCONSTRUCTION TO\nDELIVER CREATIVE\nSOLUTIONS',
    description: 'Blending time-tested techniques with modern technology to deliver solutions that are both reliable and cutting-edge.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Dedication',
    tagline: 'IT IS NOT A QUESTION\nIT IS NOT AN\nAFTERTHOUGHT\nIT IS OUR CULTURE',
    description: 'Committed to seeing every project through from concept to completion. Your success is our success.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

// Philosophy Items
export interface PhilosophyItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageSide: 'left' | 'right';
  year?: number;
}

export const philosophyItems: PhilosophyItem[] = [
  {
    title: 'Knowledge Transfer',
    imageSide: 'left',
    image: '/homepage/about.JPG',
    imageAlt: 'Yeti Welding founder mentoring the next generation of welders, demonstrating the company\'s commitment to passing down 40+ years of metal fabrication expertise and craftsmanship traditions',
    description: 'This photo tells our story—founder passing down knowledge to the next generation. With decades of experience and a legacy built on craftsmanship, we deliver results that speak for themselves. The tradition of mentorship and continuous learning ensures that every project benefits from accumulated wisdom.',
    year: 1984,
  },
  {
    title: 'Precision in Practice',
    imageSide: 'right',
    image: '/homepage/hero.JPG',
    imageAlt: 'Yeti Welding workshop showcasing professional metal fabrication equipment and precision craftsmanship in action',
    description: 'Every weld matters. Every measurement counts. Our approach combines time-tested techniques with meticulous attention to detail. We believe that quality isn\'t achieved through shortcuts—it comes from respecting the craft and putting in the work that excellence demands.',
  },
];

// Timeline Items
export interface TimelineItem {
  year: number;
  title: string;
  description: string;
  category: 'founding' | 'growth' | 'achievement' | 'milestone';
  image?: string;
}

export const timelineItems: TimelineItem[] = [
  {
    year: 1984,
    title: 'The Beginning',
    description: 'Yeti Welding was founded on a simple principle: do the work right, every time. What started as a commitment to quality craftsmanship has grown into a legacy that spans decades.',
    category: 'founding',
  },
  {
    year: 1995,
    title: 'Expanding Capabilities',
    description: 'After a decade of steady growth, we expanded our facilities and capabilities, taking on larger commercial and industrial projects. Our reputation for reliability and precision began to spread throughout the region.',
    category: 'growth',
  },
  {
    year: 2005,
    title: 'Certification Excellence',
    description: 'Achieved AWS (American Welding Society) certification and maintained OSHA compliance standards. This milestone reinforced our commitment to industry-leading quality and safety.',
    category: 'achievement',
  },
  {
    year: 2015,
    title: 'Generational Transition',
    description: 'The next generation joined the team, bringing fresh perspectives while honoring traditional craftsmanship. This marked a new era of innovation combined with time-tested expertise.',
    category: 'milestone',
  },
  {
    year: 2020,
    title: 'Digital Innovation',
    description: 'Embracing modern technology while maintaining our core values. We integrated advanced fabrication techniques and digital tools to enhance precision and efficiency without compromising quality.',
    category: 'growth',
  },
  {
    year: 2024,
    title: 'The Way Forward',
    description: 'Today, we continue to honor our founding principles while embracing innovation. The knowledge passed down through generations informs every decision, every weld, every project. The Way of the Yeti endures.',
    category: 'milestone',
  },
];

// Helper function to get founding year
export function getFoundingYear(): number {
  return companyStats.foundingYear;
}

// Helper function to get years in business
export function getYearsInBusiness(): number {
  return companyStats.yearsInBusiness;
}




