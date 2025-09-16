// lib/notion/service.ts
import { Client } from '@notionhq/client';
import { NotionParser } from './parser';
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
 * Notion API 服務 - 統一管理所有 Notion 操作
 */
export class NotionService {
  private client: Client;
  private databaseIds: {
    personalInfo?: string;
    experience?: string;
    education?: string;
    projects?: string;
    skills?: string;
    singleDatabase?: string; // 單一資料庫模式
  };
  private pageId?: string;
  private mode: 'single' | 'multi';

  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    // 判斷模式：多資料庫或單一資料庫
    this.mode = process.env.NOTION_PERSONAL_INFO_DB ? 'multi' : 'single';

    if (this.mode === 'multi') {
      this.databaseIds = {
        personalInfo: process.env.NOTION_PERSONAL_INFO_DB,
        experience: process.env.NOTION_EXPERIENCE_DB,
        education: process.env.NOTION_EDUCATION_DB,
        projects: process.env.NOTION_PROJECTS_DB,
        skills: process.env.NOTION_SKILLS_DB,
      };
    } else {
      this.databaseIds = {
        singleDatabase: process.env.NOTION_DATABASE_ID,
      };
    }

    this.pageId = process.env.NOTION_RESUME_PAGE_ID;
  }

  /**
   * 測試連接
   */
  async testConnection(): Promise<boolean> {
    try {
      if (this.mode === 'multi') {
        for (const [name, id] of Object.entries(this.databaseIds)) {
          if (id) {
            await this.client.databases.retrieve({ database_id: id });
            console.log(`✅ ${name} database connected`);
          }
        }
      } else if (this.databaseIds.singleDatabase) {
        await this.client.databases.retrieve({
          database_id: this.databaseIds.singleDatabase,
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
   * 獲取個人資訊
   */
  async getPersonalInfo(): Promise<PersonalInfo> {
    return notionCache.getOrSet(CACHE_KEYS.PERSONAL_INFO, async () => {
      try {
        let response;

        if (this.mode === 'multi' && this.databaseIds.personalInfo) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.personalInfo,
            page_size: 1,
          });
        } else if (this.databaseIds.singleDatabase) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.singleDatabase,
            filter: { property: 'Type', select: { equals: 'Personal Info' } },
            page_size: 1,
          });
        } else {
          throw new Error('No database configured');
        }

        if (!response?.results?.[0]) {
          throw new Error('No personal info found');
        }

        return NotionParser.parsePersonalInfo(response.results[0]);
      } catch (error) {
        console.error('Error fetching personal info:', error);
        return this.getDefaultPersonalInfo();
      }
    });
  }

  /**
   * 獲取工作經驗
   */
  async getExperiences(): Promise<Experience[]> {
    return notionCache.getOrSet(CACHE_KEYS.EXPERIENCES, async () => {
      try {
        let response;

        if (this.mode === 'multi' && this.databaseIds.experience) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.experience,
            sorts: [{ property: 'StartDate', direction: 'descending' }],
          });
        } else if (this.databaseIds.singleDatabase) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.singleDatabase,
            filter: { property: 'Type', select: { equals: 'Experience' } },
            sorts: [{ property: 'StartDate', direction: 'descending' }],
          });
        } else {
          return [];
        }

        const experiences = await Promise.all(
          response.results.map(async (page: any) => {
            const experience = NotionParser.parseExperience(page);

            // 檢查是否有詳細內容
            const hasChildren = await this.checkHasChildren(page.id);
            if (hasChildren) {
              experience.hasDetailPage = true;
              experience.detailPageId = page.id;
              experience.detailPageContent = await this.getPageBlocks(page.id);
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
  async getEducation(): Promise<Education[]> {
    return notionCache.getOrSet(CACHE_KEYS.EDUCATION, async () => {
      try {
        let response;

        if (this.mode === 'multi' && this.databaseIds.education) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.education,
            sorts: [{ property: 'StartDate', direction: 'descending' }],
          });
        } else if (this.databaseIds.singleDatabase) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.singleDatabase,
            filter: { property: 'Type', select: { equals: 'Education' } },
            sorts: [{ property: 'StartDate', direction: 'descending' }],
          });
        } else {
          return [];
        }

        return response.results.map((page) => NotionParser.parseEducation(page));
      } catch (error) {
        console.error('Error fetching education:', error);
        return [];
      }
    });
  }

  /**
   * 獲取專案
   */
  async getProjects(): Promise<Project[]> {
    return notionCache.getOrSet(CACHE_KEYS.PROJECTS, async () => {
      try {
        let response;

        if (this.mode === 'multi' && this.databaseIds.projects) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.projects,
            sorts: [{ property: 'StartDate', direction: 'descending' }],
          });
        } else if (this.databaseIds.singleDatabase) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.singleDatabase,
            filter: { property: 'Type', select: { equals: 'Project' } },
            sorts: [{ property: 'StartDate', direction: 'descending' }],
          });
        } else {
          return [];
        }

        const projects = await Promise.all(
          response.results.map(async (page: any) => {
            const project = NotionParser.parseProject(page);

            // 檢查是否有詳細內容
            const hasChildren = await this.checkHasChildren(page.id);
            if (hasChildren) {
              project.hasDetailPage = true;
              project.detailPageId = page.id;
              project.detailPageContent = await this.getPageBlocks(page.id);
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
  async getSkills(): Promise<Skill[]> {
    return notionCache.getOrSet(CACHE_KEYS.SKILLS, async () => {
      try {
        let response;

        if (this.mode === 'multi' && this.databaseIds.skills) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.skills,
          });
        } else if (this.databaseIds.singleDatabase) {
          response = await this.client.databases.query({
            database_id: this.databaseIds.singleDatabase,
            filter: { property: 'Type', select: { equals: 'Skill' } },
          });
        } else {
          return [];
        }

        return response.results.map((page) => NotionParser.parseSkill(page));
      } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
      }
    });
  }

  /**
   * 獲取頁面內容
   */
  async getPageContent(): Promise<PageContent | null> {
    if (!this.pageId) return null;

    return notionCache.getOrSet(CACHE_KEYS.PAGE_CONTENT, async () => {
      try {
        const page = await this.client.pages.retrieve({
          page_id: this.pageId!,
        });

        const pageTitle = this.extractPageTitle(page);
        const blocks = await this.getPageBlocks(this.pageId!);

        return {
          id: this.pageId!,
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
  async getResumeData(): Promise<ResumeData> {
    return notionCache.getOrSet(CACHE_KEYS.ALL_RESUME_DATA, async () => {
      console.log('🚀 Fetching all resume data...');

      // 並行載入所有資料
      const [personalInfo, experiences, education, projects, skills, pageContent] = await Promise.allSettled([
        this.getPersonalInfo(),
        this.getExperiences(),
        this.getEducation(),
        this.getProjects(),
        this.getSkills(),
        this.getPageContent(),
      ]);

      const data: ResumeData = {
        personalInfo: personalInfo.status === 'fulfilled' ? personalInfo.value : this.getDefaultPersonalInfo(),
        experiences: experiences.status === 'fulfilled' ? experiences.value : [],
        education: education.status === 'fulfilled' ? education.value : [],
        projects: projects.status === 'fulfilled' ? projects.value : [],
        skills: skills.status === 'fulfilled' ? skills.value : [],
        pageContent: pageContent.status === 'fulfilled' ? pageContent.value : undefined,
      };

      console.log('✅ Resume data fetched successfully');
      return data;
    });
  }

  /**
   * 檢查頁面是否有子內容
   */
  private async checkHasChildren(blockId: string): Promise<boolean> {
    try {
      const response = await this.client.blocks.children.list({
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
  private async getPageBlocks(blockId: string): Promise<NotionBlock[]> {
    try {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
        page_size: 100,
      });

      const blocks: NotionBlock[] = [];

      for (const block of response.results) {
        const parsedBlock = NotionParser.parseBlock(block);

        // 如果有子 blocks，遞迴獲取
        if ((block as any).has_children) {
          parsedBlock.children = await this.getPageBlocks(block.id);

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
  private extractPageTitle(page: any): string {
    return (
      page.properties?.title?.title?.[0]?.text?.content ||
      page.properties?.Name?.title?.[0]?.text?.content ||
      '個人履歷'
    );
  }

  /**
   * 取得預設個人資訊
   */
  private getDefaultPersonalInfo(): PersonalInfo {
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
   * 清除快取
   */
  clearCache(): void {
    notionCache.clear();
  }
}

// 建立單例實例
export const notionService = new NotionService();
