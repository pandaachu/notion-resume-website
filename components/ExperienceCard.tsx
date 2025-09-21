// components/ExperienceCard.tsx
// 將有互動的部分抽出成客戶端組件

'use client';

import { useState } from 'react';
import { Experience, NotionBlock } from '@/types/notion';

// Experience 詳細內容渲染器
const ExperienceDetailRenderer = ({ blocks }: { blocks: NotionBlock[] }) => {
  const BlockRenderer = ({ block }: { block: NotionBlock }) => {
    switch (block.type) {
      case 'paragraph':
        if (!block.content.trim()) return <div className="h-2" />;
        return <p className="mb-3 leading-relaxed text-[#D9D9D9]">{block.content}</p>;

      case 'heading_1':
        return (
          <>
            <h4 className="mt-10 mb-3 text-2xl font-bold tracking-wide text-[#D9D9D9]">{block.content}</h4>
            <hr className="mb-4 w-[200px] border-[#D9D9D9]" />
          </>
        );

      case 'heading_2':
        return <h5 className="mt-3 mb-2 text-xl font-semibold">{block.content}</h5>;

      case 'heading_3':
        return <h6 className="mt-2 mb-3 text-lg font-medium">{block.content}</h6>;

      case 'bulleted_list_item':
        return (
          <li className="mb-1 ml-4 list-none">
            ❏ {block.content}
            {block.children && (
              <ul className="mt-1">
                {block.children.map((child) => (
                  <BlockRenderer key={child.id} block={child} />
                ))}
              </ul>
            )}
          </li>
        );

      case 'numbered_list_item':
        return (
          <li className="mb-1 ml-4 list-decimal text-[#D9D9D9]">
            {block.content}
            {block.children && (
              <ol className="mt-1">
                {block.children.map((child) => (
                  <BlockRenderer key={child.id} block={child} />
                ))}
              </ol>
            )}
          </li>
        );

      default:
        return (
          <div className="my-2 rounded border border-gray-200 bg-gray-50 p-2">
            <p className="text-xs">
              [{block.type}] {block.content}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="prose prose-sm max-w-none">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};

// Experience 卡片組件（客戶端）
export default function ExperienceCard({ experience }: { experience: Experience }) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="relative container">
      <div className="bg-alto-500 absolute -left-1.5 h-3 w-3 rounded-full" />
      <div className="border-alto-500 border-l-1 py-10 pl-6">
        <div className="mb-3 flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <h4 className="text-alto-900 text-xl font-semibold">{experience.position}</h4>
            <p className="text-lg">{experience.company}</p>
          </div>
          <span className="mt-1 text-sm md:mt-0">
            {formatDate(experience.startDate)} - {experience.current ? '現在' : formatDate(experience.endDate ?? '')}
          </span>
        </div>

        {/* 基本描述 */}
        {experience.description && <p className="mb-3">{experience.description}</p>}

        {/* 技術標籤 */}
        {experience.technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {experience.technologies.map((tech, index) => (
              <span key={index} className="bg-alto-100 rounded-full px-3 py-1 text-sm">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* 詳細內容展開按鈕 */}
        {experience.hasDetailPage && experience.detailPageContent && (
          <div className="mt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="border-alto-300 text-alto-300 hover:bg-alto-200 hover:text-gary-800 flex cursor-pointer items-center space-x-2 rounded-full border px-4 py-1 transition-all duration-300 ease-in-out"
            >
              <span className="text-sm font-medium">{showDetails ? '收起詳細內容' : '查看詳細內容'}</span>
              <span
                className={`material-symbols-rounded transform transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
              >
                {showDetails ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </button>

            {/* 詳細內容 */}
            {showDetails && (
              <div className="mt-4 rounded-xl bg-gray-800 p-4">
                <h5 className="text-md mb-3 font-semibold text-white">📋 詳細工作內容</h5>
                <ExperienceDetailRenderer blocks={experience.detailPageContent} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
