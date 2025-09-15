'use client';

import { Skill } from '@/types/notion';
import { useSkillLevel } from '@/hooks';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const { groupSkillsByCategory, getLevelColor, getLevelWidth } = useSkillLevel();

  if (skills.length === 0) return null;

  const groupedSkills = groupSkillsByCategory(skills);

  return (
    <section className="mb-12">
      <h3 className="mb-6 text-2xl font-bold text-gray-900">技能</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <SkillCategory
            key={category}
            category={category}
            skills={categorySkills}
            getLevelColor={getLevelColor}
            getLevelWidth={getLevelWidth}
          />
        ))}
      </div>
    </section>
  );
}
