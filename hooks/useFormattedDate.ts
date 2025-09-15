export function useFormattedDate() {
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatDateRange = (startDate: string, endDate?: string, isCurrent?: boolean): string => {
    const start = formatDate(startDate);
    const end = isCurrent ? '現在' : formatDate(endDate || '');
    return `${start} - ${end}`;
  };

  return {
    formatDate,
    formatDateRange,
  };
}
