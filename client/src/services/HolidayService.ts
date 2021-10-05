import axios from "axios";
import { injectable } from "inversify";

import { applicationJSON, BASE_URL, errorHandle } from "common/constants";
import { IAbsencePeriod, HolidayDays } from "common/interfaces";
import { IHolidayService, IAuthService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class HolidayService implements IHolidayService {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getConfig = (headers?: any) => ({
    headers: Object.assign(
      {
        "Content-Type": applicationJSON,
        // eslint-disable-next-line prettier/prettier
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
      headers,
    ),
  });

  getDatesStatus = async ({ startingDate, endingDate }: IAbsencePeriod): Promise<HolidayDays> => {
    try {
      const res = await axios.get(`${BASE_URL}holidays/calc/${startingDate}/${endingDate}`, this.getConfig());
      return res.data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };
}

export default HolidayService;
