// components/DevUpdateButton.tsx
'use client';

import { useState } from 'react';

export default function DevUpdateButton() {
  const [isUpdating, setIsUpdating] = useState(false);

  // 只在開發環境顯示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: 'my-secret-token', // 直接用預設值
        }),
      });

      const data = await res.json();

      if (data.revalidated) {
        alert('✅ 更新成功！重新整理看結果');
        // 自動重新整理
        setTimeout(() => location.reload(), 1000);
      } else {
        alert('❌ 更新失敗');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ 錯誤');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={isUpdating}
      className={`fixed right-4 bottom-4 z-50 rounded-full p-4 text-white shadow-lg ${
        isUpdating ? 'cursor-wait bg-gray-500' : 'bg-green-600 hover:bg-green-700'
      } `}
      title="更新 Notion 資料"
    >
      {isUpdating ? (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
    </button>
  );
}
