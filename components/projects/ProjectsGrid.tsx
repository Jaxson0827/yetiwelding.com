'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/projectsData';
import ProjectCard from './ProjectCard';

interface ProjectsGridProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
}

export default function ProjectsGrid({ projects, onProjectSelect }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            No Projects Found
          </h3>
          <p className="text-white/70 text-lg">
            Try selecting a different category or adjusting your search
          </p>
        </motion.div>
      </div>
    );
  }

  // Split projects into featured (first 3) and regular
  const featuredProjects = projects.slice(0, 3);
  const regularProjects = projects.slice(3);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={projects.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Featured Projects Grid (First 3 - Special Layout) */}
          {featuredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
              {featuredProjects.map((project, index) => {
                // First 2 projects: side-by-side, each spanning 2 columns
                // Third project: full width, spanning 4 columns
                let colSpan = '';
                let sizeVariant: 'large' | 'extraLarge' | undefined = undefined;
                
                if (index < 2) {
                  colSpan = 'lg:col-span-2';
                  sizeVariant = 'large';
                } else if (index === 2) {
                  colSpan = 'lg:col-span-4';
                  sizeVariant = 'extraLarge';
                }
                
                return (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index}
                    colSpan={colSpan}
                    sizeVariant={sizeVariant}
                    onSelect={() => onProjectSelect?.(project)}
                  />
                );
              })}
            </div>
          )}

          {/* Regular Projects Grid */}
          {regularProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {regularProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={featuredProjects.length + index}
                  onSelect={() => onProjectSelect?.(project)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

