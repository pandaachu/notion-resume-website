import { getResumeData } from '@/lib/notionPortfolio';
import Header from '@/components/Header';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
// import ProjectsSection2 from '@/components/ProjectsSection2';
import SkillsSection from '@/components/SkillsSection';
import EducationSection from '@/components/EducationSection';
import PageParagraphSection from '@/components/PageParagraphSection';
import { Metadata } from 'next';
import DevUpdateButton from '@/components/DevUpdateButton';
// import CassetteLoader from '@/components/CassetteLoader';

// 🎯 設定更新頻率（選一個）
export const revalidate = 1800; // 30 分鐘自動更新
// export const revalidate = 3600; // 1 小時自動更新
// export const revalidate = 300; // 5 分鐘自動更新

// 🎯 設定頁面 metadata（SEO）
export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getResumeData();
    const { personalInfo } = data;

    return {
      title: `${personalInfo.name} - ${personalInfo.title}`,
      description: personalInfo.summary,
      openGraph: {
        title: `${personalInfo.name} - Portfolio`,
        description: personalInfo.summary,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Portfolio',
      description: 'Personal Portfolio Website',
    };
  }
}

// 🔥 改成 async 函數，直接獲取資料
export default async function PortfolioPage() {
  let resumeData;
  let error: unknown = null;

  try {
    console.log('📊 Fetching resume data at build/request time...');

    // 直接在伺服器端獲取資料，不透過 API
    resumeData = await getResumeData();

    console.log('✅ Resume data fetched successfully');
  } catch (err) {
    console.error('❌ Error loading portfolio:', err);
    error = err;

    // 使用預設資料避免頁面崩潰
    resumeData = {
      personalInfo: {
        id: 'error',
        name: '載入中',
        title: '請稍後',
        email: '',
        phone: '',
        location: '',
        summary: '資料載入中，請稍後再試',
        avatar: '',
        linkedin: '',
        githubUrl: '',
        website: '',
      },
      experiences: [],
      education: [],
      // projects: [],
      skills: [],
      pageContent: undefined,
      specialSections: [],
    };
  }

  const {
    personalInfo,
    experiences = [],
    projects = [],
    skills = [],
    education = [],
    pageContent,
    specialSections = [],
  } = resumeData;

  // 如果有錯誤，顯示錯誤頁面
  if (error && !personalInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md text-center">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <h1 className="mb-4 text-2xl font-bold text-red-900">⚠️ 暫時無法載入履歷</h1>
            <p className="mb-6 text-red-700">請稍後再試或聯絡網站管理員</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer font-medium text-red-800">錯誤詳情</summary>
                <pre className="mt-2 overflow-auto rounded bg-red-100 p-3 text-xs">
                  {error instanceof Error ? error.message : String(error)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </main>
    );
  }
  // 正常渲染頁面
  return (
    <main className="min-h-screen">
      {/* 頁首 - 個人資訊 */}
      <Header personalInfo={personalInfo} />

      {/* 關於我 */}
      {personalInfo && <AboutSection personalInfo={personalInfo} pageContent={pageContent} />}

      {/* 特殊區塊（如果有） */}
      {specialSections &&
        specialSections.length > 0 &&
        specialSections.map((section: any, index: number) => (
          <PageParagraphSection key={section?.id || `section-${index}`} pageContent={section} />
        ))}

      {/* 專案作品 - 使用新版組件 */}
      {/* {projects.length > 0 && <ProjectsSection2 projects={projects} />} */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 工作經驗 */}
        {experiences.length > 0 && <ExperienceSection experiences={experiences} />}

        {/* 教育背景 */}
        {education.length > 0 && <EducationSection education={education} />}

        {/* 技能 */}
        {skills.length > 0 && <SkillsSection skills={skills} />}

        {/* 如果都沒有資料，顯示提示 */}
        {experiences.length === 0 && education.length === 0 && projects.length === 0 && skills.length === 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-yellow-800">尚未設定履歷內容</h3>
            <p className="text-yellow-700">請在 Notion 中添加你的履歷資料</p>
          </div>
        )}

        {/* 開發模式：顯示更新資訊 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-blue-800">🔄 靜態生成模式</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>📊 資料筆數：</p>
              <ul className="ml-6 list-disc">
                <li>工作經驗：{experiences.length}</li>
                <li>教育背景：{education.length}</li>
                <li>專案作品：{projects.length}</li>
                <li>技能項目：{skills.length}</li>
              </ul>
              <p className="mt-3">⏱️ 更新頻率：每 {revalidate / 60} 分鐘自動更新</p>
              <p>🕐 生成時間：{new Date().toLocaleString('zh-TW')}</p>
            </div>
          </div>
        )}
      </div>

      {/* 頁尾更新時間標記（生產環境隱藏） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed right-0 bottom-0 rounded-tl-lg bg-gray-900 px-3 py-1 text-xs text-white">
          Last Build: {new Date().toLocaleTimeString('zh-TW')}
        </div>
      )}
      <DevUpdateButton />
    </main>
  );
}
