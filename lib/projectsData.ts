export interface Project {
  id: string;
  title?: string; // Made optional
  categories: ProjectCategory[];
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
  'Gates',
  'Railing',
  'Monument Structures',
  'Stairs',
  'Shade Structures',
  'Structural Steel',
] as const;

export type Category = typeof categories[number];
export type ProjectCategory = Exclude<Category, 'All'>;

// Sample projects data - can be expanded later
export const projects: Project[] = [
  {
    id: '25',
    categories: ['Shade Structures'],
    image: '/projects/photo14.JPG',
  },
  {
    id: '12',
    categories: ['Stairs', 'Railing'],
    image: '/projects/photo1.JPG',
  },
  {
    id: '30',
    categories: ['Stairs', 'Railing'],
    image: '/projects/photo19.JPG',
  },
  {
    id: '13',
    categories: ['Gates'],
    image: '/projects/photo2.JPG',
  },
  {
    id: '14',
    categories: ['Gates'],
    image: '/projects/photo3.JPG',
  },
  {
    id: '15',
    categories: ['Gates'],
    image: '/projects/photo4.JPG',
  },
  {
    id: '16',
    categories: ['Stairs', 'Railing'],
    image: '/projects/photo5.jpg',
  },
  {
    id: '17',
    categories: ['Gates'],
    image: '/projects/photo6.jpg',
  },
  {
    id: '18',
    categories: ['Shade Structures'],
    image: '/projects/photo7.jpg',
  },
  {
    id: '19',
    categories: ['Shade Structures', 'Monument Structures'],
    image: '/projects/photo8.jpg',
  },
  {
    id: '20',
    categories: ['Gates'],
    image: '/projects/photo9.jpg',
  },
  {
    id: '21',
    categories: ['Monument Structures', 'Shade Structures'],
    image: '/projects/photo10.jpg',
  },
  {
    id: '22',
    categories: ['Structural Steel'],
    image: '/projects/photo11.jpg',
  },
  {
    id: '23',
    categories: ['Railing'],
    image: '/projects/photo12.jpg',
  },
  {
    id: '24',
    categories: ['Railing'],
    image: '/projects/photo13.jpg',
  },
  {
    id: '26',
    categories: ['Monument Structures'],
    image: '/projects/photo15.JPG',
  },
  {
    id: '27',
    categories: ['Railing'],
    image: '/projects/photo16.JPG',
  },
  {
    id: '29',
    categories: ['Stairs', 'Railing'],
    image: '/projects/photo18.JPG',
  },
  {
    id: '31',
    categories: ['Railing'],
    image: '/projects/photo20.JPG',
  },
  {
    id: '32',
    categories: ['Railing'],
    image: '/projects/photo21.jpg',
  },
  {
    id: '33',
    categories: ['Railing'],
    image: '/projects/photo22.jpg',
  },
  {
    id: '34',
    categories: ['Shade Structures'],
    image: '/projects/photo23.jpg',
  },
  {
    id: '35',
    categories: ['Railing'],
    image: '/projects/photo24.jpg',
  },
  {
    id: '36',
    categories: ['Railing'],
    image: '/projects/photo25.jpg',
  },
  {
    id: '38',
    categories: ['Railing'],
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
    project.categories.forEach((category) => categoriesSet.add(category));
  });
  return Array.from(categoriesSet);
}

