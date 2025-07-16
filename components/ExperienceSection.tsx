'use client';

import { useState } from 'react';
import { Experience } from '../types/notion';
import { NotionBlock } from '../types/notion';

interface ExperienceSectionProps {
  experiences: Experience[];
}

// 🎨 Experience 詳細內容渲染器
const ExperienceDetailRenderer = ({ blocks }: { blocks: NotionBlock[] }) => {
  const BlockRenderer = ({ block }: { block: NotionBlock }) => {
    switch (block.type) {
      case 'paragraph':
        if (!block.content.trim()) return <div className="h-2" />;
        return (
          <p className="text-gray-700 mb-3 leading-relaxed">
            {block.content}
          </p>
        );

      case 'heading_1':
        return (
          <h4 className="text-lg font-bold text-gray-900 mb-3 mt-4">
            {block.content}
          </h4>
        );

      case 'heading_2':
        return (
          <h5 className="text-md font-semibold text-gray-900 mb-2 mt-3">
            {block.content}
          </h5>
        );

      case 'heading_3':
        return (
          <h6 className="text-sm font-medium text-gray-900 mb-2 mt-2">
            {block.content}
          </h6>
        );

      case 'bulleted_list_item':
        return (
          <li className="text-gray-700 mb-1 ml-4 list-disc">
            {block.content}
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
          <li className="text-gray-700 mb-1 ml-4 list-decimal">
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

      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-blue-50 italic text-gray-700">
            {block.content}
          </blockquote>
        );

      case 'callout':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 my-3">
            <div className="flex items-start space-x-2">
              {block.callout?.icon && (
                <span className="text-lg">{block.callout.icon}</span>
              )}
              <p className="text-yellow-800 flex-1">{block.content}</p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="my-4">
            <img
              src={block.image?.url}
              alt={block.image?.caption || ''}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
            {block.image?.caption && (
              <p className="text-xs text-gray-500 text-center mt-1">
                {block.image.caption}
              </p>
            )}
          </div>
        );

      case 'divider':
        return <hr className="my-4 border-gray-300" />;

      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded p-2 my-2">
            <p className="text-xs text-gray-600">
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

// 🎨 Experience 卡片組件
const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="border-l-4 border-blue-500 pl-6 mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
        <div>
          <h4 className="text-xl font-semibold text-gray-900">
            {experience.position}
          </h4>
          <p className="text-lg text-gray-600">{experience.company}</p>
        </div>
        <span className="text-sm text-gray-500 mt-1 md:mt-0">
          {formatDate(experience.startDate)} - {
            experience.current ? '現在' : formatDate(experience.endDate)
          }
        </span>
      </div>

      {/* 基本描述 */}
      {experience.description && (
        <p className="text-gray-700 mb-3">{experience.description}</p>
      )}

      {/* 技術標籤 */}
      {experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* 🆕 詳細內容展開按鈕 */}
      {experience.hasDetailPage && experience.detailPageContent && (
        <div className="mt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="text-sm font-medium">
              {showDetails ? '收起詳細內容' : '查看詳細內容'}
            </span>
            <span className={`transform transition-transform duration-200 ${
              showDetails ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </button>

          {/* 詳細內容 */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="text-md font-semibold text-gray-900 mb-3">
                📋 詳細工作內容
              </h5>
              <ExperienceDetailRenderer blocks={experience.detailPageContent} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) return null;

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">工作經驗</h3>
      <div className="space-y-6">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </section>
  );
}

/** 
可以進一步客製化 Experience 詳細內容的顯示樣式：

```typescript
// 例如為不同公司使用不同的主題色彩
const getCompanyTheme = (company: string) => {
  const themes = {
    'Google': 'border-red-500 bg-red-50',
    'Microsoft': 'border-blue-500 bg-blue-50', 
    'Apple': 'border-gray-500 bg-gray-50',
    default: 'border-blue-500 bg-blue-50'
  };
  return themes[company] || themes.default;
};

*/