import { injectable } from "inversify";

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
  //   getSprintPeriod(sprintIndex: number): SprintPeriod {}

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
