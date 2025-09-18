import { NextResponse } from 'next/server';
import * as notionService from '@/lib/notion/service';

/**
 * 主要 API 路由 - 獲取所有履歷資料
 */
export async function GET(request: Request) {
  try {
    // 檢查是否要強制刷新快取
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';

    if (refresh) {
      notionService.clearCache();
    }

    // 獲取資料
    const resumeData = await notionService.getResumeData();

    // 設定快取標頭
    const headers = {
      'Cache-Control':
        process.env.NODE_ENV === 'development'
          ? 'no-cache' // 開發環境不快取
          : 's-maxage=3600, stale-while-revalidate=86400', // 生產環境快取 1 小時
      'X-Data-Source': refresh ? 'fresh' : 'cached',
    };

    return NextResponse.json(resumeData, { headers });
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch resume data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    );
  }
}

/**
 * POST 請求 - 清除快取
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'clear-cache') {
      notionService.clearCache();
      return NextResponse.json({ success: true, message: 'Cache cleared' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
