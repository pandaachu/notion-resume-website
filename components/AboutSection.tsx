import { PersonalInfo } from '../types/notion';
import Image from 'next/image';
import H2Title from './H2Title';

interface Props {
  personalInfo: PersonalInfo;
  pageContent: any; // 如果需要，可以更具體地定義類型
}

const AboutSection: React.FC<Props> = ({ personalInfo, pageContent }) => {
  return (
    <>
      <section className="section-container mb-20">
        <H2Title title="About/ 關於我" className="pt-20" />
        <div className="mt-6 flex justify-between">
          <div className="relative flex flex-col items-center">
            <span className="font-baskervville relative top-3 text-3xl italic">Pandaa Chui</span>
            <Image
              src={personalInfo.avatar ?? '/default-avatar.png'}
              alt={personalInfo.name ?? 'Avatar'}
              width={359}
              height={238}
            />
          </div>
          {/* summary 遇到 \n 斷行 */}
          <div className="w-full max-w-[413px] pt-8">
            {personalInfo.summary
              .split('\n')
              .filter(Boolean)
              .map((line, idx) => (
                <p key={idx} className="mb-2 max-w-2xl text-base tracking-wide">
                  {line}
                </p>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
