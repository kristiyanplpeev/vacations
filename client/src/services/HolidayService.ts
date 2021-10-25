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
    return await this.restClient.get(`holidays/${startingDate}/${endingDate}/dates`);
  };
}

export default HolidayService;
