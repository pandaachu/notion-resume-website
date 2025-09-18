import { NextResponse } from 'next/server';
import * as notionService from '@/lib/notion/service';

export async function GET() {
  try {
    const skills = await notionService.getSkills();

    return NextResponse.json(skills, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
