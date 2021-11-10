import { IUserAbsenceWithWorkingDays } from "common/interfaces";

export class DateUtil {
  static dateSorting(a: IUserAbsenceWithWorkingDays, b: IUserAbsenceWithWorkingDays): number {
    const aa = a.startingDate.split("-").join();
    const bb = b.startingDate.split("-").join();
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  }

  static roundDate = (date: Date): Date => {
    if (date.getUTCHours() < 12) {
      date.setUTCHours(0, 0, 0, 0);
    } else {
      date.setUTCHours(24, 0, 0, 0);
    }
    return date;
  };

  static todayStringified(): string {
    return new Date().toISOString().slice(0, 10);
  }

  static dateToString = (date: Date): string => {
    return date.toISOString().slice(0, 10);
  };

  static formatDateDDMMYYYY = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
}
