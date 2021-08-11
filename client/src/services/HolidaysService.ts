import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { IHolidayInfo, HolidayDaysInfoType, IHolidayFullInfo, UserHolidayType, PTOFullInfo } from "common/types";
import { IHolidaysService } from "inversify/interfaces";
import { getToken } from "providers/tokenManagment";
import "reflect-metadata";

@injectable()
class HolidaysService implements IHolidaysService {
  getHolidayInfoRequest = async ({ startingDate, endingDate }: IHolidayInfo): Promise<HolidayDaysInfoType> => {
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
  }: IHolidayFullInfo): Promise<void | { warning: string }> => {
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

  userPTOsRequest = async (): Promise<Array<UserHolidayType>> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${getToken()}`,
    };

    return (await axios.get(`${BASE_URL}holidays/users`, { headers })).data;
  };

  PTODetailedRequest = async (PTOId: string): Promise<PTOFullInfo> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${getToken()}`,
    };

    return (await axios.get(`${BASE_URL}holidays/${PTOId}`, { headers })).data;
  };
}

export default HolidaysService;
