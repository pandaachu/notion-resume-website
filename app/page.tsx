import { getResumeData } from '../lib/notion'
import Header from '@/components/Header'
import ExperienceSection from '@/components/ExperienceSection'
import ProjectsSection from '@/components/ProjectsSection'
import SkillsSection from '@/components/SkillsSection'
import EducationSection from '@/components/EducationSection'

export const revalidate = 3600 // 每小時重新驗證

export default async function HomePage() {
  try {
    const resumeData = await getResumeData()
    console.log("🚀 ~ HomePage ~ resumeData:", resumeData)
    const { personalInfo, experiences, projects, skills, education } = resumeData

    return (
      <main className="min-h-screen bg-gray-50">
        <Header personalInfo={personalInfo} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ExperienceSection experiences={experiences} />
          <EducationSection education={education} />
          <ProjectsSection projects={projects} />
          <SkillsSection skills={skills} />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading resume data:', error)
    
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            載入履歷資料時發生錯誤
          </h1>
          <p className="text-gray-600">
            請檢查 Notion 設定或稍後再試
          </p>
        </div>
      </main>
    )
  }
}