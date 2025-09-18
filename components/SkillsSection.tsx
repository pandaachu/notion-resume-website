import { Skill } from '../types/notion';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-500';
      case 'Advanced':
        return 'bg-blue-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      case 'Beginner':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section className="mb-12">
      <h3 className="mb-6 text-2xl font-bold">技能</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="rounded-lg bg-white p-6 shadow-md">
            <h4 className="mb-4 text-lg font-semibold">{category}</h4>
            <div className="space-y-3">
              {categorySkills.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs">{skill.level}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${getLevelColor(skill.level)}`}
                      style={{
                        width:
                          skill.level === 'Expert'
                            ? '100%'
                            : skill.level === 'Advanced'
                              ? '80%'
                              : skill.level === 'Intermediate'
                                ? '60%'
                                : '40%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
