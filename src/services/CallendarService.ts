export const getYear = (year: number) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const today = new Date();
  const yearData = [];

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
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
      const dateString = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format
      const isCurrentMonth = date.getMonth() === monthIndex;
      const isToday = date.toDateString() === today.toDateString();

      const dayObject: any = { date: dateString };
      if (isCurrentMonth) {
        dayObject.isCurrentMonth = true;
      }
      if (isToday) {
        dayObject.isToday = true;
      }

      days.push(dayObject);
      date.setDate(date.getDate() + 1);
    }

    const monthData = {
      name: monthName,
      days: days,
    };
    yearData.push(monthData);
  }

  return yearData;
};