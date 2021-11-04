import { addDays, differenceInCalendarDays } from "date-fns";

import { firstSprintBeginning, sprintLengthDays } from "common/constants";
import { IUserAbsenceWithWorkingDays, SprintPeriod } from "common/interfaces";

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

  // sprint index 0 means current sprint, 1 means next sprint and -1 means last sprint
  //we shall move this from here
  static getSprintPeriod(sprintIndex: number): SprintPeriod {
    const today = new Date();
    const daysSinceFirstSprint = differenceInCalendarDays(today, firstSprintBeginning);

    const defaultSprint = Math.ceil((daysSinceFirstSprint + 1) / sprintLengthDays);
    const defaultSprintEndingDate = addDays(firstSprintBeginning, defaultSprint * sprintLengthDays - 1);

    const requestedSprint = defaultSprint + sprintIndex;

    const startingDate = addDays(firstSprintBeginning, (requestedSprint - 1) * sprintLengthDays);
    const endingDate = addDays(firstSprintBeginning, requestedSprint * sprintLengthDays - 1);
    const requestedSprintPeriod = {
      startingDate: DateUtil.roundDate(startingDate),
      endingDate: DateUtil.roundDate(endingDate),
    };

    if (differenceInCalendarDays(defaultSprintEndingDate, today) < 2) {
      requestedSprintPeriod.startingDate = addDays(requestedSprintPeriod.startingDate, sprintLengthDays);
      requestedSprintPeriod.endingDate = addDays(requestedSprintPeriod.endingDate, sprintLengthDays);
    }

    if (requestedSprintPeriod.startingDate < firstSprintBeginning) {
      throw new Error("We do not have data before that period");
    }

    return requestedSprintPeriod;
  }
}
