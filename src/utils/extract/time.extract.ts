export function extractTime(time: string) {
  const [hour, minute, second] = time.split(':');
  return { hour: +hour, minute: +minute, second: +second };
}

export type Time = {
  hour: number;
  minute: number;
  second: number;

}

export function timeToString(value: number) {
  return value < 10 ? `0${value}` : value.toString();
}

export function countDuration(time: {
  hour: number;
  minute: number;
  second: number;
}) {
  const minutes = time.hour * 60 + time.minute;
  return minutes;
}
