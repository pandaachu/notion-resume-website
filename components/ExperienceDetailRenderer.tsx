import { Experience } from '../types/notion';
import { NotionBlock, Heading1Block } from '../types/notion';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceDetailH1 = ({ block }: any) => {
  return (
    <>
      <h4 className="mt-10 mb-3 text-2xl font-bold tracking-wide text-[#D9D9D9]">{block.content}</h4>
      <hr className="mb-4 w-[200px] border-[#D9D9D9]" />
    </>
  );
};

// 🎨 Experience 詳細內容渲染器
const ExperienceDetailRenderer = ({ blocks }: { blocks: NotionBlock[] }) => {
  const BlockRenderer = ({ block }: { block: NotionBlock }) => {
    switch (block.type) {
      case 'paragraph':
        if (!block.content.trim()) return <div className="h-2" />;
        return <p className="mb-3 leading-relaxed text-[#D9D9D9]">{block.content}</p>;

      case 'heading_1':
        return <ExperienceDetailH1 block={block}></ExperienceDetailH1>;

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

export default ExperienceDetailRenderer;
