import { Project } from '../types/notion';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import PageDetailRenderer from './PageDetailRenderer';
interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection2({ projects }: ProjectsSectionProps) {
  return (
    <section className="section-container mb-12">
      <h3 className="mb-6 text-2xl font-bold">專案作品</h3>
      <div>
        {projects.map((project) => (
          <div key={project.id} className="mb-10">
            <h3 className="mb-8 border-b border-white pb-4 text-[20px]">{project.name}</h3>
            {project.image && (
              <img className="h-[500px] w-full rounded-xl object-cover" src={project.image} alt={project.name} />
            )}
            <div className="">
              <p className="mb-4">{project.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="r mt-4">
                <h5 className="text-md mb-3">📋 詳細工作內容</h5>
                <PageDetailRenderer blocks={project.detailPageContent} />
              </div>

              <div className="flex space-x-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover: flex items-center"
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
