'use client';

import { useState } from 'react';
import { PageContent, NotionBlock } from '../types/notion';

interface PageContentSectionProps {
  pageContent: PageContent;
}

// 🧠 基於 Toggle 標題的特殊內容識別
const getSpecialToggleType = (toggleTitle: string): string | null => {
  const title = toggleTitle.toLowerCase().trim();

  // 移除 emoji 和特殊字符進行匹配
  const cleanTitle = title.replace(/[📖⭐⚡💬🌳🏆🎯💡🤝📈🎨💝]/g, '').trim();

  // 🔧 增強的關鍵字匹配，支援更多變化
  if (cleanTitle.includes('個人使用說明書') || cleanTitle.includes('使用說明書')) return 'user_manual';
  if (cleanTitle.includes('核心價值') || cleanTitle.includes('價值觀') || cleanTitle.includes('我的核心價值'))
    return 'core_values';
  if (cleanTitle.includes('工作風格') || cleanTitle.includes('工作方式') || cleanTitle.includes('我的工作風格'))
    return 'work_style';
  if (cleanTitle.includes('溝通偏好') || cleanTitle.includes('溝通方式') || cleanTitle.includes('溝通'))
    return 'communication';
  if (cleanTitle.includes('技能樹') || cleanTitle.includes('技能發展')) return 'skill_tree';
  if (cleanTitle.includes('成就解鎖') || cleanTitle.includes('重要成就') || cleanTitle.includes('成就'))
    return 'achievements';
  if (cleanTitle.includes('興趣愛好') || cleanTitle.includes('愛好')) return 'hobbies';
  if (cleanTitle.includes('學習歷程') || cleanTitle.includes('成長軌跡')) return 'learning_journey';

  // 🆕 調試輸出，幫助診斷
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Toggle 標題識別:', {
      original: toggleTitle,
      cleaned: cleanTitle,
      matched: false,
    });
  }

  return null;
};

// 🔧 改進的內容獲取函數
const getToggleContent = (block: NotionBlock): string => {
  // 方法1: 從 toggle 屬性獲取子內容
  if (block.toggle?.children && block.toggle.children.length > 0) {
    return block.toggle.children
      .map((child) => child.content)
      .filter((content) => content.trim() !== '')
      .join('\n\n');
  }

  // 方法2: 從 children 屬性獲取子內容
  if (block.children && block.children.length > 0) {
    return block.children
      .map((child) => child.content)
      .filter((content) => content.trim() !== '')
      .join('\n\n');
  }

  // 方法3: 如果沒有子內容，返回預設訊息
  return '尚未設定內容，請在 Notion 中編輯此 Toggle 的子內容。';
};

// 🎨 特殊 Toggle 設計組件
const SpecialToggleBlock = ({ block, specialType }: { block: NotionBlock; specialType: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = getToggleContent(block);

  // 🐛 調試信息 (開發環境)
  if (process.env.NODE_ENV === 'development') {
    console.log('Toggle Debug:', {
      title: block.content,
      specialType,
      hasToggleChildren: !!block.toggle?.children?.length,
      hasDirectChildren: !!block.children?.length,
      childrenCount: block.children?.length || 0,
      toggleChildrenCount: block.toggle?.children?.length || 0,
      content: toggleContent,
    });
  }

  switch (specialType) {
    case 'user_manual':
      return (
        <div className="my-8 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-100 p-3">
                <span className="text-3xl">📖</span>
              </div>
              <div>
                <h3 className="mb-1 text-2xl font-bold text-purple-900">個人使用說明書</h3>
                <p className="text-purple-600">了解如何與我更好地合作</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 rounded-lg bg-purple-100 px-4 py-2 text-purple-700 transition-colors hover:bg-purple-200"
            >
              <span>{isExpanded ? '收起' : '展開'}</span>
              <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
          </div>

          {isExpanded && (
            <div className="prose prose-purple animate-fadeIn max-w-none">
              <div className="rounded-lg bg-white/70 p-6 backdrop-blur-sm">
                <div className="leading-relaxed whitespace-pre-line text-purple-800">{toggleContent}</div>

                {/* 🐛 調試信息顯示 */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 rounded bg-purple-100 p-3 text-xs text-purple-600">
                    <strong>調試信息:</strong>
                    <br />
                    子內容數量: {block.children?.length || 0}
                    <br />
                    Toggle子內容數量: {block.toggle?.children?.length || 0}
                    <br />
                    內容長度: {toggleContent.length}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              🤝 合作指南
            </span>
            <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700">💡 工作偏好</span>
          </div>
        </div>
      );

    case 'core_values':
      return (
        <div className="my-8 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 transition-all duration-300 hover:shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-blue-100 p-3">
                <span className="text-3xl">⭐</span>
              </div>
              <div>
                <h3 className="mb-1 text-2xl font-bold text-blue-900">核心價值</h3>
                <p className="text-blue-600">我所堅持的原則與信念</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
            >
              <span>{isExpanded ? '收起' : '展開'}</span>
              <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
          </div>

          {isExpanded && (
            <div className="animate-fadeIn rounded-lg bg-white/80 p-6">
              <div className="leading-relaxed whitespace-pre-line text-blue-800">{toggleContent}</div>
            </div>
          )}
        </div>
      );

    case 'work_style':
      return (
        <div className="my-8 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 transition-all duration-300 hover:shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-green-100 p-3">
                <span className="text-3xl">⚡</span>
              </div>
              <div>
                <h3 className="mb-1 text-2xl font-bold text-green-900">工作風格</h3>
                <p className="text-green-600">我的工作方式與習慣</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 rounded-lg bg-green-100 px-4 py-2 text-green-700 transition-colors hover:bg-green-200"
            >
              <span>{isExpanded ? '收起' : '展開'}</span>
              <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
          </div>

          {isExpanded && (
            <div className="animate-fadeIn mb-4 rounded-lg bg-white/80 p-6">
              <div className="leading-relaxed whitespace-pre-line text-green-800">{toggleContent}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="hover:bg-green-150 rounded-lg bg-green-100 p-3 text-center transition-colors">
              <span className="mb-1 block text-2xl">🎯</span>
              <span className="text-xs text-green-700">目標導向</span>
            </div>
            <div className="hover:bg-green-150 rounded-lg bg-green-100 p-3 text-center transition-colors">
              <span className="mb-1 block text-2xl">🤝</span>
              <span className="text-xs text-green-700">團隊合作</span>
            </div>
            <div className="hover:bg-green-150 rounded-lg bg-green-100 p-3 text-center transition-colors">
              <span className="mb-1 block text-2xl">📈</span>
              <span className="text-xs text-green-700">持續改進</span>
            </div>
            <div className="hover:bg-green-150 rounded-lg bg-green-100 p-3 text-center transition-colors">
              <span className="mb-1 block text-2xl">💡</span>
              <span className="text-xs text-green-700">創新思維</span>
            </div>
          </div>
        </div>
      );

    case 'communication':
      return (
        <div className="my-8 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-8 transition-all duration-300 hover:shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-orange-100 p-3">
                <span className="text-3xl">💬</span>
              </div>
              <div>
                <h3 className="mb-1 text-2xl font-bold text-orange-900">溝通偏好</h3>
                <p className="text-orange-600">最有效的溝通方式</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 rounded-lg bg-orange-100 px-4 py-2 text-orange-700 transition-colors hover:bg-orange-200"
            >
              <span>{isExpanded ? '收起' : '展開'}</span>
              <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
          </div>

          {isExpanded && (
            <div className="animate-fadeIn mb-6 rounded-lg bg-white/80 p-6">
              <div className="leading-relaxed whitespace-pre-line text-orange-800">{toggleContent}</div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <div className="hover:bg-orange-150 flex items-center rounded-lg bg-orange-100 px-4 py-2 transition-colors">
              <span className="mr-2 text-lg">📧</span>
              <span className="text-sm text-orange-700">Email 詳細討論</span>
            </div>
            <div className="hover:bg-orange-150 flex items-center rounded-lg bg-orange-100 px-4 py-2 transition-colors">
              <span className="mr-2 text-lg">💬</span>
              <span className="text-sm text-orange-700">即時訊息快速確認</span>
            </div>
            <div className="hover:bg-orange-150 flex items-center rounded-lg bg-orange-100 px-4 py-2 transition-colors">
              <span className="mr-2 text-lg">🎥</span>
              <span className="text-sm text-orange-700">會議深度交流</span>
            </div>
          </div>
        </div>
      );

    case 'achievements':
      return (
        <div className="relative my-8 overflow-hidden rounded-xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-yellow-200 opacity-20"></div>
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-orange-200 opacity-20"></div>

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-yellow-100 p-3">
                  <span className="text-3xl">🏆</span>
                </div>
                <div>
                  <h3 className="mb-1 text-2xl font-bold text-yellow-900">成就解鎖</h3>
                  <p className="text-yellow-600">重要里程碑與成就</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 rounded-lg bg-yellow-100 px-4 py-2 text-yellow-700 transition-colors hover:bg-yellow-200"
              >
                <span>{isExpanded ? '收起' : '展開'}</span>
                <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
            </div>

            {isExpanded && (
              <div className="animate-fadeIn mb-6 rounded-lg bg-white/90 p-6 backdrop-blur-sm">
                <div className="leading-relaxed whitespace-pre-line text-yellow-800">{toggleContent}</div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="hover:bg-yellow-250 rounded-full bg-yellow-200 px-3 py-1 text-sm font-medium text-yellow-800 transition-colors">
                🥇 專業認證
              </span>
              <span className="hover:bg-orange-250 rounded-full bg-orange-200 px-3 py-1 text-sm font-medium text-orange-800 transition-colors">
                🎯 專案成果
              </span>
              <span className="hover:bg-yellow-250 rounded-full bg-yellow-200 px-3 py-1 text-sm font-medium text-yellow-800 transition-colors">
                📚 學習里程碑
              </span>
            </div>
          </div>
        </div>
      );

    // 其他特殊類型保持不變...
    default:
      return null;
  }
};

// 🔧 BlockRenderer 組件
const BlockRenderer = ({ block }: { block: NotionBlock }) => {
  // 🎯 檢查是否為特殊 Toggle
  if (block.type === 'toggle') {
    const specialType = getSpecialToggleType(block.content);

    // 🐛 Toggle 專門調試
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('🔍 Toggle 詳細資訊:', {
    //     title: block.content,
    //     specialType: specialType,
    //     isSpecial: !!specialType,
    //     hasToggleChildren: !!(block.toggle?.children?.length),
    //     hasDirectChildren: !!(block.children?.length),
    //     toggleChildrenCount: block.toggle?.children?.length || 0,
    //     directChildrenCount: block.children?.length || 0
    //   });
    // }

    if (specialType) {
      return <SpecialToggleBlock block={block} specialType={specialType} />;
    }

    // 一般 Toggle 處理
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleContent = getToggleContent(block);

    return (
      <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="font-medium">{block.content}</span>
          <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="animate-fadeIn mt-4 border-l-2 border-gray-300 pl-4">
            <div className="whitespace-pre-line">{toggleContent}</div>

            {/* 🐛 一般 Toggle 調試信息 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 rounded bg-gray-100 p-2 text-xs">
                <strong>一般 Toggle 調試:</strong>
                <br />
                標題: {block.content}
                <br />
                內容長度: {toggleContent.length}
                <br />
                子元素數量: {block.children?.length || 0}
              </div>
            )}

            {/* 如果有複雜的子結構，渲染子 blocks */}
            {block.children && block.children.map((child) => <BlockRenderer key={child.id} block={child} />)}
          </div>
        )}
      </div>
    );
  }

  // 原有的其他 block 類型處理...
  switch (block.type) {
    case 'paragraph':
      if (!block.content.trim()) return <div className="h-4" />;
      return <p className="mb-4 leading-relaxed">{block.content}</p>;

    case 'heading_1':
      return <h1 className="mt-8 mb-6 text-3xl font-bold">{block.content}</h1>;

    case 'heading_2':
      return <h2 className="mt-6 mb-4 text-2xl font-bold">{block.content}</h2>;

    case 'heading_3':
      return <h3 className="mt-4 mb-3 text-xl font-semibold">{block.content}</h3>;

    case 'image':
      return (
        <div className="my-6">
          <img
            src={block.image?.url}
            alt={block.image?.caption || ''}
            className="h-auto max-w-full rounded-lg shadow-md transition-shadow hover:shadow-lg"
          />
          {block.image?.caption && <p className="mt-2 text-center text-sm">{block.image.caption}</p>}
        </div>
      );

    case 'quote':
      return (
        <blockquote className="my-6 border-l-4 border-blue-500 bg-blue-50 py-2 pl-6 italic transition-colors hover:bg-blue-100">
          {block.content}
        </blockquote>
      );

    case 'callout':
      return (
        <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
          <div className="flex items-start space-x-3">
            {block.callout?.icon && <span className="text-2xl">{block.callout.icon}</span>}
            <p className="flex-1">{block.content}</p>
          </div>
        </div>
      );

    case 'bulleted_list_item':
      return (
        <li className="mb-2 ml-6 list-disc">
          {block.content}
          {block.children && (
            <ul className="mt-2">
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </ul>
          )}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="mb-2 ml-6 list-decimal">
          {block.content}
          {block.children && (
            <ol className="mt-2">
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </ol>
          )}
        </li>
      );

    case 'divider':
      return <hr className="my-8 border-gray-300" />;

    default:
      return '';
  }
};

export default function PageContentSection({ pageContent }: PageContentSectionProps) {
  if (!pageContent || pageContent.blocks.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="max-w-none">
          {pageContent.blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
        <div className="rounded px-2 py-1 font-mono">npm install next 測試</div>
        <code className="font-fira">const result;</code>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs">頁面最後編輯: {new Date(pageContent.last_edited_time).toLocaleString('zh-TW')}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
