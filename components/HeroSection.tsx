'use client';
import { PersonalInfo } from '../types/notion';
import { usePersonalInfo } from '@/hooks/useResumeData';
interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

export default function HeroSection() {
  const { personalInfo, isLoading } = usePersonalInfo();
  return (
    <>
      {/* 增加 padding-top，避免 header 遮住內容 */}
      <div className="hero-bg mx-auto w-full max-w-[1280px] px-14 pt-[70px] text-white">
        <div className="mt-[111px] flex min-h-[calc(100vh-64px)] justify-end">
          <div className="w-[413px]">
            <h2 className="font-baskervville text-3xl font-medium">Portfolio</h2>
            <h6 className="font-roboto mb-4 font-medium">{personalInfo?.title}</h6>
            <h1 className="font-baskervville mb-2 text-7xl font-medium">{personalInfo?.name}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
