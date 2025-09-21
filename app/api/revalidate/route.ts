// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 解析請求
    const body = await request.json();

    // 檢查密碼（使用預設值 my-secret-token）
    if (body.secret !== 'my-secret-token') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    console.log('🔄 Revalidating /portfolio...');

    // 觸發頁面重新生成
    revalidatePath('/portfolio');
    revalidatePath('/project');

    // 如果你的頁面路徑不同，改這裡
    // revalidatePath('/');  // 如果是首頁

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: 'Page will be updated on next visit',
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        error: 'Error revalidating',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
