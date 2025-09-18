'use client';

import { useResumeData } from '@/hooks/useResumeData';
import { LoadingWrapper, SkeletonLoader, ErrorState, EmptyState, LoadingOverlay } from '@/components/LoadingStates';
import Header from '@/components/Header';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection2 from '@/components/ProjectsSection2';
import SkillsSection from '@/components/SkillsSection';
import EducationSection from '@/components/EducationSection';
import PageParagraphSection from '@/components/PageParagraphSection';

/**
 * 作品集主頁面 - 使用 Custom Hooks 管理狀態
 */
export default function PortfolioPage() {
  const { data, isLoading, isValidating, error, refresh } = useResumeData();

  // 錯誤狀態
  if (error && !data) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  // 載入中狀態
  if (isLoading && !data) {
    return <PortfolioPageSkeleton />;
  }

  // 無資料狀態
  if (!data) {
    return <EmptyState title="尚未設定履歷資料" description="請在 Notion 中設定您的履歷資料" icon="📝" />;
  }

  const { personalInfo, experiences, projects, skills, education, pageContent, specialSections } = data;

  return (
    <>
      {/* 更新中提示 */}
      <LoadingOverlay isVisible={isValidating} />

      <main className="min-h-screen">
        {/* 頁首 */}
        <LoadingWrapper isLoading={!personalInfo} skeleton={<SkeletonLoader.PersonalInfo />}>
          <Header personalInfo={personalInfo} />
        </LoadingWrapper>

        {/* 關於我 */}
        {personalInfo && <AboutSection personalInfo={personalInfo} pageContent={pageContent} />}

        {/* 特殊區塊 */}
        {specialSections?.map((section: any, index: number) => (
          <PageParagraphSection key={section.id || index} pageContent={section} />
        ))}

        {/* 專案作品 */}
        {projects.length > 0 && <ProjectsSection2 projects={projects} />}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 工作經驗 */}
          <LoadingWrapper
            isLoading={isLoading}
            skeleton={
              <section className="mb-12">
                <h3 className="mb-6 text-2xl font-bold">工作經驗</h3>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <SkeletonLoader.Experience key={i} />
                  ))}
                </div>
              </section>
            }
          >
            {experiences.length > 0 && <ExperienceSection experiences={experiences} />}
          </LoadingWrapper>

          {/* 教育背景 */}
          {education.length > 0 && <EducationSection education={education} />}

          {/* 技能 */}
          <LoadingWrapper
            isLoading={isLoading}
            skeleton={
              <section className="mb-12">
                <h3 className="mb-6 text-2xl font-bold">技能</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <SkeletonLoader.SkillGroup key={i} />
                  ))}
                </div>
              </section>
            }
          >
            {skills.length > 0 && <SkillsSection skills={skills} />}
          </LoadingWrapper>

          {/* 刷新按鈕（開發模式） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed right-4 bottom-4 z-50">
              <button
                onClick={refresh}
                disabled={isValidating}
                className={`rounded-full bg-blue-600 p-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl ${isValidating ? 'cursor-not-allowed opacity-50' : ''} `}
                title="刷新資料"
              >
                <svg
                  className={`h-6 w-6 ${isValidating ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* 開發模式資訊 */}
          {process.env.NODE_ENV === 'development' && (
            <DevInfo
              dataCount={{
                experiences: experiences.length,
                education: education.length,
                projects: projects.length,
                skills: skills.length,
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}

/**
 * 頁面骨架載入
 */
function PortfolioPageSkeleton() {
  return (
    <main className="min-h-screen">
      <SkeletonLoader.PersonalInfo />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <section>
            <SkeletonLoader.Title className="mb-6" />
            <SkeletonLoader.Card />
          </section>
          <section>
            <SkeletonLoader.Title className="mb-6" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <SkeletonLoader.Project key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/**
 * 開發資訊組件
 */
function DevInfo({ dataCount }: { dataCount: Record<string, number> }) {
  return (
    <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-3 text-lg font-semibold text-blue-800">🏗️ 開發模式資訊</h3>
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        {Object.entries(dataCount).map(([key, count]) => (
          <div key={key} className="text-center">
            <div className="text-2xl font-bold text-blue-600">{count}</div>
            <div className="text-blue-700 capitalize">{key}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-blue-600">此資訊只在開發環境顯示</p>
    </div>
  );
}
