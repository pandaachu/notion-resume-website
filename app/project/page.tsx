// app/project/page.tsx
import { getProjects } from '@/lib/notionPortfolio';
import ProjectsSection2 from '@/components/ProjectsSection2';
import DevUpdateButton from '@/components/DevUpdateButton';
import Link from 'next/link';
import { Metadata } from 'next';

// 🎯 設定更新頻率
export const revalidate = 1800; // 30 分鐘自動更新

// 🎯 設定頁面 metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projects - Portfolio',
    description: '我的專案作品集',
  };
}

// 🔥 靜態生成 - 只獲取 projects
export default async function ProjectPage() {
  let projects = [] as any[];
  let error: unknown = null;

  try {
    console.log('📊 Fetching projects data only...');

    // 🎯 只獲取 projects 資料
    projects = await getProjects();

    console.log(`✅ Fetched ${projects.length} projects`);
  } catch (err) {
    console.error('❌ Error loading projects:', err);
    error = err;
  }

  // 錯誤處理
  if (error && projects.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md text-center">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <h1 className="mb-4 text-2xl font-bold text-red-900">⚠️ 無法載入專案資料</h1>
            <p className="mb-6 text-red-700">請稍後再試或返回主頁</p>
            <Link href="/portfolio" className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              返回主頁
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2F2F2F]">
      {/* 簡單的 Header (不需要個人資訊) */}
      <header className="fixed top-0 left-0 z-50 w-full bg-gray-900/45 backdrop-blur">
        <div className="container flex items-center justify-between px-14 py-5 text-white">
          <div>
            <Link href="/portfolio" className="hover:opacity-80">
              Pandaaaaa 🐼🐼🐼
            </Link>
          </div>
          <ul className="font-marcellus flex space-x-6">
            <li>
              <Link href="/portfolio" className="hover:text-gray-300">
                About/ 關於我
              </Link>
            </li>
            <li>
              <span className="text-yellow-400">Project/ 專案</span>
            </li>
            <li>
              <Link href="/portfolio#experience" className="hover:text-gray-300">
                Works/ 工作經歷
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* 專案標題區 */}
      <section className="pt-20 pb-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">My Projects</h1>
          <p className="text-lg text-gray-300">探索我的作品集，包含各種網站開發、應用程式與創意專案</p>
        </div>
      </section>

      {/* 專案列表 */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {projects.length > 0 ? (
          <ProjectsSection2 projects={projects} />
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-yellow-800">尚無專案資料</h3>
            <p className="text-yellow-700">請在 Notion 中添加專案資料</p>
          </div>
        )}
      </div>

      {/* 返回按鈕 */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        <Link href="/portfolio" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>返回主頁</span>
        </Link>
      </div>

      {/* 開發模式資訊 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mx-auto max-w-7xl px-4 pb-8">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-gray-800">
            <p className="text-sm text-blue-700">
              📊 專案數量：{projects.length} | 🕐 更新頻率：每 {revalidate / 60} 分鐘 | ⏰ 生成時間：
              {new Date().toLocaleTimeString('zh-TW')}
            </p>
          </div>
        </div>
      )}

      {/* 開發用更新按鈕 */}
      <DevUpdateButton />
    </main>
  );
}
