import { PersonalInfo } from '../types/notion';

interface HeaderProps {
  personalInfo: PersonalInfo;
}

export default function Header({ personalInfo }: HeaderProps) {
  return (
    <>
      {/* Fixed Header，獨立於 hero-bg 外層 */}
      <header className="fixed top-0 left-0 z-50 w-full bg-gray-900/45 transition-all duration-300">
        <div className="container flex items-center justify-between px-14 py-5 text-white">
          <div>Pandaaaaa 🐼🐼🐼</div>
          <ul className="font-marcellus flex space-x-6">
            <li>
              <a href="#">About/ 關於我</a>
            </li>
            <li>
              <a href="#">Project/ 專案</a>
            </li>
            <li>
              <a href="#">Works/ 工作經歷</a>
            </li>
          </ul>
        </div>
      </header>
      {/* 增加 padding-top，避免 header 遮住內容 */}
      <div className="hero-bg mx-auto w-full max-w-[1280px] px-14 pt-[70px] text-white">
        <div className="mt-[111px] flex min-h-[calc(100vh-64px)] justify-end">
          <div className="w-[413px]">
            <h2 className="font-baskervville text-3xl font-medium">Portfolio</h2>
            <h6 className="font-roboto mb-4 font-medium">{personalInfo.title}</h6>
            <h1 className="font-baskervville mb-2 text-7xl font-medium">{personalInfo.name}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
