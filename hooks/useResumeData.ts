import { useState, useEffect, useCallback } from 'react';
import { ResumeData, PersonalInfo, Experience, Education, Project, Skill } from '@/types/notion';
import { browserCache, CACHE_KEYS } from '@/lib/cache/notionCache';

/**
 * 資料載入狀態
 */
interface LoadingState {
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
}

/**
 * 履歷資料 Hook - 管理所有履歷資料的載入與快取
 */
export function useResumeData() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [state, setState] = useState<LoadingState>({
    isLoading: true,
    isValidating: false,
    error: null,
  });

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        // 如果不強制刷新，先檢查瀏覽器快取
        if (!forceRefresh) {
          const cached = browserCache.get<ResumeData>(CACHE_KEYS.ALL_RESUME_DATA);
          if (cached) {
            setData(cached);
            setState((prev) => ({ ...prev, isLoading: false }));
            return;
          }
        }

        setState((prev) => ({
          ...prev,
          isLoading: !data,
          isValidating: !!data,
          error: null,
        }));

        const response = await fetch('/api/resume');
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }

        const resumeData = await response.json();

        // 儲存到瀏覽器快取
        browserCache.set(CACHE_KEYS.ALL_RESUME_DATA, resumeData);

        setData(resumeData);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isValidating: false,
        }));
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isValidating: false,
          error: error as Error,
        }));
      }
    },
    [data],
  );

  // 初次載入
  useEffect(() => {
    fetchData();
  }, []);

  // 重新整理資料
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    ...state,
    refresh,
  };
}

/**
 * 個人資訊 Hook
 */
export function usePersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 檢查快取
        const cached = browserCache.get<PersonalInfo>(CACHE_KEYS.PERSONAL_INFO);
        if (cached) {
          setPersonalInfo(cached);
          setIsLoading(false);
          return;
        }

        // 從 API 載入
        const response = await fetch('/api/resume/personal-info');
        const data = await response.json();

        browserCache.set(CACHE_KEYS.PERSONAL_INFO, data);
        setPersonalInfo(data);
      } catch (error) {
        console.error('Error loading personal info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { personalInfo, isLoading };
}

/**
 * 工作經驗 Hook
 */
export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        const cached = browserCache.get<Experience[]>(CACHE_KEYS.EXPERIENCES);
        if (cached) {
          setExperiences(cached);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/resume/experiences');
        const data = await response.json();

        browserCache.set(CACHE_KEYS.EXPERIENCES, data);
        setExperiences(data);
      } catch (error) {
        console.error('Error loading experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  return {
    experiences,
    isLoading,
    expandedIds,
    toggleExpanded,
    isExpanded: (id: string) => expandedIds.has(id),
  };
}

/**
 * 專案作品 Hook
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const cached = browserCache.get<Project[]>(CACHE_KEYS.PROJECTS);
        if (cached) {
          setProjects(cached);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/resume/projects');
        const data = await response.json();

        browserCache.set(CACHE_KEYS.PROJECTS, data);
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 過濾專案
  const filteredProjects = projects.filter((project) => {
    if (!filter) return true;
    return project.technologies.some((tech) => tech.toLowerCase().includes(filter.toLowerCase()));
  });

  return {
    projects: filteredProjects,
    allProjects: projects,
    isLoading,
    filter,
    setFilter,
  };
}

/**
 * 技能 Hook
 */
export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cached = browserCache.get<Skill[]>(CACHE_KEYS.SKILLS);
        if (cached) {
          setSkills(cached);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/resume/skills');
        const data = await response.json();

        browserCache.set(CACHE_KEYS.SKILLS, data);
        setSkills(data);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 分組技能
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

  // 取得所有分類
  const categories = Object.keys(groupedSkills);

  // 過濾技能
  const displaySkills = selectedCategory ? groupedSkills[selectedCategory] || [] : skills;

  return {
    skills: displaySkills,
    groupedSkills,
    categories,
    isLoading,
    selectedCategory,
    setSelectedCategory,
  };
}

/**
 * 載入狀態管理 Hook
 */
export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => {
      const newMap = new Map(prev);
      if (isLoading) {
        newMap.set(key, true);
      } else {
        newMap.delete(key);
      }
      return newMap;
    });
  }, []);

  const isAnyLoading = loadingStates.size > 0;
  const isLoading = (key: string) => loadingStates.has(key);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingKeys: Array.from(loadingStates.keys()),
  };
}
