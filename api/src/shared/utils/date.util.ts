export const addDaysInDate = (date: Date, days: number): void => {
  date.setDate(date.getDate() + days)
}

export const subtractDaysInDate = (date: Date, days: number): void => {
  date.setDate(date.getDate() - days)
}
