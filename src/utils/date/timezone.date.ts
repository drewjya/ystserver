export class VDate {
  public static now() {
    const date = new Date();
    return date;
  }

  public static getUtcDateForTimeSlot(date: string | Date) {
    const localDate = new Date(date);
    const formattedDate = localDate
      .toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/');

    const jakartaStartDate = new Date(
      `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`,
    );
    const jakartaEndDate = new Date(jakartaStartDate);
    jakartaEndDate.setDate(jakartaEndDate.getDate() + 1);
    jakartaEndDate.setMilliseconds(jakartaEndDate.getMilliseconds() - 1);

    const utcStart = jakartaStartDate.toISOString();
    const utcEnd = jakartaEndDate.toISOString();

    return {
      start: utcStart,
      end: utcEnd,
    };
  }

  public static getUtcDateToday() {
    const localDate = new Date();

    const formattedDate = localDate
      .toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/');

    const jakartaStartDate = new Date(
      `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`,
    );

    const jakartaEndDate = new Date(jakartaStartDate);
    jakartaEndDate.setDate(jakartaEndDate.getDate() + 1);
    jakartaEndDate.setMilliseconds(jakartaEndDate.getMilliseconds() - 1);

    const utcStart = jakartaStartDate.toISOString();
    const utcEnd = jakartaEndDate.toISOString();
    console.log(this.getUtcDateForTimeSlot('2024-05-13'));

    return {
      start: utcStart,
      end: utcEnd,
    };
  }
}
