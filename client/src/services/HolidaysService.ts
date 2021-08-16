import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { IPTOPeriod, HolidayDays } from "common/types";
import { IHolidaysService } from "inversify/interfaces";
import { getToken } from "providers/tokenManagment";
import "reflect-metadata";

@injectable()
class HolidaysService implements IHolidaysService {
  getDatesStatus = async ({ startingDate, endingDate }: IPTOPeriod): Promise<HolidayDays> => {
    const headers = {
      "Content-Type": "application/json",
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${getToken()}`,
    };
    const data = {
      startingDate,
      endingDate,
    };
    const res = await axios.post(`${BASE_URL}holidays/calc`, data, { headers });
    return res.data;
  };
}

export default HolidaysService;
