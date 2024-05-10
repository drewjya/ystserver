export class VDate {
  public static now() {
    const date = new Date();
    date.setHours(date.getHours() + 7);

    return date;
  }
}
