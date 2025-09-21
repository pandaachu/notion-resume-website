import { Client } from '@notionhq/client';
import {
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
  Project,
  Skill,
  NotionBlock,
  PageContent,
} from '../types/notion';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Database IDs
const DATABASE_IDS = {
  PERSONAL_INFO: process.env.NOTION_PERSONAL_INFO_DB!,
  EXPERIENCE: process.env.NOTION_EXPERIENCE_DB!,
  EDUCATION: process.env.NOTION_EDUCATION_DB!,
  PROJECTS: process.env.NOTION_PROJECTS_DB!,
  SKILLS: process.env.NOTION_SKILLS_DB!,
};

// 🆕 頁面 ID
const RESUME_PAGE_ID = process.env.NOTION_RESUME_PAGE_ID;
const NOTION_USER_MANUAL = process.env.NOTION_USER_MANUAL;
const NOTION_EXPECTATION = process.env.NOTION_EXPECTATION;

// 區塊結構型別
export interface SpecialSection {
  title: string;
  type: string;
  content: string[];
  items: {
    subtitle: string;
    content: string[];
  }[];
}

// 安全的屬性解析器
const getPropertyValue = (property: any, type: string): any => {
  try {
    if (!property) return getDefaultValue(type);

    switch (type) {
      case 'title':
        return property.title?.[0]?.text?.content || '';
      case 'rich_text':
        return property.rich_text?.[0]?.text?.content || '';
      case 'email':
        return property.email || '';
      case 'phone_number':
        return property.phone_number || '';
      case 'url':
        return property.url || '';
      case 'date':
        return property.date?.start || '';
      case 'checkbox':
        return property.checkbox || false;
      case 'multi_select':
        return property.multi_select?.map((item: any) => item.name) || [];
      case 'select':
        return property.select?.name || '';
      case 'files':
        return property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || '';
      default:
        return getDefaultValue(type);
    }
  } catch (error) {
    console.error(`Error parsing property of type ${type}:`, error);
    return getDefaultValue(type);
  }
};

const getDefaultValue = (type: string): any => {
  switch (type) {
    case 'checkbox':
      return false;
    case 'multi_select':
      return [];
    default:
      return '';
  }
};

// 🆕 Rich Text 解析器
const parseRichText = (rich_text: any[]): string => {
  if (!rich_text || rich_text.length === 0) return '';

  return rich_text.map((text: any) => text.plain_text || text.text?.content || '').join('');
};

// 🆕 Block 解析器
const parseBlock = (block: any): NotionBlock => {
  const baseBlock: NotionBlock = {
    id: block.id,
    type: block.type,
    content: '',
  };

  switch (block.type) {
    case 'paragraph':
      baseBlock.content = parseRichText(block.paragraph.rich_text);
      baseBlock.paragraph = {
        content: baseBlock.content,
        rich_text: block.paragraph.rich_text,
      };
      break;

    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      const level = parseInt(block.type.split('_')[1]) as 1 | 2 | 3;
      baseBlock.content = parseRichText(block[block.type].rich_text);
      baseBlock.heading = {
        level,
        content: baseBlock.content,
      };
      break;

    case 'image':
      const imageUrl = block.image.file?.url || block.image.external?.url || '';
      const caption = parseRichText(block.image.caption || []);
      baseBlock.content = caption;
      baseBlock.image = {
        url: imageUrl,
        caption,
      };
      break;

    case 'quote':
      baseBlock.content = parseRichText(block.quote.rich_text);
      baseBlock.quote = {
        content: baseBlock.content,
      };
      break;

    case 'callout':
      baseBlock.content = parseRichText(block.callout.rich_text);
      baseBlock.callout = {
        icon: block.callout.icon?.emoji || block.callout.icon?.external?.url || '',
        content: baseBlock.content,
      };
      break;

    case 'bulleted_list_item':
      baseBlock.content = parseRichText(block.bulleted_list_item.rich_text);
      baseBlock.bulleted_list_item = {
        content: baseBlock.content,
      };
      break;

    case 'numbered_list_item':
      baseBlock.content = parseRichText(block.numbered_list_item.rich_text);
      baseBlock.numbered_list_item = {
        content: baseBlock.content,
      };
      break;

    case 'divider':
      baseBlock.content = '---';
      break;

    case 'child_database':
      const databaseTitle = block.child_database?.title || '資料庫';
      baseBlock.content = databaseTitle;
      baseBlock.child_database = {
        title: databaseTitle,
        database_id: block.id,
      };
      break;

    case 'child_page':
      const pageTitle = block.child_page?.title || '子頁面';
      baseBlock.content = pageTitle;
      baseBlock.child_page = {
        title: pageTitle,
        page_id: block.id,
      };
      break;

    // 🆕 新增 toggle 處理
    case 'toggle':
      const toggleTitle = parseRichText(block.toggle.rich_text);
      baseBlock.content = toggleTitle;
      baseBlock.toggle = {
        title: toggleTitle,
        children: [], // 將在 getAllBlocks 中填充
      };
      break;

    default:
      baseBlock.content = `[${block.type}]`;
      console.warn(`未處理的 block 類型: ${block.type}`);
  }

  return baseBlock;
};

// 🆕 遞歸獲取所有 blocks (包含子 blocks)
const getAllBlocks = async (blockId: string): Promise<NotionBlock[]> => {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    });

    const blocks: NotionBlock[] = [];

    for (const block of response.results) {
      const parsedBlock = parseBlock(block);

      // 檢查是否有子 blocks
      if ((block as any).has_children) {
        try {
          parsedBlock.children = await getAllBlocks(block.id);

          // 如果是 toggle，將子內容填入 toggle 屬性
          if (parsedBlock.type === 'toggle' && parsedBlock.toggle) {
            parsedBlock.toggle.children = parsedBlock.children;
          }
        } catch (error) {
          console.warn(`無法獲取子 blocks for ${block.id}:`, error);
          parsedBlock.children = [];
        }
      }

      blocks.push(parsedBlock);
    }

    return blocks;
  } catch (error) {
    console.error('獲取 blocks 失敗:', error);
    return [];
  }
};

// 🆕 獲取頁面內容
export const getPageContent = async (): Promise<PageContent | null> => {
  if (!RESUME_PAGE_ID) {
    console.warn('⚠️ NOTION_RESUME_PAGE_ID 未設定，跳過頁面內容獲取');
    return null;
  }

  try {
    console.log('🔍 正在獲取頁面內容...');

    // 獲取頁面基本資訊
    const page = await notion.pages.retrieve({
      page_id: RESUME_PAGE_ID,
    });

    // 獲取頁面標題
    const pageTitle =
      (page as any).properties?.title?.title?.[0]?.text?.content ||
      (page as any).properties?.Name?.title?.[0]?.text?.content ||
      '個人履歷';

    // 獲取所有 blocks
    const blocks = await getAllBlocks(RESUME_PAGE_ID);

    const pageContent: PageContent = {
      id: RESUME_PAGE_ID,
      title: pageTitle,
      blocks,
      last_edited_time: (page as any).last_edited_time,
    };

    console.log(`✅ 頁面內容獲取成功，包含 ${blocks.length} 個 blocks`);
    return pageContent;
  } catch (error) {
    console.error('❌ 獲取頁面內容失敗:', error);
    return null;
  }
};

// 獲取個人資訊
export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.PERSONAL_INFO,
      page_size: 1,
    });

    if (response.results.length === 0) {
      throw new Error('個人資訊資料庫中沒有資料');
    }

    const page = response.results[0] as any;
    const properties = page.properties;

    return {
      id: page.id,
      name: getPropertyValue(properties.Name, 'title'),
      title: getPropertyValue(properties.Title, 'rich_text'),
      email: getPropertyValue(properties.Email, 'email'),
      phone: getPropertyValue(properties.Phone, 'phone_number'),
      location: getPropertyValue(properties.Location, 'rich_text'),
      summary: getPropertyValue(properties.Summary, 'rich_text'),
      avatar: getPropertyValue(properties.Avatar, 'files'),
      linkedin: getPropertyValue(properties.LinkedIn, 'url'),
      githubUrl: getPropertyValue(properties.GitHub, 'url'),
      website: getPropertyValue(properties.Website, 'url'),
    };
  } catch (error) {
    console.error('❌ 獲取個人資訊失敗：', error);
    return {
      id: 'error',
      name: '請設定個人資訊',
      title: '請在 Notion 中設定職稱',
      email: '',
      phone: '',
      location: '',
      summary: '請在 Notion 資料庫中添加個人資訊',
      avatar: '',
      linkedin: '',
      githubUrl: '',
      website: '',
    };
  }
};

export const getTableContent = async (databaseId: string): Promise<any> => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 1,
    });

    if (response.results.length === 0) {
      throw new Error('個人資訊資料庫中沒有資料');
    }

    const page = response.results[0] as any;
    const properties = page.properties;

    return {
      id: page.id,
      name: getPropertyValue(properties.Name, 'title'),
      URL: getPropertyValue(properties.URL, 'url'),
      Image: getPropertyValue(properties.Image, 'files'),
    };
  } catch (error) {
    console.error('❌ 獲取個人資訊失敗：', error);
    return {};
  }
};

// 🆕 獲取 Experience 詳細頁面內容
const getExperiencePageContent = async (pageId: string): Promise<NotionBlock[]> => {
  try {
    console.log(`🔍 正在獲取 Experience 頁面內容: ${pageId}`);

    const blocks = await getAllBlocks(pageId);
    console.log(`✅ Experience 頁面內容獲取成功，包含 ${blocks.length} 個 blocks`);

    return blocks;
  } catch (error) {
    console.error('❌ 獲取 Experience 頁面內容失敗:', error);
    return [];
  }
};

// 獲取工作經驗
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.EXPERIENCE,
      sorts: [
        {
          property: 'StartDate',
          direction: 'descending',
        },
      ],
    });

    const experiences: Experience[] = [];

    for (const page of response.results) {
      const pageData = page as any;
      const properties = pageData.properties;

      // 基本資料
      const baseExperience: Experience = {
        id: pageData.id,
        company: getPropertyValue(properties.Company, 'rich_text'),
        position: getPropertyValue(properties.Position, 'title'),
        startDate: getPropertyValue(properties.StartDate, 'date'),
        endDate: getPropertyValue(properties.EndDate, 'date'),
        current: getPropertyValue(properties.Current, 'checkbox'),
        description: getPropertyValue(properties.Description, 'rich_text'),
        technologies: getPropertyValue(properties.Technologies, 'multi_select'),
      };

      // 🆕 檢查是否有詳細頁面內容
      // 方法1: 檢查 page 是否有子 blocks (最常見)
      try {
        const hasChildren = await notion.blocks.children.list({
          block_id: pageData.id,
          page_size: 1,
        });

        if (hasChildren.results.length > 0) {
          console.log(`🔍 發現 Experience 有詳細內容: ${baseExperience.position} - ${baseExperience.company}`);

          // 獲取詳細頁面內容
          const detailContent = await getExperiencePageContent(pageData.id);

          // 獲取頁面標題
          const pageTitle = `${baseExperience.position} - ${baseExperience.company}`;

          baseExperience.hasDetailPage = true;
          baseExperience.detailPageId = pageData.id;
          baseExperience.detailPageContent = detailContent;
          baseExperience.detailPageTitle = pageTitle;
        }
      } catch (error) {
        console.warn(`⚠️ 檢查 Experience 詳細內容時發生錯誤: ${pageData.id}`, error);
      }

      experiences.push(baseExperience);
    }

    return experiences;
  } catch (error) {
    console.error('❌ 獲取工作經驗失敗：', error);
    return [];
  }
};

// 獲取教育背景
export const getEducation = async (): Promise<Education[]> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.EDUCATION,
      sorts: [
        {
          property: 'StartDate',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        school: getPropertyValue(properties.School, 'rich_text'),
        degree: getPropertyValue(properties.Degree, 'title'),
        field: getPropertyValue(properties.Field, 'rich_text'),
        startDate: getPropertyValue(properties.StartDate, 'date'),
        endDate: getPropertyValue(properties.EndDate, 'date'),
        gpa: getPropertyValue(properties.GPA, 'rich_text'),
      };
    });
  } catch (error) {
    console.error('❌ 獲取教育背景失敗：', error);
    return [];
  }
};

// 獲取專案作品
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.PROJECTS,
      sorts: [
        {
          property: 'StartDate',
          direction: 'descending',
        },
      ],
    });
    const projects: Project[] = [];
    for (const page of response.results) {
      const pageData = page as any;
      const properties = pageData.properties;

      // 基本資料
      const baseProject: Project = {
        id: pageData.id,
        name: getPropertyValue(properties.Name, 'title'),
        description: getPropertyValue(properties.Description, 'rich_text'),
        technologies: getPropertyValue(properties.Technologies, 'multi_select'),
        githubUrl: getPropertyValue(properties.GitHubURL, 'url'),
        liveUrl: getPropertyValue(properties.LiveURL, 'url'),
        image: getPropertyValue(properties.Image, 'files'),
      };

      // 🆕 檢查是否有詳細頁面內容
      // 方法1: 檢查 page 是否有子 blocks (最常見)
      try {
        const hasChildren = await notion.blocks.children.list({
          block_id: pageData.id,
          page_size: 1,
        });

        if (hasChildren.results.length > 0) {
          console.log(`🔍 發現 Experience 有詳細內容: ${baseProject.name}`);

          // 獲取詳細頁面內容
          const detailContent = await getExperiencePageContent(pageData.id);

          // 獲取頁面標題
          const pageTitle = `${baseProject.name}`;

          baseProject.hasDetailPage = true;
          baseProject.detailPageId = pageData.id;
          baseProject.detailPageContent = detailContent;
          baseProject.detailPageTitle = pageTitle;
        }
      } catch (error) {
        console.warn(`⚠️ 檢查 Experience 詳細內容時發生錯誤: ${pageData.id}`, error);
      }

      projects.push(baseProject);
    }

    return projects;
  } catch (error) {
    console.error('❌ 獲取專案作品失敗：', error);
    return [];
  }
};

// 獲取技能
export const getSkills = async (): Promise<Skill[]> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.SKILLS,
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        category: getPropertyValue(properties.Category, 'select'),
        name: getPropertyValue(properties.Name, 'title'),
        level: getPropertyValue(properties.Level, 'select') as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
      };
    });
  } catch (error) {
    console.error('❌ 獲取技能失敗：', error);
    return [];
  }
};
// 解析 heading_1 區塊為 SpecialSection
export function parseSpecialSection(block: NotionBlock): SpecialSection | null {
  if (block.type !== 'heading_1') return null;

  const title = block.heading?.content || block.content;
  let type = '';
  if (title.includes('使用說明')) type = 'user_manual';
  else if (title.includes('期望') || title.toLowerCase().includes('expectation')) type = 'expectation';
  else type = 'other';

  const section: SpecialSection = {
    title,
    type,
    content: [],
    items: [],
  };

  let currentItem: { subtitle: string; content: string[] } | null = null;
  for (const child of block.children ?? []) {
    if (child.type === 'paragraph') {
      if (!currentItem) {
        section.content.push(child.content);
      } else {
        currentItem.content.push(child.content);
      }
    } else if (child.type === 'heading_3') {
      if (currentItem) section.items.push(currentItem);
      currentItem = {
        subtitle: child.heading?.content || child.content,
        content: [],
      };
    }
  }
  if (currentItem) section.items.push(currentItem);

  return section;
}

// 取得所有 SpecialSection
export function getAllSpecialSections(blocks: NotionBlock[]): SpecialSection[] {
  return blocks
    .filter((block) => block.type === 'heading_1')
    .map((block) => parseSpecialSection(block))
    .filter((section): section is SpecialSection => !!section);
}

// 獲取所有履歷資料
export const getResumeData = async (): Promise<ResumeData> => {
  console.log('🚀 開始獲取履歷資料 (包含頁面內容)...');

  try {
    const [personalInfo, experiences, education, projects, skills, pageContent] = await Promise.allSettled([
      getPersonalInfo(),
      getExperiences(),
      getEducation(),
      getProjects(),
      getSkills(),
      getPageContent(),
    ]);

    // 解析所有特殊區塊
    let specialSections: SpecialSection[] = [];
    if (pageContent.status === 'fulfilled' && pageContent.value?.blocks) {
      specialSections = getAllSpecialSections(pageContent.value.blocks);
      // 你可以將 specialSections 存到 ResumeData 或單獨導出
      // 例如：result.specialSections = specialSections;
    }

    const result: ResumeData = {
      personalInfo:
        personalInfo.status === 'fulfilled'
          ? personalInfo.value
          : {
              id: 'error',
              name: '載入錯誤',
              title: '無法載入個人資訊',
              email: '',
              phone: '',
              location: '',
              summary: '請檢查 Notion 設定',
            },
      experiences: experiences.status === 'fulfilled' ? experiences.value : [],
      education: education.status === 'fulfilled' ? education.value : [],
      projects: projects.status === 'fulfilled' ? projects.value : [],
      skills: skills.status === 'fulfilled' ? skills.value : [],
      pageContent: pageContent.status === 'fulfilled' && pageContent.value ? pageContent.value : undefined,
      specialSections,
    };

    console.log('✅ 履歷資料獲取完成 (包含頁面內容)');
    return result;
  } catch (error) {
    console.error('❌ 獲取履歷資料失敗：', error);
    throw error;
  }
};

// export async function getProjectsWithPersonalInfo() {
//   try {
//     console.log('🎯 Fetching projects and personal info only...');

//     // 並行獲取，但只要這兩個
//     const [projects, personalInfo] = await Promise.all([getProjects(), getPersonalInfo()]);

//     return {
//       projects,
//       personalInfo,
//     };
//   } catch (error) {
//     console.error('Error fetching projects data:', error);
//     return {
//       projects: [],
//       personalInfo: getDefaultPersonalInfo(),
//     };
//   }
// }

// 測試所有資料庫連接
export const testAllDatabaseConnections = async () => {
  const databases = [
    { name: '個人資訊', id: DATABASE_IDS.PERSONAL_INFO },
    { name: '工作經驗', id: DATABASE_IDS.EXPERIENCE },
    { name: '教育背景', id: DATABASE_IDS.EDUCATION },
    { name: '專案作品', id: DATABASE_IDS.PROJECTS },
    { name: '技能清單', id: DATABASE_IDS.SKILLS },
  ];

  for (const db of databases) {
    try {
      await notion.databases.retrieve({ database_id: db.id });
      console.log(`✅ ${db.name} 資料庫連接成功`);
    } catch (error) {
      console.error(`❌ ${db.name} 資料庫連接失敗:`, error);
    }
  }
};

// 🆕 測試頁面連接
export const testPageConnection = async () => {
  if (!RESUME_PAGE_ID) {
    console.log('❌ NOTION_RESUME_PAGE_ID 未設定');
    return false;
  }

  try {
    const page = await notion.pages.retrieve({
      page_id: RESUME_PAGE_ID,
    });
    console.log('✅ 頁面連接成功');
    return true;
  } catch (error) {
    console.error('❌ 頁面連接失敗:', error);
    return false;
  }
};
