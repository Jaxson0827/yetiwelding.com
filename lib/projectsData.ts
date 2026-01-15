export interface Project {
  id: string;
  title?: string; // Made optional
  category: string;
  image: string;
  video?: string; // Optional video URL for hover effect
  materials?: string[]; // For stats dashboard
  year?: number; // For stats dashboard
  slug?: string; // for future detail pages
  description?: string; // Project description
  client?: string; // Client name
  location?: string; // Project location
  completionDate?: string; // Completion date
}

export const categories = [
  'All',
  'Railing',
  'Monument Structures',
  'Structural',
  'Miscellaneous',
  'Stairs',
  'Shade Structures',
] as const;

export type Category = typeof categories[number];

// Sample projects data - can be expanded later
export const projects: Project[] = [
  {
    id: '12',
    category: 'Miscellaneous',
    image: '/projects/photo1.JPG',
  },
  {
    id: '13',
    category: 'Miscellaneous',
    image: '/projects/photo2.JPG',
  },
  {
    id: '14',
    category: 'Miscellaneous',
    image: '/projects/photo3.JPG',
  },
  {
    id: '15',
    category: 'Miscellaneous',
    image: '/projects/photo4.JPG',
  },
  {
    id: '16',
    category: 'Miscellaneous',
    image: '/projects/photo5.jpg',
  },
  {
    id: '17',
    category: 'Miscellaneous',
    image: '/projects/photo6.jpg',
  },
  {
    id: '18',
    category: 'Miscellaneous',
    image: '/projects/photo7.jpg',
  },
  {
    id: '19',
    category: 'Miscellaneous',
    image: '/projects/photo8.jpg',
  },
  {
    id: '20',
    category: 'Miscellaneous',
    image: '/projects/photo9.jpg',
  },
  {
    id: '21',
    category: 'Miscellaneous',
    image: '/projects/photo10.jpg',
  },
  {
    id: '22',
    category: 'Miscellaneous',
    image: '/projects/photo11.jpg',
  },
  {
    id: '23',
    category: 'Miscellaneous',
    image: '/projects/photo12.jpg',
  },
  {
    id: '24',
    category: 'Miscellaneous',
    image: '/projects/photo13.jpg',
  },
  {
    id: '25',
    category: 'Miscellaneous',
    image: '/projects/photo14.JPG',
  },
  {
    id: '26',
    category: 'Miscellaneous',
    image: '/projects/photo15.JPG',
  },
  {
    id: '27',
    category: 'Miscellaneous',
    image: '/projects/photo16.JPG',
  },
  {
    id: '28',
    category: 'Miscellaneous',
    image: '/projects/photo17.JPG',
  },
  {
    id: '29',
    category: 'Miscellaneous',
    image: '/projects/photo18.JPG',
  },
  {
    id: '30',
    category: 'Miscellaneous',
    image: '/projects/photo19.JPG',
  },
  {
    id: '31',
    category: 'Miscellaneous',
    image: '/projects/photo20.JPG',
  },
  {
    id: '32',
    category: 'Miscellaneous',
    image: '/projects/photo21.jpg',
  },
  {
    id: '33',
    category: 'Miscellaneous',
    image: '/projects/photo22.jpg',
  },
  {
    id: '34',
    category: 'Miscellaneous',
    image: '/projects/photo23.jpg',
  },
  {
    id: '35',
    category: 'Miscellaneous',
    image: '/projects/photo24.jpg',
  },
  {
    id: '36',
    category: 'Miscellaneous',
    image: '/projects/photo25.jpg',
  },
  {
    id: '38',
    category: 'Miscellaneous',
    image: '/projects/photo26.jpg',
  },
];

// Helper function to get all unique materials from projects
export function getAllMaterials(projects: Project[]): string[] {
  const materialsSet = new Set<string>();
  projects.forEach((project) => {
    project.materials?.forEach((material) => materialsSet.add(material));
  });
  return Array.from(materialsSet);
}

// Helper function to get all unique categories from projects
export function getAllCategories(projects: Project[]): string[] {
  const categoriesSet = new Set<string>();
  projects.forEach((project) => {
    categoriesSet.add(project.category);
  });
  return Array.from(categoriesSet);
}

