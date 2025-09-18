import { PersonalInfo, Experience, Education, Project, Skill, NotionBlock } from '@/types/notion';

/**
 * 解析 Rich Text
 */
export function parseRichText(richText: any[]): string {
  if (!richText || richText.length === 0) return '';
  return richText.map((text: any) => text.plain_text || text.text?.content || '').join('');
}

/**
 * 取得預設值
 */
function getDefaultValue(type: string): any {
  const defaults: Record<string, any> = {
    checkbox: false,
    multi_select: [],
    default: '',
  };
  return defaults[type] ?? defaults.default;
}

/**
 * 解析屬性值（統一處理所有類型）
 */
export function parseProperty(property: any, type: string): any {
  try {
    if (!property) return getDefaultValue(type);

    const parsers: Record<string, () => any> = {
      title: () => property.title?.[0]?.text?.content || '',
      rich_text: () => parseRichText(property.rich_text),
      email: () => property.email || '',
      phone_number: () => property.phone_number || '',
      url: () => property.url || '',
      date: () => property.date?.start || '',
      checkbox: () => property.checkbox || false,
      multi_select: () => property.multi_select?.map((item: any) => item.name) || [],
      select: () => property.select?.name || '',
      files: () => property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || '',
    };

    return parsers[type]?.() ?? getDefaultValue(type);
  } catch (error) {
    console.error(`Error parsing property of type ${type}:`, error);
    return getDefaultValue(type);
  }
}

/**
 * 解析標題區塊
 */
function parseHeading(block: any, baseBlock: NotionBlock, level: 1 | 2 | 3): void {
  const headingKey = `heading_${level}`;
  baseBlock.content = parseRichText(block[headingKey].rich_text);
  baseBlock.heading = { level, content: baseBlock.content };
}

/**
 * 解析圖片區塊
 */
function parseImage(block: any, baseBlock: NotionBlock): void {
  const imageUrl = block.image.file?.url || block.image.external?.url || '';
  const caption = parseRichText(block.image.caption || []);
  baseBlock.content = caption;
  baseBlock.image = { url: imageUrl, caption };
}

/**
 * 解析 Callout 區塊
 */
function parseCallout(block: any, baseBlock: NotionBlock): void {
  baseBlock.content = parseRichText(block.callout.rich_text);
  baseBlock.callout = {
    icon: block.callout.icon?.emoji || block.callout.icon?.external?.url || '',
    content: baseBlock.content,
  };
}

/**
 * 解析列表項目
 */
function parseListItem(block: any, baseBlock: NotionBlock, type: 'bulleted' | 'numbered'): void {
  const key = `${type}_list_item`;
  baseBlock.content = parseRichText(block[key].rich_text);

  // 使用條件判斷來確保類型安全
  if (type === 'bulleted') {
    baseBlock.bulleted_list_item = { content: baseBlock.content };
  } else {
    baseBlock.numbered_list_item = { content: baseBlock.content };
  }
}

/**
 * 解析 Toggle 區塊
 */
function parseToggle(block: any, baseBlock: NotionBlock): void {
  const toggleTitle = parseRichText(block.toggle.rich_text);
  baseBlock.content = toggleTitle;
  baseBlock.toggle = {
    title: toggleTitle,
    children: [],
  };
}

/**
 * 解析 Notion Block
 */
export function parseBlock(block: any): NotionBlock {
  const baseBlock: NotionBlock = {
    id: block.id,
    type: block.type,
    content: '',
  };

  const blockParsers: Record<string, () => void> = {
    paragraph: () => {
      baseBlock.content = parseRichText(block.paragraph.rich_text);
      baseBlock.paragraph = {
        content: baseBlock.content,
        rich_text: block.paragraph.rich_text,
      };
    },
    heading_1: () => parseHeading(block, baseBlock, 1),
    heading_2: () => parseHeading(block, baseBlock, 2),
    heading_3: () => parseHeading(block, baseBlock, 3),
    image: () => parseImage(block, baseBlock),
    quote: () => {
      baseBlock.content = parseRichText(block.quote.rich_text);
      baseBlock.quote = { content: baseBlock.content };
    },
    callout: () => parseCallout(block, baseBlock),
    bulleted_list_item: () => parseListItem(block, baseBlock, 'bulleted'),
    numbered_list_item: () => parseListItem(block, baseBlock, 'numbered'),
    toggle: () => parseToggle(block, baseBlock),
    divider: () => {
      baseBlock.content = '---';
    },
  };

  const parser = blockParsers[block.type];
  if (parser) {
    parser();
  } else {
    baseBlock.content = `[${block.type}]`;
    console.warn(`未處理的 block 類型: ${block.type}`);
  }

  return baseBlock;
}

/**
 * 解析個人資訊
 */
export function parsePersonalInfo(page: any): PersonalInfo {
  const properties = page.properties;
  return {
    id: page.id,
    name: parseProperty(properties.Name, 'title'),
    title: parseProperty(properties.Title, 'rich_text'),
    email: parseProperty(properties.Email, 'email'),
    phone: parseProperty(properties.Phone, 'phone_number'),
    location: parseProperty(properties.Location, 'rich_text'),
    summary: parseProperty(properties.Summary, 'rich_text'),
    avatar: parseProperty(properties.Avatar, 'files'),
    linkedin: parseProperty(properties.LinkedIn, 'url'),
    githubUrl: parseProperty(properties.GitHub || properties.GitHubURL, 'url'),
    website: parseProperty(properties.Website, 'url'),
  };
}

/**
 * 解析工作經驗
 */
export function parseExperience(page: any): Experience {
  const properties = page.properties;
  return {
    id: page.id,
    company: parseProperty(properties.Company, 'rich_text'),
    position: parseProperty(properties.Position || properties.Name, 'title'),
    startDate: parseProperty(properties.StartDate, 'date'),
    endDate: parseProperty(properties.EndDate, 'date'),
    current: parseProperty(properties.Current, 'checkbox'),
    description: parseProperty(properties.Description, 'rich_text'),
    technologies: parseProperty(properties.Technologies, 'multi_select'),
  };
}

/**
 * 解析教育背景
 */
export function parseEducation(page: any): Education {
  const properties = page.properties;
  return {
    id: page.id,
    school: parseProperty(properties.School, 'rich_text'),
    degree: parseProperty(properties.Degree || properties.Name, 'title'),
    field: parseProperty(properties.Field, 'rich_text'),
    startDate: parseProperty(properties.StartDate, 'date'),
    endDate: parseProperty(properties.EndDate, 'date'),
    gpa: parseProperty(properties.GPA, 'rich_text'),
  };
}

/**
 * 解析專案
 */
export function parseProject(page: any): Project {
  const properties = page.properties;
  return {
    id: page.id,
    name: parseProperty(properties.Name, 'title'),
    description: parseProperty(properties.Description, 'rich_text'),
    technologies: parseProperty(properties.Technologies, 'multi_select'),
    githubUrl: parseProperty(properties.GitHubURL, 'url'),
    liveUrl: parseProperty(properties.LiveURL, 'url'),
    image: parseProperty(properties.Image, 'files'),
  };
}

/**
 * 解析技能
 */
export function parseSkill(page: any): Skill {
  const properties = page.properties;
  return {
    id: page.id,
    category: parseProperty(properties.Category, 'select'),
    name: parseProperty(properties.Name, 'title'),
    level: parseProperty(properties.Level, 'select') as Skill['level'],
  };
}
