import { injectable } from "inversify";

import { DateUtil } from "common/DateUtil";
import { HolidayDays, IAbsencePeriod, SprintPeriod } from "common/interfaces";
import { ISprintPlanningService } from "inversify/interfaces";

@injectable()
class SprintPlanningService implements ISprintPlanningService {
  //   getSprintPeriod(sprintIndex: number): SprintPeriod {}

  calculateTotalCapacity() {}

  calculateSingleUserCapacity() {}

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
