import { NextResponse } from 'next/server';
import * as notionService from '@/lib/notion/service';

export async function GET() {
  try {
    const experiences = await notionService.getExperiences();

    return NextResponse.json(experiences, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}
