import { NextResponse } from 'next/server';
import { notionService } from '@/lib/notion/service';

export async function GET() {
  try {
    const projects = await notionService.getProjects();

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
