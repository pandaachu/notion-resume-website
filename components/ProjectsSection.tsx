import { Project } from '../types/notion';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className="mb-12" data-aos="fade-left">
      <h3 className="mb-6 text-2xl font-bold text-gray-900">專案作品</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="overflow-hidden rounded-lg bg-white shadow-md">
            {project.image && <img className="h-48 w-full object-cover" src={project.image} alt={project.name} />}
            <div className="p-6">
              <h4 className="mb-2 text-xl font-semibold text-gray-900">{project.name}</h4>
              <p className="mb-4 text-gray-700">{project.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <CodeBracketIcon className="mr-1 h-4 w-4" />
                    程式碼
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ArrowTopRightOnSquareIcon className="mr-1 h-4 w-4" />
                    即時預覽
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
