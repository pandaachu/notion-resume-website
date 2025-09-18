// lib/notion/service.ts
import { Client } from '@notionhq/client';
import * as parser from './parser';
import { notionCache, CACHE_KEYS } from '../cache/notionCache';
import {
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
  Project,
  Skill,
  NotionBlock,
  PageContent,
} from '@/types/notion';

/**
 * 建立 Notion Client
 */
function createNotionClient(): Client {
  return new Client({
    auth: process.env.NOTION_TOKEN,
  });
}

/**
 * 取得資料庫設定
 */
function getDatabaseConfig() {
  const isMultiMode = !!process.env.NOTION_PERSONAL_INFO_DB;

  return {
    mode: isMultiMode ? 'multi' : ('single' as 'multi' | 'single'),
    databases: isMultiMode
      ? {
          personalInfo: process.env.NOTION_PERSONAL_INFO_DB,
          experience: process.env.NOTION_EXPERIENCE_DB,
          education: process.env.NOTION_EDUCATION_DB,
          projects: process.env.NOTION_PROJECTS_DB,
          skills: process.env.NOTION_SKILLS_DB,
        }
      : {
          singleDatabase: process.env.NOTION_DATABASE_ID,
        },
    pageId: process.env.NOTION_RESUME_PAGE_ID,
  };
}

// 共享的 client 和 config
const client = createNotionClient();
const config = getDatabaseConfig();

/**
 * 測試 Notion 連接
 */
export async function testConnection(): Promise<boolean> {
  try {
    if (config.mode === 'multi') {
      for (const [name, id] of Object.entries(config.databases)) {
        if (id) {
          await client.databases.retrieve({ database_id: id });
          console.log(`✅ ${name} database connected`);
        }
      }
    } else if ('singleDatabase' in config.databases && config.databases.singleDatabase) {
      await client.databases.retrieve({
        database_id: config.databases.singleDatabase,
      });
      console.log('✅ Single database connected');
    }
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

/**
 * 檢查頁面是否有子內容
 */
async function checkHasChildren(blockId: string): Promise<boolean> {
  try {
    const response = await client.blocks.children.list({
      block_id: blockId,
      page_size: 1,
    });
    return response.results.length > 0;
  } catch {
    return false;
  }
}

/**
 * 遞迴獲取所有 blocks
 */
async function getPageBlocks(blockId: string): Promise<NotionBlock[]> {
  try {
    const response = await client.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    });

    const blocks: NotionBlock[] = [];

    for (const block of response.results) {
      const parsedBlock = parser.parseBlock(block);

      // 如果有子 blocks，遞迴獲取
      if ((block as any).has_children) {
        parsedBlock.children = await getPageBlocks(block.id);

        // 特殊處理 toggle
        if (parsedBlock.type === 'toggle' && parsedBlock.toggle) {
          parsedBlock.toggle.children = parsedBlock.children;
        }
      }

      blocks.push(parsedBlock);
    }

    return blocks;
  } catch (error) {
    console.error(`Error fetching blocks for ${blockId}:`, error);
    return [];
  }
}

/**
 * 提取頁面標題
 */
function extractPageTitle(page: any): string {
  return (
    page.properties?.title?.title?.[0]?.text?.content || page.properties?.Name?.title?.[0]?.text?.content || '個人履歷'
  );
}

/**
 * 取得預設個人資訊
 */
function getDefaultPersonalInfo(): PersonalInfo {
  return {
    id: 'default',
    name: '請設定姓名',
    title: '請設定職稱',
    email: '',
    phone: '',
    location: '',
    summary: '請在 Notion 中設定個人簡介',
    avatar: '',
    linkedin: '',
    githubUrl: '',
    website: '',
  };
}

/**
 * 獲取個人資訊
 */
export async function getPersonalInfo(): Promise<PersonalInfo> {
  return notionCache.getOrSet(CACHE_KEYS.PERSONAL_INFO, async () => {
    try {
      let response;

      if (config.mode === 'multi' && 'personalInfo' in config.databases && config.databases.personalInfo) {
        response = await client.databases.query({
          database_id: config.databases.personalInfo,
          page_size: 1,
        });
      } else if ('singleDatabase' in config.databases && config.databases.singleDatabase) {
        response = await client.databases.query({
          database_id: config.databases.singleDatabase,
          filter: { property: 'Type', select: { equals: 'Personal Info' } },
          page_size: 1,
        });
      } else {
        throw new Error('No database configured');
      }

      if (!response?.results?.[0]) {
        throw new Error('No personal info found');
      }

      return parser.parsePersonalInfo(response.results[0]);
    } catch (error) {
      console.error('Error fetching personal info:', error);
      return getDefaultPersonalInfo();
    }
  });
}

/**
 * 獲取工作經驗
 */
export async function getExperiences(): Promise<Experience[]> {
  return notionCache.getOrSet(CACHE_KEYS.EXPERIENCES, async () => {
    try {
      let response;

      if (config.mode === 'multi' && 'experience' in config.databases && config.databases.experience) {
        response = await client.databases.query({
          database_id: config.databases.experience,
          sorts: [{ property: 'StartDate', direction: 'descending' }],
        });
      } else if ('singleDatabase' in config.databases && config.databases.singleDatabase) {
        response = await client.databases.query({
          database_id: config.databases.singleDatabase,
          filter: { property: 'Type', select: { equals: 'Experience' } },
          sorts: [{ property: 'StartDate', direction: 'descending' }],
        });
      } else {
        return [];
      }

      const experiences = await Promise.all(
        response.results.map(async (page: any) => {
          const experience = parser.parseExperience(page);

          // 檢查是否有詳細內容
          const hasChildren = await checkHasChildren(page.id);
          if (hasChildren) {
            experience.hasDetailPage = true;
            experience.detailPageId = page.id;
            experience.detailPageContent = await getPageBlocks(page.id);
          }

          return experience;
        }),
      );

      return experiences;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
  });
}

/**
 * 獲取教育背景
 */
export async function getEducation(): Promise<Education[]> {
  return notionCache.getOrSet(CACHE_KEYS.EDUCATION, async () => {
    try {
      let response;

      if (config.mode === 'multi' && 'education' in config.databases && config.databases.education) {
        response = await client.databases.query({
          database_id: config.databases.education,
          sorts: [{ property: 'StartDate', direction: 'descending' }],
        });
      } else if ('singleDatabase' in config.databases && config.databases.singleDatabase) {
        response = await client.databases.query({
          database_id: config.databases.singleDatabase,
          filter: { property: 'Type', select: { equals: 'Education' } },
          sorts: [{ property: 'StartDate', direction: 'descending' }],
        });
      } else {
        return [];
      }

      return response.results.map((page) => parser.parseEducation(page));
    } catch (error) {
      console.error('Error fetching education:', error);
      return [];
    }
  });
}

/**
 * 獲取專案
 */
export async function getProjects(): Promise<Project[]> {
  return notionCache.getOrSet(CACHE_KEYS.PROJECTS, async () => {
    try {
      let response;

      if (config.mode === 'multi' && 'projects' in config.databases && config.databases.projects) {
        response = await client.databases.query({
          database_id: config.databases.projects,
          sorts: [{ property: 'StartDate', direction: 'descending' }],
        });
      } else if ('singleDatabase' in config.databases && config.databases.singleDatabase) {
        response = await client.databases.query({
          database_id: config.databases.singleDatabase,
          filter: { property: 'Type', select: { equals: 'Project' } },
          sorts: [{ property: 'StartDate', direction: 'descending' }],
        });
      } else {
        return [];
      }

      const projects = await Promise.all(
        response.results.map(async (page: any) => {
          const project = parser.parseProject(page);

          // 檢查是否有詳細內容
          const hasChildren = await checkHasChildren(page.id);
          if (hasChildren) {
            project.hasDetailPage = true;
            project.detailPageId = page.id;
            project.detailPageContent = await getPageBlocks(page.id);
          }

          return project;
        }),
      );

      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  });
}

/**
 * 獲取技能
 */
export async function getSkills(): Promise<Skill[]> {
  return notionCache.getOrSet(CACHE_KEYS.SKILLS, async () => {
    try {
      let response;

      if (config.mode === 'multi' && 'skills' in config.databases && config.databases.skills) {
        response = await client.databases.query({
          database_id: config.databases.skills,
        });
      } else if ('singleDatabase' in config.databases && config.databases.singleDatabase) {
        response = await client.databases.query({
          database_id: config.databases.singleDatabase,
          filter: { property: 'Type', select: { equals: 'Skill' } },
        });
      } else {
        return [];
      }

      return response.results.map((page) => parser.parseSkill(page));
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  });
}

/**
 * 獲取頁面內容
 */
export async function getPageContent(): Promise<PageContent | null> {
  if (!config.pageId) return null;

  return notionCache.getOrSet(CACHE_KEYS.PAGE_CONTENT, async () => {
    try {
      const page = await client.pages.retrieve({
        page_id: config.pageId!,
      });

      const pageTitle = extractPageTitle(page);
      const blocks = await getPageBlocks(config.pageId!);

      return {
        id: config.pageId!,
        title: pageTitle,
        blocks,
        last_edited_time: (page as any).last_edited_time,
      };
    } catch (error) {
      console.error('Error fetching page content:', error);
      return null;
    }
  });
}

/**
 * 獲取所有履歷資料
 */
export async function getResumeData(): Promise<ResumeData> {
  return notionCache.getOrSet(CACHE_KEYS.ALL_RESUME_DATA, async () => {
    console.log('🚀 Fetching all resume data...');

    // 並行載入所有資料
    const [personalInfo, experiences, education, projects, skills, pageContent] = await Promise.allSettled([
      getPersonalInfo(),
      getExperiences(),
      getEducation(),
      getProjects(),
      getSkills(),
      getPageContent(),
    ]);

    const data: ResumeData = {
      personalInfo: personalInfo.status === 'fulfilled' ? personalInfo.value : getDefaultPersonalInfo(),
      experiences: experiences.status === 'fulfilled' ? experiences.value : [],
      education: education.status === 'fulfilled' ? education.value : [],
      projects: projects.status === 'fulfilled' ? projects.value : [],
      skills: skills.status === 'fulfilled' ? skills.value : [],
      pageContent:
        pageContent.status === 'fulfilled'
          ? pageContent.value || undefined // 將 null 轉為 undefined
          : undefined,
    };

    console.log('✅ Resume data fetched successfully');
    return data;
  });
}

/**
 * 清除快取
 */
export function clearCache(): void {
  notionCache.clear();
}

// 匯出所有函式
export const notionService = {
  testConnection,
  getPersonalInfo,
  getExperiences,
  getEducation,
  getProjects,
  getSkills,
  getPageContent,
  getResumeData,
  clearCache,
};
