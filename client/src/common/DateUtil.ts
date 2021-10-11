import { IUserAbsenceWithWorkingDays } from "common/interfaces";

export class DateUtil {
  static dateSorting(a: IUserAbsenceWithWorkingDays, b: IUserAbsenceWithWorkingDays): number {
    const aa = a.startingDate.split("-").join();
    const bb = b.startingDate.split("-").join();
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  }

  static todayStringified(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
