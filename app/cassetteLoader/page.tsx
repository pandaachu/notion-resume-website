'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CassetteLoader = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //     // 淡出後跳轉到首頁
  //     setTimeout(() => {
  //       router.push('/home'); // 或你的首頁路徑
  //     }, 500);
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* 錄音帶動畫 */}
        <div className="relative">
          {/* 錄音帶主體 */}
          <div className="relative h-48 w-80 overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800 shadow-2xl">
            {/* 錄音帶標籤 */}
            <div className="absolute top-4 right-4 left-4 flex h-16 items-center justify-center rounded bg-gray-700">
              <div className="font-mono text-sm text-gray-300">PORTFOLIO</div>
            </div>

            {/* 左側轉盤 */}
            <div className="absolute top-20 left-12 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-600 bg-gray-900">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-800">
                {/* 轉盤孔洞 - 會旋轉 */}
                <div className="animate-spin-slow absolute inset-0">
                  <div className="relative h-full w-full">
                    {/* 中心孔 */}
                    <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-900"></div>
                    {/* 外圍小孔 */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-gray-600"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-20px)`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 右側轉盤 */}
            <div className="absolute top-20 right-12 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-600 bg-gray-900">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-800">
                {/* 轉盤孔洞 - 會旋轉 */}
                <div className="animate-spin-slow absolute inset-0">
                  <div className="relative h-full w-full">
                    {/* 中心孔 */}
                    <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-900"></div>
                    {/* 外圍小孔 */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-gray-600"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-20px)`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 連接兩個轉盤的磁帶 */}
            <div className="absolute top-28 right-24 left-24 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 shadow-sm">
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
            </div>

            {/* 錄音帶底部細節 */}
            <div className="absolute right-4 bottom-4 left-4 flex h-8 items-center justify-between rounded bg-gray-700 px-4">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
              <div className="font-mono text-xs text-gray-400">SIDE A</div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* 發光效果 */}
          <div className="absolute -inset-4 animate-pulse rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
        </div>

        {/* Loading 文字和進度條 */}
        <div className="space-y-4 text-center">
          <div className="text-xl font-light tracking-wider text-gray-300">Loading Portfolio...</div>

          {/* 進度條 */}
          <div className="h-1 w-80 overflow-hidden rounded-full bg-gray-700">
            <div className="animate-loading-bar h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>

          <div className="font-mono text-sm text-gray-500">Please wait while we prepare your experience</div>
        </div>
      </div>
    </div>
  );
};

export default CassetteLoader;
