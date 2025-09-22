'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* Fixed Header，獨立於 hero-bg 外層 */}
      <header className="fixed top-0 left-0 z-50 w-full bg-gray-900/45 transition-all duration-300">
        <div className="container flex items-center justify-between px-14 py-5 text-white">
          <div>Pandaaaaa 🐼🐼🐼</div>
          <ul className="font-marcellus flex space-x-6">
            <li>
              <Link href="/portfolio" className="hover:text-gray-300">
                About/ 關於我
              </Link>
            </li>
            <li>
              <Link href="/project" className="hover:text-gray-300">
                Project/ 專案
              </Link>
            </li>
            <li>
              <a href="#">Works/ 工作經歷</a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
