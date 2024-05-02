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
