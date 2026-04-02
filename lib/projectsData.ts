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
  objectPosition?: string; // Override crop position (e.g. "center 40%" to show more top/bottom)
  imageZoomOut?: number; // Show more of image vertically (e.g. 0.1 = 10% more visible) while still filling
}

export const categories = [
  'All',
  'Gates',
  'Railing',
  'Monument Structures',
  'Stairs',
  'Shade Structures',
  'Structural Steel',
  'Uncategorized', // Hidden - used for projects that only show when "All" is selected
] as const;

export type Category = typeof categories[number];
export type ProjectCategory = Exclude<Category, 'All'>;

// Projects data - all 47 images from public/projects folder, sorted by photo number
export const projects: Project[] = [
  { id: '1', categories: ['Shade Structures', 'Monument Structures'], image: '/projects/photo1.JPG' },
  { id: '18', categories: ['Monument Structures'], image: '/projects/photo18.JPG' },
  { id: '15', categories: ['Monument Structures'], image: '/projects/photo15.JPG', imageZoomOut: 0.1 },
  { id: '8', categories: ['Shade Structures', 'Monument Structures'], image: '/projects/photo8.jpg' },
  { id: '14', categories: ['Shade Structures'], image: '/projects/photo14.JPG' },
  { id: '40', categories: ['Stairs', 'Railing'], image: '/projects/photo40.jpg' },
  { id: '30', categories: ['Railing'], image: '/projects/photo30.jpg' },
  { id: '39', categories: ['Uncategorized'], image: '/projects/photo39.jpg' },
  { id: '23', categories: ['Shade Structures'], image: '/projects/photo23.jpg' },
  { id: '19', categories: ['Stairs', 'Railing'], image: '/projects/photo19.JPG' },
  { id: '21', categories: ['Stairs', 'Railing'], image: '/projects/photo21.jpg' },
  { id: '35', categories: ['Gates'], image: '/projects/photo35.jpg' },
  { id: '38', categories: ['Structural Steel'], image: '/projects/photo38.jpg' },
  { id: '41', categories: ['Railing'], image: '/projects/photo41.jpg' },
  { id: '22', categories: ['Railing'], image: '/projects/photo22.jpg' },
  { id: '2', categories: ['Gates'], image: '/projects/photo2.JPG' },
  { id: '44', categories: ['Shade Structures'], image: '/projects/photo44.jpg' },
  { id: '16', categories: ['Railing'], image: '/projects/photo16.JPG' },
  { id: '7', categories: ['Shade Structures'], image: '/projects/photo7.jpg' },
  { id: '11', categories: ['Structural Steel'], image: '/projects/photo11.jpg' },
  { id: '6', categories: ['Gates'], image: '/projects/photo6.jpg' },
  { id: '20', categories: ['Railing'], image: '/projects/photo20.JPG' },
  { id: '24', categories: ['Railing'], image: '/projects/photo24.jpg' },
  { id: '25', categories: ['Railing'], image: '/projects/photo25.jpg' },
  { id: '26', categories: ['Railing'], image: '/projects/photo26.jpg' },
  { id: '27', categories: ['Stairs', 'Railing'], image: '/projects/photo27.jpg' },
  { id: '28', categories: ['Structural Steel'], image: '/projects/photo28.jpg' },
  { id: '29', categories: ['Uncategorized'], image: '/projects/photo29.jpg' },
  { id: '4', categories: ['Gates'], image: '/projects/photo4.JPG' },
  { id: '5', categories: ['Stairs', 'Railing'], image: '/projects/photo5.jpg' },
  { id: '31', categories: ['Stairs', 'Railing'], image: '/projects/photo31.jpg' },
  { id: '32', categories: ['Railing'], image: '/projects/photo32.jpg' },
  { id: '33', categories: ['Railing'], image: '/projects/photo33.jpg' },
  { id: '34', categories: ['Railing'], image: '/projects/photo34.jpg' },
  { id: '9', categories: ['Gates'], image: '/projects/photo9.jpg' },
  { id: '36', categories: ['Stairs', 'Railing'], image: '/projects/photo36.jpg' },
  { id: '37', categories: ['Gates'], image: '/projects/photo37.jpg' },
  { id: '12', categories: ['Railing'], image: '/projects/photo12.jpg' },
  { id: '13', categories: ['Railing'], image: '/projects/photo13.jpg' },
  { id: '42', categories: ['Shade Structures'], image: '/projects/photo42.jpg' },
  { id: '43', categories: ['Railing'], image: '/projects/photo43.jpg' },
  { id: '3', categories: ['Gates'], image: '/projects/photo3.JPG' },
  { id: '45', categories: ['Uncategorized'], image: '/projects/photo45.jpg' },
  { id: '46', categories: ['Uncategorized'], image: '/projects/photo46.jpg' },
  { id: '47', categories: ['Uncategorized'], image: '/projects/photo47.jpg' },
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

