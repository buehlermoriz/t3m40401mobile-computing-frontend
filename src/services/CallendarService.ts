// CallendarService.js

interface dayObject {
  date: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  hasEvent?: boolean;
}

export const getMonth = (year: number, monthIndex: number, eventDatesSet: any) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const today = new Date();
  const monthName = monthNames[monthIndex];
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Adjust startDate to the previous Sunday
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Adjust endDate to the next Saturday
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  const date = new Date(startDate);

  while (date <= endDate) {
    const dateString = date.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    const isCurrentMonth = date.getMonth() === monthIndex;
    const isToday = date.toDateString() === today.toDateString();
    const hasEvent = eventDatesSet.has(dateString);

    const dayObject: dayObject = { date: dateString };
    if (isCurrentMonth) {
      dayObject.isCurrentMonth = true;
    }
    if (isToday) {
      dayObject.isToday = true;
    }
    if (hasEvent) {
      dayObject.hasEvent = true;
    }

    days.push(dayObject);
    date.setDate(date.getDate() + 1);
  }

  return {
    name: monthName,
    days: days,
  };
};
// CallendarService.js
export const getYear = (year: number, eventDatesSet: any) => {
  const yearData = [];

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const monthData = getMonth(year, monthIndex, eventDatesSet);
    yearData.push(monthData);
  }

  return yearData;
};