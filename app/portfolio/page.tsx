import { getResumeData } from '@/lib/notionPortfolio';
import Header from '@/components/Header';
import PageContentSection from '@/components/PageContentSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import EducationSection from '@/components/EducationSection';

export const revalidate = 3600; // 每小時重新驗證

export default async function HomePage() {
  try {
    const resumeData = await getResumeData();
    const { personalInfo, experiences, projects, skills, education, pageContent } = resumeData;

    return (
      <main className="min-h-screen">
        <Header personalInfo={personalInfo} />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 工作經驗 */}
          {experiences.length > 0 && <ExperienceSection experiences={experiences} />}

          {/* 教育背景 */}
          {education.length > 0 && <EducationSection education={education} />}

          {/* 專案作品 */}
          {projects.length > 0 && <ProjectsSection projects={projects} />}

          {/* 技能 */}
          {skills.length > 0 && <SkillsSection skills={skills} />}

          {/* 🆕 頁面內容區塊 */}
          {pageContent && <PageContentSection pageContent={pageContent} />}

          {/* 如果沒有任何資料的提示 */}
          {experiences.length === 0 && education.length === 0 && projects.length === 0 && skills.length === 0 && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
              <h3 className="mb-2 text-lg font-semibold text-yellow-800">歡迎使用多 Table 履歷網站！</h3>
              <p className="mb-4 text-yellow-700">目前沒有找到履歷資料。請檢查以下設定：</p>
              <div className="mx-auto mb-6 max-w-md space-y-2 text-left text-sm text-yellow-600">
                <p>• 確認所有 Database ID 已正確設定</p>
                <p>• 檢查每個 Notion Table 中是否有資料</p>
                <p>• 驗證 Integration 權限已設定</p>
                <p>• 確保所有 Table 的欄位結構正確</p>
              </div>
              <div className="space-y-2">
                <a
                  href="/debug"
                  className="mr-2 inline-block rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  🔍 檢查連接狀態
                </a>
                <a
                  href="/setup"
                  className="inline-block rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                >
                  📋 查看設定指南
                </a>
              </div>
            </div>
          )}

          {/* 多 Table 架構資訊 (只在開發環境顯示) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-blue-800">🏗️ 多 Table 架構模式</h3>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{experiences.length}</div>
                  <div className="text-blue-700">工作經驗</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{education.length}</div>
                  <div className="text-green-700">教育背景</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{projects.length}</div>
                  <div className="text-purple-700">專案作品</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{skills.length}</div>
                  <div className="text-orange-700">技能項目</div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-blue-600">此資訊只在開發環境顯示</p>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error('❌ 載入履歷資料時發生錯誤 (多 Table 模式):', error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md text-center">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <h1 className="mb-4 text-2xl font-bold text-red-900">🚫 多 Table 載入錯誤</h1>
            <p className="mb-6 text-red-700">無法載入履歷資料，請檢查多 Table 設定：</p>
            <div className="mb-6 space-y-2 text-left text-sm text-red-600">
              <p>• 檢查所有 5 個 Database ID 設定</p>
              <p>• 確認每個 Table 的 Integration 權限</p>
              <p>• 驗證每個 Table 的欄位結構</p>
              <p>• 確保至少有個人資訊資料</p>
            </div>
            <div className="space-y-2">
              <a
                href="/debug"
                className="block w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                🔍 檢查所有 Database 連接
              </a>
              <a
                href="/setup"
                className="block w-full rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
              >
                📋 查看多 Table 設定指南
              </a>
              <details className="mt-4 text-left">
                <summary className="cursor-pointer font-medium text-red-800">🐛 顯示錯誤詳情</summary>
                <pre className="mt-2 overflow-auto rounded bg-red-100 p-3 text-xs">{String(error)}</pre>
              </details>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
