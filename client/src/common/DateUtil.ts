import { IUserAbsenceWithWorkingDays } from "common/interfaces";

export class DateUtil {
  static dateSorting(a: IUserAbsenceWithWorkingDays, b: IUserAbsenceWithWorkingDays): number {
    const aa = a.from_date.split("-").join();
    const bb = b.from_date.split("-").join();
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  }

  static todayStringified(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
