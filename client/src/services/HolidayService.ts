import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { IPTOPeriod, HolidayDays } from "common/types";
import { IHolidayService, IAuthService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class HolidayService implements IHolidayService {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  getDatesStatus = async ({ startingDate, endingDate }: IPTOPeriod): Promise<HolidayDays> => {
    const headers = {
      "Content-Type": "application/json",
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${this.authService.getToken()}`,
    };
    const data = {
      startingDate,
      endingDate,
    };
    const res = await axios.post(`${BASE_URL}holidays/calc`, data, { headers });
    return res.data;
  };
}

export default HolidayService;
