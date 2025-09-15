'use client';

import { PageContent } from '@/types/notion';
import { usePageContent } from '@/hooks';
import BlockRenderer from './BlockRenderer';

interface PageContentSectionProps {
  pageContent: PageContent;
}

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

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-400">
              頁面最後編輯: {new Date(pageContent.last_edited_time).toLocaleString('zh-TW')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
