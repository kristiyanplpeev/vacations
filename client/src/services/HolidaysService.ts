import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { HolidayInfoType, HolidayDaysInfoType, HolidayFullInfoType, UserHolidayType, ErrorType } from "common/types";
import { HolidaysServiceInterface } from "inversify/interfaces";
import { getToken } from "providers/tokenManagment";
import "reflect-metadata";

@injectable()
class HolidaysService implements HolidaysServiceInterface {
  getHolidayInfoRequest = async ({ startingDate, endingDate }: HolidayInfoType): Promise<HolidayDaysInfoType> => {
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

  addPTORequest = async ({
    startingDate,
    endingDate,
    comment,
    approvers,
  }: HolidayFullInfoType): Promise<void | { warning: string }> => {
    const headers = {
      "Content-Type": "application/json",
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${getToken()}`,
    };
    const data = {
      startingDate,
      endingDate,
      comment,
      approvers,
    };
    try {
      await axios.post(`${BASE_URL}holidays`, data, { headers });
    } catch (error) {
      if (Array.isArray(error.response.data.message)) {
        return { warning: error.response.data.message[0] };
      } else {
        return { warning: error.response.data.message };
      }
    }
  };

  userPTOsRequest = async (): Promise<UserHolidayType[]> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${getToken()}`,
    };

    return (await axios.get(`${BASE_URL}holidays/users`, { headers })).data;
  };
}

export default HolidaysService;
