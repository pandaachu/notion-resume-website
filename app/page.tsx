import { getResumeData } from '../lib/notion';
import Header from '@/components/Header';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import EducationSection from '@/components/EducationSection';
// import { useEffect } from 'react';
// import AOS from 'aos';
import CassetteLoaderWithHistory from '@/components/CassetteLoaderWithHistory';

export const revalidate = 3600; // 每小時重新驗證

export default async function HomePage() {
  // useEffect(() => {
  //   AOS.init({
  //     duration: 800,
  //     once: false,
  //   });
  // }, []);

  try {
    const resumeData = await getResumeData();
    const { personalInfo, experiences, projects, skills, education } = resumeData;

    return (
      <main className="min-h-screen">
        <Header personalInfo={personalInfo} />
        <CassetteLoaderWithHistory />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ExperienceSection experiences={experiences} />
          <EducationSection education={education} />
          <ProjectsSection projects={projects} />
          <SkillsSection skills={skills} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading resume data:', error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">載入履歷資料時發生錯誤</h1>
          <p>請檢查 Notion 設定或稍後再試</p>
        </div>
      </main>
    );
  }
}
