import { testNotionConnection, debugDatabase } from '../../lib/notion';

export default async function DebugPage() {
  let connectionTest = false;
  let debugInfo = '';

  try {
    connectionTest = await testNotionConnection();

    if (connectionTest) {
      await debugDatabase();
    }
  } catch (error) {
    console.error('Debug error:', error);
    debugInfo = `錯誤: ${error}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold">Notion 連接調試</h1>

        <div className="space-y-6">
          {/* 連接狀態 */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">連接狀態</h2>
            <div
              className={`rounded px-4 py-2 ${connectionTest ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {connectionTest ? '✅ Notion 連接成功' : '❌ Notion 連接失敗'}
            </div>
          </div>

          {/* 環境變數檢查 */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">環境變數檢查</h2>
            <div className="space-y-2">
              <div
                className={`flex items-center space-x-2 ${process.env.NOTION_TOKEN ? 'text-green-600' : 'text-red-600'}`}
              >
                <span>{process.env.NOTION_TOKEN ? '✅' : '❌'}</span>
                <span>NOTION_TOKEN: {process.env.NOTION_TOKEN ? '已設定' : '未設定'}</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${process.env.NOTION_DATABASE_ID ? 'text-green-600' : 'text-red-600'}`}
              >
                <span>{process.env.NOTION_DATABASE_ID ? '✅' : '❌'}</span>
                <span>NOTION_DATABASE_ID: {process.env.NOTION_DATABASE_ID ? '已設定' : '未設定'}</span>
              </div>
            </div>
          </div>

          {/* 說明 */}
          <div className="rounded-lg bg-blue-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-blue-900">除錯資訊</h2>
            <p className="mb-4 text-blue-800">請檢查瀏覽器的開發者工具 Console 以查看詳細的調試訊息。</p>
            <p className="text-sm text-blue-700">在終端機中執行 npm run dev 時也會看到調試訊息。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
