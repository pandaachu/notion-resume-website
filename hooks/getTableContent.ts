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

const RESUME_PAGE_ID = process.env.NOTION_RESUME_PAGE_ID;
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
interface TableContentParams {
  database_id: string;
}
export const getTableContent = async ({ database_id }: TableContentParams) => {
  // console.log('🚀 ~ getTableContent ~ database_id:', database_id);
  try {
    const response = await notion.databases.query({
      database_id,
      sorts: [
        {
          property: 'StartDate',
          direction: 'descending',
        },
      ],
    });

    // const tableContent: any[] = [];
    // for (const page of response.results) {
    //   const pageData = page as any;
    //   const properties = pageData.properties;

    //   // 基本資料
    //   const baseProject: Project = {
    //     id: pageData.id,
    //     name: getPropertyValue(properties.Name, 'title'),
    //     description: getPropertyValue(properties.Description, 'rich_text'),
    //     technologies: getPropertyValue(properties.Technologies, 'multi_select'),
    //     githubUrl: getPropertyValue(properties.GitHubURL, 'url'),
    //     liveUrl: getPropertyValue(properties.LiveURL, 'url'),
    //     image: getPropertyValue(properties.Image, 'files'),
    //   };

    //   // 🆕 檢查是否有詳細頁面內容
    //   // 方法1: 檢查 page 是否有子 blocks (最常見)
    //   try {
    //     const hasChildren = await notion.blocks.children.list({
    //       block_id: pageData.id,
    //       page_size: 1,
    //     });

    //     if (hasChildren.results.length > 0) {
    //       console.log(`🔍 發現 Experience 有詳細內容: ${baseProject.name}`);

    //       // 獲取詳細頁面內容
    //       const detailContent = await getExperiencePageContent(pageData.id);

    //       // 獲取頁面標題
    //       const pageTitle = `${baseProject.name}`;

    //       baseProject.hasDetailPage = true;
    //       baseProject.detailPageId = pageData.id;
    //       baseProject.detailPageContent = detailContent;
    //       baseProject.detailPageTitle = pageTitle;
    //     }
    //   } catch (error) {
    //     console.warn(`⚠️ 檢查 Experience 詳細內容時發生錯誤: ${pageData.id}`, error);
    //   }

    //   projects.push(baseProject);
    // }

    // return tableContent;
    return response;
  } catch (error) {
    console.error('❌ 獲取專案作品失敗：', error);
    return [];
  }
};
