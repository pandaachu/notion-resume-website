'use client';
import React, { useState, useEffect } from 'react';

const CassetteLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 7秒後開始淡出
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 7000);

    // 8秒後完全隱藏載入畫面
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="relative scale-125 transform">
            {/* 錄音帶主體 */}
            <div className="relative h-52 w-80 overflow-hidden rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 shadow-2xl">
              {/* 頂部橘色條紋 */}
              <div className="absolute top-0 right-0 left-0 h-8 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400"></div>

              {/* MICROCASSETTE 標籤 */}
              <div className="absolute top-1 right-4 flex items-center rounded bg-white px-2 py-0.5 text-xs font-bold">
                MICROCASSETTE™
                <svg className="ml-1 h-0 w-0">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#ff6b35" />
                    </marker>
                  </defs>
                </svg>
                <div className="ml-1 h-0 w-0 border-y-4 border-l-8 border-y-transparent border-l-orange-500"></div>
              </div>

              {/* SONY 品牌名稱 */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 transform">
                <div
                  className="text-4xl font-bold tracking-wider text-gray-800"
                  style={{ fontFamily: 'Arial Black, sans-serif' }}
                >
                  SONY
                </div>
                {/* 刻度標記 */}
                <div className="mt-1 flex justify-center space-x-1">
                  <span className="text-xs text-gray-600">0</span>
                  <div className="flex items-center space-x-0.5">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className={`w-0.5 ${i === 5 ? 'h-3 bg-orange-500' : 'h-2 bg-gray-400'}`}></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">10</span>
                </div>
              </div>

              {/* 捲軸容器 */}
              <div className="absolute top-24 left-1/2 flex -translate-x-1/2 transform space-x-16">
                {/* 左捲軸 */}
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-inner"></div>
                  <div className="absolute inset-2 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-amber-200">
                    {/* 磁帶 */}
                    <div className="animate-spin-slow absolute inset-0 rounded-full bg-gradient-to-br from-amber-900 to-amber-800">
                      {/* 捲軸中心 */}
                      <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white shadow-md">
                        {/* 齒輪圖案 */}
                        <svg className="animate-spin-slow h-full w-full" viewBox="0 0 24 24">
                          {[...Array(6)].map((_, i) => (
                            <rect
                              key={i}
                              x="11"
                              y="2"
                              width="2"
                              height="5"
                              fill="#666"
                              transform={`rotate(${i * 60} 12 12)`}
                            />
                          ))}
                        </svg>
                      </div>
                      {/* 磁帶紋理 */}
                      <div className="absolute inset-0 opacity-30">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full border border-amber-700"
                            style={{
                              top: `${10 + i * 10}%`,
                              left: `${10 + i * 10}%`,
                              right: `${10 + i * 10}%`,
                              bottom: `${10 + i * 10}%`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右捲軸 */}
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-inner"></div>
                  <div className="absolute inset-2 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-amber-200">
                    {/* 磁帶 - 右邊較少 */}
                    <div className="animate-spin-slow-reverse absolute inset-3 rounded-full bg-gradient-to-br from-amber-900 to-amber-800">
                      {/* 捲軸中心 */}
                      <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white shadow-md">
                        {/* 齒輪圖案 */}
                        <svg className="animate-spin-slow-reverse h-full w-full" viewBox="0 0 24 24">
                          {[...Array(6)].map((_, i) => (
                            <rect
                              key={i}
                              x="11"
                              y="2"
                              width="2"
                              height="5"
                              fill="#666"
                              transform={`rotate(${i * 60} 12 12)`}
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* A面標記 */}
              <div className="absolute top-24 right-8 text-3xl font-bold text-gray-800">A</div>

              {/* MC-60 標籤 */}
              <div className="absolute right-0 bottom-12 left-0 h-8 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800">
                <div className="flex h-full items-center justify-center text-lg font-bold tracking-wider text-white">
                  MC-60
                </div>
              </div>

              {/* 底部標籤區域 */}
              <div className="absolute right-0 bottom-0 left-0 h-12 border-t border-gray-300 bg-gradient-to-b from-gray-100 to-gray-200">
                <div className="flex h-full items-center px-4">
                  <span className="text-sm font-medium text-gray-600">title</span>
                  <div className="ml-4 flex-1 border-b-2 border-gray-400"></div>
                </div>
              </div>

              {/* 磁帶連接線動畫 */}
              <div className="absolute top-32 right-24 left-24 h-0.5 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 opacity-50"></div>
            </div>

            {/* 倒影效果 */}
            <div className="absolute right-0 -bottom-4 left-0 h-32 bg-gradient-to-t from-transparent to-black/20 blur-xl"></div>

            {/* 載入文字 */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform animate-pulse text-sm tracking-widest text-white">
              LOADING...
            </div>
          </div>
        </div>
      )}

      {/* 主要內容 */}
      <div className={`transition-opacity duration-1000 ${isLoading && !fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        {children || (
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <h1 className="mb-4 text-6xl font-bold text-gray-800">Welcome</h1>
              <p className="text-xl text-gray-600">Your main content goes here</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 2.5s linear infinite;
        }
      `}</style>
    </>
  );
};

// 示例使用
export default function CassetteLoader2() {
  return (
    <CassetteLoader>
      {/* 這裡放置你的主要頁面內容 */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <header className="mb-16 text-center">
            <h1 className="mb-4 text-5xl font-bold text-gray-800">復古音樂播放器</h1>
            <p className="text-xl text-gray-600">重溫經典卡帶時光</p>
          </header>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <div className="transform rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 text-4xl">🎵</div>
              <h2 className="mb-2 text-2xl font-semibold">經典收藏</h2>
              <p className="text-gray-600">探索數千首經典歌曲</p>
            </div>

            <div className="transform rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 text-4xl">📼</div>
              <h2 className="mb-2 text-2xl font-semibold">播放清單</h2>
              <p className="text-gray-600">創建你的專屬混音帶</p>
            </div>

            <div className="transform rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
              <div className="mb-4 text-4xl">🎧</div>
              <h2 className="mb-2 text-2xl font-semibold">高品質音訊</h2>
              <p className="text-gray-600">享受無損音質體驗</p>
            </div>
          </div>
        </div>
      </div>
    </CassetteLoader>
  );
}
