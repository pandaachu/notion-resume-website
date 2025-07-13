import { Skill } from '../types/notion';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">技能</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {category}
            </h4>
            <div className="space-y-3">
              {categorySkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {skill.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {skill.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getLevelColor(skill.level)}`}
                      style={{
                        width: skill.level === 'Expert' ? '100%' : 
                               skill.level === 'Advanced' ? '80%' :
                               skill.level === 'Intermediate' ? '60%' : '40%'
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