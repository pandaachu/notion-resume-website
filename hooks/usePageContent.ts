import { useState } from 'react';
import { NotionBlock } from '@/types/notion';

interface UsePageContentReturn {
  expandedToggles: Set<string>;
  toggleContent: (id: string) => void;
  isToggleExpanded: (id: string) => boolean;
  getSpecialToggleType: (title: string) => string | null;
  getToggleContent: (block: NotionBlock) => string;
}

export function usePageContent(): UsePageContentReturn {
  const [expandedToggles, setExpandedToggles] = useState<Set<string>>(new Set());

  const toggleContent = (id: string) => {
    setExpandedToggles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isToggleExpanded = (id: string) => expandedToggles.has(id);

  const getSpecialToggleType = (toggleTitle: string): string | null => {
    const title = toggleTitle.toLowerCase().trim();
    const cleanTitle = title.replace(/[📖⭐⚡💬🌳🏆🎯💡🤝📈🎨💝]/g, '').trim();

    if (cleanTitle.includes('個人使用說明書') || cleanTitle.includes('使用說明書')) return 'user_manual';
    if (cleanTitle.includes('核心價值') || cleanTitle.includes('價值觀')) return 'core_values';
    if (cleanTitle.includes('工作風格') || cleanTitle.includes('工作方式')) return 'work_style';
    if (cleanTitle.includes('溝通偏好') || cleanTitle.includes('溝通方式')) return 'communication';
    if (cleanTitle.includes('技能樹') || cleanTitle.includes('技能發展')) return 'skill_tree';
    if (cleanTitle.includes('成就解鎖') || cleanTitle.includes('重要成就')) return 'achievements';
    if (cleanTitle.includes('興趣愛好') || cleanTitle.includes('愛好')) return 'hobbies';
    if (cleanTitle.includes('學習歷程') || cleanTitle.includes('成長軌跡')) return 'learning_journey';

    return null;
  };

  const getToggleContent = (block: NotionBlock): string => {
    if (block.toggle?.children && block.toggle.children.length > 0) {
      return block.toggle.children
        .map((child) => child.content)
        .filter((content) => content.trim() !== '')
        .join('\n\n');
    }

    if (block.children && block.children.length > 0) {
      return block.children
        .map((child) => child.content)
        .filter((content) => content.trim() !== '')
        .join('\n\n');
    }

    return '尚未設定內容，請在 Notion 中編輯此 Toggle 的子內容。';
  };

  return {
    expandedToggles,
    toggleContent,
    isToggleExpanded,
    getSpecialToggleType,
    getToggleContent,
  };
}
