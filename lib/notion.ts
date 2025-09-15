import { Client } from '@notionhq/client';
import { ResumeData, PersonalInfo, Experience, Education, Project, Skill } from '../types/notion';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;
const DATABASE_PAGE = process.env.NOTION_PAGE_ID!;

// 集中管理所有型別的欄位對應
const FIELD_MAPPINGS = {
  'Personal Info': {
    id: { property: '', type: 'id' },
    name: { property: 'Name', type: 'title', default: '未設定姓名' },
    title: { property: 'Title', type: 'rich_text', default: '未設定職稱' },
    email: { property: 'Email', type: 'email', default: '' },
    phone: { property: 'Phone', type: 'phone_number', default: '' },
    location: { property: 'Location', type: 'rich_text', default: '' },
    summary: { property: 'Summary', type: 'rich_text', default: '歡迎來到我的履歷網站' },
    avatar: { property: 'Avatar', type: 'files', default: '' },
    linkedin: { property: 'LinkedIn', type: 'url', default: '' },
    githubUrl: { property: 'GitHubURL', type: 'url', default: '' },
    website: { property: 'Website', type: 'url', default: '' },
  },
  Experience: {
    id: { property: '', type: 'id' },
    company: { property: 'Company', type: 'rich_text', default: '' },
    position: { property: 'Position', type: 'title', default: '' },
    startDate: { property: 'StartDate', type: 'date', default: '' },
    endDate: { property: 'EndDate', type: 'date', default: '' },
    current: { property: 'Current', type: 'checkbox', default: false },
    description: { property: 'Description', type: 'rich_text', default: '' },
    technologies: { property: 'Technologies', type: 'multi_select', default: [] },
  },
  Education: {
    id: { property: '', type: 'id' },
    school: { property: 'School', type: 'rich_text', default: '' },
    degree: { property: 'Degree', type: 'rich_text', default: '' },
    field: { property: 'Field', type: 'rich_text', default: '' },
    startDate: { property: 'StartDate', type: 'date', default: '' },
    endDate: { property: 'EndDate', type: 'date', default: '' },
    gpa: { property: 'GPA', type: 'rich_text', default: '' },
  },
  Project: {
    id: { property: '', type: 'id' },
    name: { property: 'Name', type: 'title', default: '' },
    description: { property: 'Description', type: 'rich_text', default: '' },
    technologies: { property: 'Technologies', type: 'multi_select', default: [] },
    githubUrl: { property: 'GitHubURL', type: 'url', default: '' },
    liveUrl: { property: 'LiveURL', type: 'url', default: '' },
    image: { property: 'Image', type: 'files', default: '' },
  },
  Skill: {
    id: { property: '', type: 'id' },
    category: { property: 'Category', type: 'select', default: '' },
    name: { property: 'Name', type: 'title', default: '' },
    level: { property: 'Level', type: 'select', default: '' },
  },
};

// 安全的屬性解析器
const getPropertyValue = (property: any, type: string): any => {
  try {
    if (!property) return getDefaultValue(type);
    switch (type) {
      case 'title':
        return property.title?.[0]?.plain_text || '';
      case 'rich_text':
        return property.rich_text?.map((t: any) => t.plain_text).join('') || '';
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
        return property.multi_select?.map((t: any) => t.name) || [];
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

// 通用屬性解析器
function extractProperties<T>(properties: any, id: string, mapping: any, withDefault = false): T {
  const result: any = { id };
  for (const key in mapping) {
    if (key === 'id') continue;
    const { property, type, default: def } = mapping[key];
    const value = property ? getPropertyValue(properties[property], type) : id;
    result[key] = value || (withDefault ? (def ?? '') : '');
  }
  return result as T;
}

// 預設值函數
const getDefaultValue = (type: string): any => {
  switch (type) {
    case 'title':
    case 'rich_text':
    case 'email':
    case 'phone_number':
    case 'url':
    case 'date':
    case 'select':
    case 'files':
      return '';
    case 'checkbox':
      return false;
    case 'multi_select':
      return [];
    default:
      return '';
  }
};

// 通用 Notion 查詢與解析
async function queryAndExtract<T>(type: keyof typeof FIELD_MAPPINGS): Promise<T[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { property: 'Type', select: { equals: type } },
    });
    console.log('🚀 ~ queryAndExtract ~ response:', response);
    return response.results.map((page: any) => extractProperties<T>(page.properties, page.id, FIELD_MAPPINGS[type]));
  } catch (error) {
    console.error(`❌ 獲取${type}失敗：`, error);
    return [];
  }
}

// 調試用函數 - 檢查資料庫結構
export const debugDatabase = async () => {
  try {
    console.log('🔍 檢查 Notion 資料庫...');

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 1,
    });

    if (response.results.length === 0) {
      console.warn('⚠️ 資料庫中沒有資料');
      return;
    }

    const firstPage = response.results[0] as any;
    console.log('📋 可用的屬性：', Object.keys(firstPage.properties));

    // 列出所有屬性和類型
    Object.entries(firstPage.properties).forEach(([key, value]: [string, any]) => {
      console.log(`   ${key}: ${value.type}`);
    });
  } catch (error) {
    console.error('❌ 資料庫檢查失敗：', error);
  }
};

// 各型別 API
export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const list = await queryAndExtract<PersonalInfo>('Personal Info');
  return list[0] || extractProperties<PersonalInfo>({}, 'default', FIELD_MAPPINGS['Personal Info'], true);
};
export const getExperiences = async (): Promise<Experience[]> => queryAndExtract<Experience>('Experience');
export const getEducation = async (): Promise<Education[]> => queryAndExtract<Education>('Education');
export const getProjects = async (): Promise<Project[]> => queryAndExtract<Project>('Project');
export const getSkills = async (): Promise<Skill[]> => queryAndExtract<Skill>('Skill');

// 獲取所有履歷資料 - 加強錯誤處理和調試
export const getResumeData = async (): Promise<ResumeData> => {
  console.log('🚀 開始獲取履歷資料...');

  // 在開發環境中執行調試
  if (process.env.NODE_ENV === 'development') {
    await debugDatabase();
  }

  try {
    const [personalInfo, experiences, education, projects, skills] = await Promise.allSettled([
      getPersonalInfo(),
      getExperiences(),
      getEducation(),
      getProjects(),
      getSkills(),
    ]);

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
    };

    console.log('✅ 履歷資料獲取完成');
    return result;
  } catch (error) {
    console.error('❌ 獲取履歷資料失敗：', error);
    throw error;
  }
};

// # 測試 Notion 連接的輔助函數
export const testNotionConnection = async () => {
  try {
    console.log('🔗 測試 Notion 連接...');

    if (!process.env.NOTION_TOKEN) {
      throw new Error('❌ NOTION_TOKEN 未設定');
    }

    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error('❌ NOTION_DATABASE_ID 未設定');
    }

    const database = await notion.databases.retrieve({
      database_id: DATABASE_PAGE,
      // database_id: DATABASE_ID
    });

    console.log('✅ Notion 連接成功');
    console.log('📋 資料庫標題：', (database as any).title?.[0]?.text?.content || '未命名資料庫');

    return true;
  } catch (error) {
    console.error('❌ Notion 連接失敗：', error);
    return false;
  }
};
