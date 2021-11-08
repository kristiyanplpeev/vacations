import { differenceInCalendarDays, addDays } from "date-fns";
import { injectable } from "inversify";

import { firstSprintBeginning, sprintLengthDays, noDataError } from "common/constants";
import { DateUtil } from "common/DateUtil";
import {
  HolidayDays,
  IAbsencePeriod,
  IUserAbsenceWithWorkingDaysAndEmployee,
  IUserWithTeamAndPosition,
  SprintPeriod,
} from "common/interfaces";
import { ISprintPlanningService } from "inversify/interfaces";
import "reflect-metadata";

@injectable()
class SprintPlanningService implements ISprintPlanningService {
  // sprint index 0 means current sprint, 1 means next sprint and -1 means last sprint
  //we shall move this from here
  getSprintPeriod(sprintIndex: number): SprintPeriod {
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
      throw new Error(noDataError);
    }

    return requestedSprintPeriod;
  }

  getUsersAbsenceDaysCount(
    users: Array<IUserWithTeamAndPosition>,
    absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>,
  ): Map<string, number> {
    const map: Map<string, number> = new Map();

    const countDays = (absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>): number => {
      return absences.reduce((count, absence) => {
        count += absence.workingDays;

        return count;
      }, 0);
    };

    for (const user of users) {
      const absencesForUser = absences.filter((absence) => absence.employee.id === user.id);
      const absenceDays = countDays(absencesForUser);

      map.set(user.id, absenceDays);
    }

    return map;
  }

  convertSprintPeriodDatesToStrings(sprintPeriod: SprintPeriod): IAbsencePeriod {
    const startingDate = DateUtil.dateToString(sprintPeriod.startingDate);
    const endingDate = DateUtil.dateToString(sprintPeriod.endingDate);

    return {
      startingDate,
      endingDate,
    };
  }

  calculateTotalWorkdays(totalSprintDaysWithStatus: HolidayDays): number {
    const workdays = totalSprintDaysWithStatus.filter((day) => day.status === "workday");

    return workdays.length;
  }
}

export default SprintPlanningService;
