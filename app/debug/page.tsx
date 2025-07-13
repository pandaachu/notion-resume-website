import { testNotionConnection, debugDatabase } from '../../lib/notion'

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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Notion 連接調試</h1>
        
        <div className="space-y-6">
          {/* 連接狀態 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">連接狀態</h2>
            <div className={`px-4 py-2 rounded ${connectionTest ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {connectionTest ? '✅ Notion 連接成功' : '❌ Notion 連接失敗'}
            </div>
          </div>

          {/* 環境變數檢查 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">環境變數檢查</h2>
            <div className="space-y-2">
              <div className={`flex items-center space-x-2 ${process.env.NOTION_TOKEN ? 'text-green-600' : 'text-red-600'}`}>
                <span>{process.env.NOTION_TOKEN ? '✅' : '❌'}</span>
                <span>NOTION_TOKEN: {process.env.NOTION_TOKEN ? '已設定' : '未設定'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${process.env.NOTION_DATABASE_ID ? 'text-green-600' : 'text-red-600'}`}>
                <span>{process.env.NOTION_DATABASE_ID ? '✅' : '❌'}</span>
                <span>NOTION_DATABASE_ID: {process.env.NOTION_DATABASE_ID ? '已設定' : '未設定'}</span>
              </div>
            </div>
          </div>

          {/* 說明 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">除錯資訊</h2>
            <p className="text-blue-800 mb-4">
              請檢查瀏覽器的開發者工具 Console 以查看詳細的調試訊息。
            </p>
            <p className="text-sm text-blue-700">
              在終端機中執行 npm run dev 時也會看到調試訊息。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}