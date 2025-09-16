// lib/notion/parser.ts
import { PersonalInfo, Experience, Education, Project, Skill, NotionBlock } from '@/types/notion';

/**
 * 統一的 Notion 屬性解析器
 */
export class NotionParser {
  /**
   * 解析 Rich Text
   */
  static parseRichText(richText: any[]): string {
    if (!richText || richText.length === 0) return '';
    return richText.map((text: any) => text.plain_text || text.text?.content || '').join('');
  }

  /**
   * 解析屬性值（統一處理所有類型）
   */
  static parseProperty(property: any, type: string): any {
    try {
      if (!property) return this.getDefaultValue(type);

      const parsers: Record<string, () => any> = {
        title: () => property.title?.[0]?.text?.content || '',
        rich_text: () => this.parseRichText(property.rich_text),
        email: () => property.email || '',
        phone_number: () => property.phone_number || '',
        url: () => property.url || '',
        date: () => property.date?.start || '',
        checkbox: () => property.checkbox || false,
        multi_select: () => property.multi_select?.map((item: any) => item.name) || [],
        select: () => property.select?.name || '',
        files: () => property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || '',
      };

      return parsers[type]?.() ?? this.getDefaultValue(type);
    } catch (error) {
      console.error(`Error parsing property of type ${type}:`, error);
      return this.getDefaultValue(type);
    }
  }

  /**
   * 取得預設值
   */
  private static getDefaultValue(type: string): any {
    const defaults: Record<string, any> = {
      checkbox: false,
      multi_select: [],
      default: '',
    };
    return defaults[type] ?? defaults.default;
  }

  /**
   * 解析 Notion Block
   */
  static parseBlock(block: any): NotionBlock {
    const baseBlock: NotionBlock = {
      id: block.id,
      type: block.type,
      content: '',
    };

    const blockParsers: Record<string, () => void> = {
      paragraph: () => {
        baseBlock.content = this.parseRichText(block.paragraph.rich_text);
        baseBlock.paragraph = {
          content: baseBlock.content,
          rich_text: block.paragraph.rich_text,
        };
      },
      heading_1: () => this.parseHeading(block, baseBlock, 1),
      heading_2: () => this.parseHeading(block, baseBlock, 2),
      heading_3: () => this.parseHeading(block, baseBlock, 3),
      image: () => this.parseImage(block, baseBlock),
      quote: () => {
        baseBlock.content = this.parseRichText(block.quote.rich_text);
        baseBlock.quote = { content: baseBlock.content };
      },
      callout: () => this.parseCallout(block, baseBlock),
      bulleted_list_item: () => this.parseListItem(block, baseBlock, 'bulleted'),
      numbered_list_item: () => this.parseListItem(block, baseBlock, 'numbered'),
      toggle: () => this.parseToggle(block, baseBlock),
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

  private static parseHeading(block: any, baseBlock: NotionBlock, level: 1 | 2 | 3): void {
    const headingKey = `heading_${level}`;
    baseBlock.content = this.parseRichText(block[headingKey].rich_text);
    baseBlock.heading = { level, content: baseBlock.content };
  }

  private static parseImage(block: any, baseBlock: NotionBlock): void {
    const imageUrl = block.image.file?.url || block.image.external?.url || '';
    const caption = this.parseRichText(block.image.caption || []);
    baseBlock.content = caption;
    baseBlock.image = { url: imageUrl, caption };
  }

  private static parseCallout(block: any, baseBlock: NotionBlock): void {
    baseBlock.content = this.parseRichText(block.callout.rich_text);
    baseBlock.callout = {
      icon: block.callout.icon?.emoji || block.callout.icon?.external?.url || '',
      content: baseBlock.content,
    };
  }

  private static parseListItem(block: any, baseBlock: NotionBlock, type: 'bulleted' | 'numbered'): void {
    const key = `${type}_list_item`;
    baseBlock.content = this.parseRichText(block[key].rich_text);
    baseBlock[key] = { content: baseBlock.content };
  }

  private static parseToggle(block: any, baseBlock: NotionBlock): void {
    const toggleTitle = this.parseRichText(block.toggle.rich_text);
    baseBlock.content = toggleTitle;
    baseBlock.toggle = {
      title: toggleTitle,
      children: [],
    };
  }

  /**
   * 解析個人資訊
   */
  static parsePersonalInfo(page: any): PersonalInfo {
    const properties = page.properties;
    return {
      id: page.id,
      name: this.parseProperty(properties.Name, 'title'),
      title: this.parseProperty(properties.Title, 'rich_text'),
      email: this.parseProperty(properties.Email, 'email'),
      phone: this.parseProperty(properties.Phone, 'phone_number'),
      location: this.parseProperty(properties.Location, 'rich_text'),
      summary: this.parseProperty(properties.Summary, 'rich_text'),
      avatar: this.parseProperty(properties.Avatar, 'files'),
      linkedin: this.parseProperty(properties.LinkedIn, 'url'),
      githubUrl: this.parseProperty(properties.GitHub || properties.GitHubURL, 'url'),
      website: this.parseProperty(properties.Website, 'url'),
    };
  }

  /**
   * 解析工作經驗
   */
  static parseExperience(page: any): Experience {
    const properties = page.properties;
    return {
      id: page.id,
      company: this.parseProperty(properties.Company, 'rich_text'),
      position: this.parseProperty(properties.Position || properties.Name, 'title'),
      startDate: this.parseProperty(properties.StartDate, 'date'),
      endDate: this.parseProperty(properties.EndDate, 'date'),
      current: this.parseProperty(properties.Current, 'checkbox'),
      description: this.parseProperty(properties.Description, 'rich_text'),
      technologies: this.parseProperty(properties.Technologies, 'multi_select'),
    };
  }

  /**
   * 解析教育背景
   */
  static parseEducation(page: any): Education {
    const properties = page.properties;
    return {
      id: page.id,
      school: this.parseProperty(properties.School, 'rich_text'),
      degree: this.parseProperty(properties.Degree || properties.Name, 'title'),
      field: this.parseProperty(properties.Field, 'rich_text'),
      startDate: this.parseProperty(properties.StartDate, 'date'),
      endDate: this.parseProperty(properties.EndDate, 'date'),
      gpa: this.parseProperty(properties.GPA, 'rich_text'),
    };
  }

  /**
   * 解析專案
   */
  static parseProject(page: any): Project {
    const properties = page.properties;
    return {
      id: page.id,
      name: this.parseProperty(properties.Name, 'title'),
      description: this.parseProperty(properties.Description, 'rich_text'),
      technologies: this.parseProperty(properties.Technologies, 'multi_select'),
      githubUrl: this.parseProperty(properties.GitHubURL, 'url'),
      liveUrl: this.parseProperty(properties.LiveURL, 'url'),
      image: this.parseProperty(properties.Image, 'files'),
    };
  }

  /**
   * 解析技能
   */
  static parseSkill(page: any): Skill {
    const properties = page.properties;
    return {
      id: page.id,
      category: this.parseProperty(properties.Category, 'select'),
      name: this.parseProperty(properties.Name, 'title'),
      level: this.parseProperty(properties.Level, 'select') as Skill['level'],
    };
  }
}
