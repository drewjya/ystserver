export class VDate {
  public static now() {
    const date = new Date();
    return date;
  }

  public static getUtcDateForTimeSlot(date: string | Date) {
    const localDate = new Date(date);

    const jakartaStartDate = new Date(localDate.toLocaleDateString('id-ID'));
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

    const jakartaStartDate = new Date(localDate.toLocaleDateString('id-ID'));
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
}
