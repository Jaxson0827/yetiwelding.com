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
  foundingYear: 2016,
  yearsInBusiness: 10,
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
  supportingStatement: 'Founded in 2016, we bring disciplined craftsmanship and modern fabrication capabilities together to create solutions that stand the test of time. Every project is approached with the same dedication to excellence that has defined our work from day one.',
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
    image: '/about/knowledge_transfer.jpeg',
    imageAlt: 'Yeti Welding founder mentoring the next generation of welders, demonstrating the company\'s commitment to craftsmanship and knowledge transfer',
    description: 'This photo tells our story—founder passing down knowledge to the next generation. Founded in 2016, we deliver results that speak for themselves through disciplined work, problem-solving, and pride in the craft.',
    year: 2016,
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
    year: 2008,
    title: 'Farm-Built Foundations',
    description:
      'Before Yeti Welding had a name, it was forged on a working farm. Dillon learned to weld fixing broken equipment with an old 1971 Miller machine and a Geneva Steel hood. That early hands-on experience built the work ethic and problem-solving mindset the company still runs on today.',
    category: 'founding',
  },
  {
    year: 2012,
    title: 'Field-Tested Experience',
    description:
      'After high school welding classes sharpened his skills, Dillon hit the road working pipeline jobs. The field became the real classroom. Long days, real weld tests, and production deadlines refined his craft. Those years built confidence, discipline, and the ability to perform under pressure.',
    category: 'growth',
  },
  {
    year: 2016,
    title: 'Yeti Welding Begins',
    description:
      'Yeti Welding officially launched with a two-wheel-drive Ford Ranger, a 1971 Miller welder, and zero outside funding. The early focus was ornamental iron and residential railings — building one tool, one client, and one project at a time. The company was built debt-free from day one.',
    category: 'founding',
  },
  {
    year: 2017,
    title: 'Credibility Through Content',
    description:
      'As a young contractor trying to win work, Dillon turned to social media to prove capability. Projects were documented, shared, and showcased publicly. Instead of convincing clients in person, Yeti Welding let the work speak online — building trust, visibility, and momentum through consistent content.',
    category: 'achievement',
  },
  {
    year: 2019,
    title: 'Defining Projects',
    description:
      'Yeti Welding took on bold, unconventional work — including large commercial projects built from modified shipping containers. Complex builds that others avoided became opportunities to grow skill, reputation, and confidence. The company began establishing itself as the team willing to solve difficult problems.',
    category: 'milestone',
  },
  {
    year: 2025,
    title: 'Major Expansion',
    description:
      'In 2025, Yeti Welding entered a new chapter — moving into a significantly larger shop, tripling the size of the team, expanding equipment and fleet capacity, and taking on larger structural and commercial projects. What started with one truck has grown into a full-scale operation built for long-term growth.',
    category: 'growth',
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




