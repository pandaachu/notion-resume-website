'use client';

import { Experience } from '@/types/notion';
import { useExperienceDetails, useFormattedDate } from '@/hooks';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) return null;

  return (
    <section className="mb-12">
      <h3 className="mb-6 text-2xl font-bold text-gray-900">工作經驗</h3>
      <div className="space-y-6">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </section>
  );
}
