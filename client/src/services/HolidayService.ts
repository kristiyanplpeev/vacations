import { injectable } from "inversify";

import { IAbsencePeriod, HolidayDays } from "common/interfaces";
import { IHolidayService, IRestClient } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class HolidayService implements IHolidayService {
  private restClient = myContainer.get<IRestClient>(TYPES.Rest);

  getDatesStatus = async ({ startingDate, endingDate }: IAbsencePeriod): Promise<HolidayDays> => {
    return await this.restClient.get(`absences/dates?from=${startingDate}&to=${endingDate}`);
  };

  checkIfDayIsHoliday(date: Date, daysInterval: HolidayDays): boolean {
    const holiday = daysInterval.find((day) => day.date === date.toLocaleDateString("en-CA"));
    if (holiday) {
      return holiday.status !== "workday";
    }

    return false;
  }
}

export default HolidayService;
