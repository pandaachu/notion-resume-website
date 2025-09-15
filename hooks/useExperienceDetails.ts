import { useState } from 'react';
import { Experience, NotionBlock } from '@/types/notion';

interface UseExperienceDetailsReturn {
  expandedExperiences: Set<string>;
  toggleExperience: (id: string) => void;
  isExpanded: (id: string) => boolean;
}

export function useExperienceDetails(): UseExperienceDetailsReturn {
  const [expandedExperiences, setExpandedExperiences] = useState<Set<string>>(new Set());

  const toggleExperience = (id: string) => {
    setExpandedExperiences((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isExpanded = (id: string) => expandedExperiences.has(id);

  return {
    expandedExperiences,
    toggleExperience,
    isExpanded,
  };
}
