export function getStartOfWeek(date: Date): Date {
  const clonedDate = new Date(date);

  const day = clonedDate.getDay();

  // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
  const diff = clonedDate.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(clonedDate.setDate(diff));
}

export function addWeeksToDate(date: Date, numberOfWeeks: number): Date {
  return addDaysToDate(date, (numberOfWeeks * 7))
}

export function addDaysToDate(date: Date, numberOfDays: number): Date {
  const clonedDate: Date = new Date(date)
  clonedDate.setDate(clonedDate.getDate() + numberOfDays);
  return clonedDate
}

export function startOfDay(date: Date): Date {
  const clonedDate: Date = new Date(date)
  clonedDate.setUTCHours(0,0,0,0);
  return clonedDate
}

export function endOfDay(date: Date): Date {
  const clonedDate: Date = new Date(date)
  clonedDate.setUTCHours(23,59,59,999);
  return clonedDate
}
