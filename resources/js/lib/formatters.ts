export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

export const formatShortDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
};

export const formatPeriod = (period: string): string => {
  const [year, month] = period.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getCurrentPeriod = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getDateRangeForPeriod = (periodType: 'daily' | 'monthly' | 'yearly', date: Date = new Date()): { start: string; end: string } => {
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  
  switch (periodType) {
    case 'daily':
      return { start: formatDate(date), end: formatDate(date) };
    case 'monthly':
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return { start: formatDate(monthStart), end: formatDate(monthEnd) };
    case 'yearly':
      const yearStart = new Date(date.getFullYear(), 0, 1);
      const yearEnd = new Date(date.getFullYear(), 11, 31);
      return { start: formatDate(yearStart), end: formatDate(yearEnd) };
    default:
      return { start: formatDate(date), end: formatDate(date) };
  }
};
