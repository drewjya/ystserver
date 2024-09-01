import * as dayjs from 'dayjs';
import weekOfYear from "dayjs/plugin/weekOfYear.js";

export function dateFormat(date: Date, format: string) {
  return dayjs(date).format(format);
}

export function formatStringDate(value: string) {
  const val = dayjs(value);
  return {
    start: val.startOf("month").toDate(),
    end: val.endOf("month").toDate(),
  };
}

export function getWeek(val: string) {
  dayjs.extend(weekOfYear);
  return dayjs(val).week();
}

export function stringDateThisAndNExt(value: string) {
  const val = dayjs(value);
  return {
    start: val.subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    end: val.endOf("month").format("YYYY-MM-DD"),
  };
}

export function getWeekDates(val: string) {
  const now = dayjs(val);

  const endWeek = now.endOf("week").format("YYYY-MM-DD");
  const startPrev = now
    .subtract(1, "week")
    .startOf("week")
    .format("YYYY-MM-DD");
  return {
    startPrev,
    endWeek,
  };
}


export function convertDate(date: Date) {
  const day: string = date.getDate().toString().padStart(2, '0');
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: string = date.getMinutes().toString().padStart(2, '0');
  const seconds: string = date.getSeconds().toString().padStart(2, '0');

  // Define the month names in Indonesian
  const months: string[] = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const monthName: string = months[date.getMonth()];

  // Format the date string
  return `${day} ${monthName} ${date.getFullYear()}, ${hours}:${minutes}:${seconds}`;
}

export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Optional: adjust number of decimal places
  });

  return formatter.format(value);
}
