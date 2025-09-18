import { NextResponse } from 'next/server';
import * as notionService from '@/lib/notion/service';

export async function GET() {
  try {
    const education = await notionService.getEducation();

    return NextResponse.json(education, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}
