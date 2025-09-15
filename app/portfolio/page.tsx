'use client';

import { useResumeData } from '@/hooks';
import Header from '@/components/Header';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import EducationSection from '@/components/EducationSection';
import PageContentSection from '@/components/PageContentSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function PortfolioPage() {
  const { data: resumeData, loading, error, refetch } = useResumeData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!resumeData) {
    return <ErrorMessage error="無法載入履歷資料" onRetry={refetch} />;
  }

  const { personalInfo, experiences, projects, skills, education, pageContent } = resumeData;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header personalInfo={personalInfo} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {experiences.length > 0 && <ExperienceSection experiences={experiences} />}
        {education.length > 0 && <EducationSection education={education} />}
        {projects.length > 0 && <ProjectsSection projects={projects} />}
        {skills.length > 0 && <SkillsSection skills={skills} />}
        {pageContent && <PageContentSection pageContent={pageContent} />}
      </div>
    </main>
  );
}
