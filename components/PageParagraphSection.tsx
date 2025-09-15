'use client';

import { useState } from 'react';
import { PageContent, NotionBlock } from '../types/notion';
import H2Title from './H2Title';

interface PageParagraphSectionProps {
  pageContent: any;
}

export default function PageParagraphSection({ pageContent }: PageParagraphSectionProps) {
  if (!pageContent) {
    return null;
  }

  return (
    <section className="section-container mb-20">
      <div>
        <div>
          <H2Title title={pageContent.title} />
          {/* <h1 className="mb-6 text-3xl">{pageContent.title}</h1> */}
          {pageContent.content.map((item: string, index: number) => (
            <p key={index} className="mb-4">
              {item}
            </p>
          ))}
          {pageContent.items.map((item: any, index: number) => (
            <div key={index} className="mb-5">
              <h2>{item.subtitle}</h2>
              {item.content.map((subItem: string, subIndex: number) => (
                <p key={subIndex} className="mb-1">
                  {subItem}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
