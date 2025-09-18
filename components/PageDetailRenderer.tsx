import { NotionBlock } from '../types/notion';
// import getPageContent from '../lib/notionPortfolio';

// import { getTableContent } from '../hooks/getTableContent';

const PageDetailRenderer = ({ blocks }: { blocks: any }) => {
  console.log('🚀 ~ PageDetailRenderer ~ blocks:', blocks);
  const blocksDetails = blocks?.[0];
  const blocksLink = blocks?.[1];

  const BlockRenderer = ({ block }: { block: NotionBlock }) => {
    switch (block.type) {
      case 'paragraph':
        const isLink = block?.paragraph?.rich_text?.[0]?.href;
        if (isLink) {
          return (
            <a
              href={block?.paragraph?.rich_text[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              🔗 {block?.paragraph?.rich_text[0].plain_text}
            </a>
          );
        } else {
          if (!block.content.trim()) return <div className="h-2" />;
          return <p className="mb-3 leading-relaxed">{block.content}</p>;
        }

      case 'heading_1':
        return <h3 className="text-[20px]">{block.content}</h3>;

      case 'heading_2':
        return <h5 className="mt-3 mb-2 text-xl font-semibold">{block.content}</h5>;

      case 'heading_3':
        return <h6 className="mt-2 mb-3 text-lg font-medium">{block.content}</h6>;

      case 'bulleted_list_item':
        return (
          <li className="mb-3 ml-4 list-none">
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
          <li className="mb-1 ml-4 list-decimal">
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
          <blockquote className="my-3 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 italic">
            {block.content}
          </blockquote>
        );

      case 'callout':
        return (
          <div className="my-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex items-start space-x-2">
              {block.callout?.icon && <span className="text-lg">{block.callout.icon}</span>}
              <p className="flex-1 text-yellow-800">{block.content}</p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="my-4">
            <img
              src={block.image?.url}
              alt={block.image?.caption || ''}
              className="h-auto max-w-full rounded-lg shadow-sm"
            />
            {block.image?.caption && <p className="mt-1 text-center text-xs">{block.image.caption}</p>}
          </div>
        );

      case 'divider':
        return <hr className="my-4 border-gray-300" />;

      default:
        return (
          <div className="my-2 rounded p-2">
            <p className="text-xs">
              [{block.type}] {block.content}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex gap-x-[74px]">
      {/* 第一個 h1 toggle */}
      <div className="flex-1">
        {blocksLink?.children?.map((block: any) => {
          return <BlockRenderer key={block.id} block={block} />;
        })}
      </div>
      {/* 第二個 h1 toggle */}
      <div className="w-full max-w-[413px]">
        {blocksDetails?.children?.map((block: any) => {
          return <BlockRenderer key={block.id} block={block} />;
        })}
      </div>
    </div>
  );
};

export default PageDetailRenderer;
