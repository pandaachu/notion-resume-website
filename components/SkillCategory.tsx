interface SkillCategoryProps {
  category: string;
  skills: Skill[];
  getLevelColor: (level: string) => string;
  getLevelWidth: (level: string) => string;
}

function SkillCategory({ category, skills, getLevelColor, getLevelWidth }: SkillCategoryProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h4 className="mb-4 text-lg font-semibold text-gray-900">{category}</h4>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
              <span className="text-xs text-gray-500">{skill.level}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${getLevelColor(skill.level)}`}
                style={{ width: getLevelWidth(skill.level) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
