import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { HolidayInfoType, HolidayDaysInfoType } from "common/types";
import { HolidaysServiceInterface } from "inversify/interfaces";
import { getToken } from "providers/tokenManagment";
import "reflect-metadata";

@injectable()
class HolidaysService implements HolidaysServiceInterface {
  getHolidayInfoRequest = async ({ startingDate, endingDate }: HolidayInfoType): Promise<HolidayDaysInfoType> => {
    const headers = {
      "Content-Type": "application/json",
      // eslint-disable-next-line prettier/prettier
      "Authorization": `Bearer ${getToken()}`,
    };
    const data = {
      startingDate,
      endingDate,
    };
    const res = await axios.post(`${BASE_URL}holidays`, data, { headers });
    return res.data;
  };
}

export default HolidaysService;
