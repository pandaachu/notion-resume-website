interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="mb-4 text-red-600">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-red-900">載入失敗</h1>
          <p className="mb-6 text-red-700">{error}</p>

          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                🔄 重試
              </button>
            )}
            <div className="space-y-1 text-sm text-red-600">
              <p>請檢查：</p>
              <ul className="list-inside list-disc space-y-1 text-left">
                <li>Notion 資料庫是否正確設定</li>
                <li>環境變數是否配置完整</li>
                <li>Integration 權限是否設定正確</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
