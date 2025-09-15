import { Project } from '../types/notion';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsDetail({ projects }: ProjectsSectionProps) {
  return (
    <section className="mb-12">
      <h3 className="mb-6 text-2xl font-bold">專案</h3>
    </section>
  );
}
