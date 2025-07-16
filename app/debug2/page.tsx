import { testAllDatabaseConnections } from '../../lib/notionPortfolio'

export default async function DebugPage() {
  // 環境變數檢查
  const envVars = {
    'NOTION_TOKEN': !!process.env.NOTION_TOKEN,
    'NOTION_PERSONAL_INFO_DB': !!process.env.NOTION_PERSONAL_INFO_DB,
    'NOTION_EXPERIENCE_DB': !!process.env.NOTION_EXPERIENCE_DB,
    'NOTION_EDUCATION_DB': !!process.env.NOTION_EDUCATION_DB,
    'NOTION_PROJECTS_DB': !!process.env.NOTION_PROJECTS_DB,
    'NOTION_SKILLS_DB': !!process.env.NOTION_SKILLS_DB,
  };

  // 測試所有資料庫連接
  let connectionResults: string[] = [];
  
  try {
    await testAllDatabaseConnections();
  } catch (error) {
    console.error('Connection test failed:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">多 Table 架構調試</h1>
        
        <div className="space-y-6">
          {/* 環境變數檢查 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">環境變數檢查</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className={`flex items-center space-x-2 ${value ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{value ? '✅' : '❌'}</span>
                  <span className="font-mono text-sm">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 使用說明 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">多 Table 架構說明</h2>
            <div className="text-blue-800 space-y-2">
              <p>✅ 每個資料類型使用獨立的 Notion Table</p>
              <p>✅ 不需要 Type 欄位區分資料類型</p>
              <p>✅ 更清晰的資料組織結構</p>
              <p>✅ 更容易維護和擴展</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}