import { useState, useEffect } from 'react';
import { ResumeData } from '@/types/notion';
import { getResumeData } from '@/lib/notionPortfolio';

interface UseResumeDataReturn {
  data: ResumeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useResumeData(): UseResumeDataReturn {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resumeData = await getResumeData();
      setData(resumeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取資料失敗');
      console.error('獲取履歷資料錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
