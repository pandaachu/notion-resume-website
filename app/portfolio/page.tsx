import { getResumeData } from '@/lib/notionPortfolio'
import Header from '@/components/Header'
import PageContentSection from '@/components/PageContentSection'
import ExperienceSection from '@/components/ExperienceSection'
import ProjectsSection from '@/components/ProjectsSection'
import SkillsSection from '@/components/SkillsSection'
import EducationSection from '@/components/EducationSection'

export const revalidate = 3600 // 每小時重新驗證

export default async function HomePage() {
  try {
    const resumeData = await getResumeData()
    const { personalInfo, experiences, projects, skills, education, pageContent } = resumeData


    return (
      <main className="min-h-screen bg-gray-50">
        <Header personalInfo={personalInfo} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                歡迎使用多 Table 履歷網站！
              </h3>
              <p className="text-yellow-700 mb-4">
                目前沒有找到履歷資料。請檢查以下設定：
              </p>
              <div className="text-left max-w-md mx-auto space-y-2 text-sm text-yellow-600 mb-6">
                <p>• 確認所有 Database ID 已正確設定</p>
                <p>• 檢查每個 Notion Table 中是否有資料</p>
                <p>• 驗證 Integration 權限已設定</p>
                <p>• 確保所有 Table 的欄位結構正確</p>
              </div>
              <div className="space-y-2">
                <a 
                  href="/debug" 
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mr-2"
                >
                  🔍 檢查連接狀態
                </a>
                <a 
                  href="/setup" 
                  className="inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                >
                  📋 查看設定指南
                </a>
              </div>
            </div>
          )}

          {/* 多 Table 架構資訊 (只在開發環境顯示) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                🏗️ 多 Table 架構模式
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
              <p className="text-xs text-blue-600 mt-3 text-center">
                此資訊只在開發環境顯示
              </p>
            </div>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('❌ 載入履歷資料時發生錯誤 (多 Table 模式):', error)
    
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-900 mb-4">
              🚫 多 Table 載入錯誤
            </h1>
            <p className="text-red-700 mb-6">
              無法載入履歷資料，請檢查多 Table 設定：
            </p>
            <div className="text-left space-y-2 text-sm text-red-600 mb-6">
              <p>• 檢查所有 5 個 Database ID 設定</p>
              <p>• 確認每個 Table 的 Integration 權限</p>
              <p>• 驗證每個 Table 的欄位結構</p>
              <p>• 確保至少有個人資訊資料</p>
            </div>
            <div className="space-y-2">
              <a 
                href="/debug" 
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                🔍 檢查所有 Database 連接
              </a>
              <a 
                href="/setup" 
                className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                📋 查看多 Table 設定指南
              </a>
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-red-800 font-medium">
                  🐛 顯示錯誤詳情
                </summary>
                <pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-auto">
                  {String(error)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </main>
    )
  }
}