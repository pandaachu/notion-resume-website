'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CassetteLoader = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // 淡出後跳轉到首頁
      setTimeout(() => {
        router.push('/portfolio'); // 或你的首頁路徑
      }, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#090E11] transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="">
        {/* 錄音帶動畫 */}
        <div className="relative"></div>
        {/* 錄音帶主體 */}
        <div className="relative">
          {/* 左側轉盤 */}
          <div className="absolute top-[41.5%] left-[33%] flex h-17 w-17 items-center justify-center rounded-full border-4 border-[#d5c8be] bg-gray-900">
            <div className="relative h-13 w-13 overflow-hidden rounded-full bg-gray-800">
              {/* 轉盤孔洞 - 會旋轉 */}
              <div className="animate-spin-slow absolute inset-0">
                <div className="relative h-full w-full">
                  {/* 中心孔 */}
                  <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-900"></div>
                  {/* 外圍小孔 */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-1 rounded-full bg-[#d5c8be]"
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
          <div className="absolute top-[41.5%] right-[32%] flex h-17 w-17 items-center justify-center rounded-full border-4 border-[#d5c8be] bg-gray-900">
            <div className="relative h-13 w-13 overflow-hidden rounded-full bg-gray-800">
              {/* 轉盤孔洞 - 會旋轉 */}
              <div className="animate-spin-slow absolute inset-0">
                <div className="relative h-full w-full">
                  {/* 中心孔 */}
                  <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gray-900"></div>
                  {/* 外圍小孔 */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-1 rounded-full bg-[#d5c8be]"
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
          <Image src={'/images/Loading.png'} alt={'cassette'} width={656} height={480} />
        </div>

        {/* Loading 文字和進度條 */}
        {/* <div className="space-y-4 text-center">
          <div className="text-xl font-light tracking-wider">Loading Portfolio...</div>

          <div className="h-1 w-80 overflow-hidden rounded-full bg-gray-700">
            <div className="animate-loading-bar h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>

          <div className="font-mono text-sm">Please wait while we prepare your experience</div>
        </div> */}
      </div>
    </div>
  );
};

export default CassetteLoader;
