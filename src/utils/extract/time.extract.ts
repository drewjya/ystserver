export function extractTime(time: string) {
  const [hour, minute, second] = time.split(':');
  return { hour: +hour, minute: +minute, second: +second };
}

export function timeToString(value: number) {
  return value < 10 ? `0${value}` : value.toString();
}
