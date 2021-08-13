import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { IHolidayFullInfo, IUserHoliday, IPTOFullInfo } from "common/types";
import { IPTOService } from "inversify/interfaces";
import { getToken } from "providers/tokenManagment";
import "reflect-metadata";

@injectable()
class PTOService implements IPTOService {
  addPTO = async ({
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

  userPTOs = async (): Promise<Array<IUserHoliday>> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${getToken()}`,
    };

    return (await axios.get(`${BASE_URL}holidays/users`, { headers })).data;
  };

  PTODetailed = async (PTOId: string): Promise<IPTOFullInfo> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${getToken()}`,
    };

    return (await axios.get(`${BASE_URL}holidays/${PTOId}`, { headers })).data;
  };
}

export default PTOService;
