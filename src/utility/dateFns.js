import {
  startOfHour,
  endOfHour,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachHourOfInterval,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isWithinInterval,
  parseISO,
  subMonths,
} from "date-fns";

export function getWeeksInLastFourMonths(date) {
  const start = startOfMonth(subMonths(date, 4));
  const end = endOfMonth(date);
  return eachWeekOfInterval({ start, end });
}

export const dateFns = {
  startOfHour,
  endOfHour,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachHourOfInterval,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isWithinInterval,
  parseISO,
};
