export function useSkillLevel() {
  const getLevelColor = (level: string): string => {
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

  const getLevelWidth = (level: string): string => {
    switch (level) {
      case 'Expert':
        return '100%';
      case 'Advanced':
        return '80%';
      case 'Intermediate':
        return '60%';
      case 'Beginner':
        return '40%';
      default:
        return '40%';
    }
  };

  const groupSkillsByCategory = <T extends { category: string }>(skills: T[]) => {
    return skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, T[]>,
    );
  };

  return {
    getLevelColor,
    getLevelWidth,
    groupSkillsByCategory,
  };
}
