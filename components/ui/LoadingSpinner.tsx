export function LoadingSpinner() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">載入中...</h2>
        <p className="text-gray-600">正在從 Notion 獲取履歷資料</p>
      </div>
    </main>
  );
}
