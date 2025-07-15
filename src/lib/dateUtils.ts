// Date utility functions to handle local dates without timezone issues

export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayString = (): string => {
  return formatLocalDate(new Date());
};

export const getTomorrowString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatLocalDate(tomorrow);
};

export const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatLocalDate(yesterday);
};

export const parseLocalDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const isDateToday = (dateString: string): boolean => {
  return dateString === getTodayString();
};

export const isDateTomorrow = (dateString: string): boolean => {
  return dateString === getTomorrowString();
};

export const compareDates = (dateString1: string, dateString2: string): number => {
  return dateString1.localeCompare(dateString2);
};
