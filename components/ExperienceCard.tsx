'use client';

import { Experience } from '@/types/notion';
import { useExperienceDetails, useFormattedDate } from '@/hooks';
import ExperienceDetailRenderer from './ExperienceDetailRenderer';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const { isExpanded, toggleExperience } = useExperienceDetails();
  const { formatDateRange } = useFormattedDate();
  const showDetails = isExpanded(experience.id);

  return (
    <div className="mb-8 border-l-4 border-blue-500 pl-6">
      <div className="mb-3 flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <h4 className="text-xl font-semibold text-gray-900">{experience.position}</h4>
          <p className="text-lg text-gray-600">{experience.company}</p>
        </div>
        <span className="mt-1 text-sm text-gray-500 md:mt-0">
          {formatDateRange(experience.startDate, experience.endDate, experience.current)}
        </span>
      </div>

      {experience.description && <p className="mb-3 text-gray-700">{experience.description}</p>}

      {experience.technologies.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {experience.technologies.map((tech, index) => (
            <span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {tech}
            </span>
          ))}
        </div>
      )}

      {experience.hasDetailPage && experience.detailPageContent && (
        <div className="mt-4">
          <button
            onClick={() => toggleExperience(experience.id)}
            className="flex items-center space-x-2 text-blue-600 transition-colors hover:text-blue-800"
          >
            <span className="text-sm font-medium">{showDetails ? '收起詳細內容' : '查看詳細內容'}</span>
            <span className={`transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showDetails && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h5 className="text-md mb-3 font-semibold text-gray-900">📋 詳細工作內容</h5>
              <ExperienceDetailRenderer blocks={experience.detailPageContent} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
