export interface PersonalInfo {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  avatar?: string;
  linkedin?: string;
  githubUrl?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies: string[];
  hasDetailPage?: boolean; // 是否有詳細頁面
  detailPageId?: string; // 詳細頁面的 ID
  detailPageContent?: NotionBlock[]; // 詳細頁面的內容
  detailPageTitle?: string; // 詳細頁面的標題
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface PageContent {
  id: string;
  title: string;
  blocks: NotionBlock[];
  last_edited_time: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  content: string;
  rich_text?: any[];
  children?: NotionBlock[];
  // 特殊屬性
  heading?: {
    level: 1 | 2 | 3;
    content: string;
  };
  paragraph?: {
    content: string;
    rich_text: any[];
  };
  image?: {
    url: string;
    caption?: string;
  };
  quote?: {
    content: string;
  };
  callout?: {
    icon?: string;
    content: string;
  };
  bulleted_list_item?: {
    content: string;
  };
  numbered_list_item?: {
    content: string;
  };
  child_database?: {
    title: string;
    database_id: string;
  };
  child_page?: {
    title: string;
    page_id: string;
  };
  toggle?: {
    title: string;
    children: NotionBlock[];
  };
}
export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  pageContent?: PageContent;
}

export interface Heading1Block {
  id: string;
  type: 'heading_1';
  content: string;
  heading: {
    level: 1;
    content: string;
  };
}
