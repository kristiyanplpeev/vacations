import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL, errMessage } from "common/constants";
import { IPTO, IPTOWithId, IUserPTOWithCalcDays, IUserPTOFullDetails } from "common/interfaces";
import { IPTOService, IAuthService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class PTOService implements IPTOService {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  addPTO = async ({ startingDate, endingDate, comment, approvers }: IPTO): Promise<void | { warning: string }> => {
    const headers = {
      "Content-Type": "application/json",
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${this.authService.getToken()}`,
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
      if (error.response) {
        return { warning: error.response.data.message };
      } else {
        throw new Error(errMessage);
      }
    }
  };

  editPTO = async ({ startingDate, endingDate, comment, approvers, id }: IPTOWithId): Promise<void> => {
    const headers = {
      "Content-Type": "application/json",
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${this.authService.getToken()}`,
    };
    const data = {
      id,
      startingDate,
      endingDate,
      comment,
      approvers,
    };
    try {
      await axios.post(`${BASE_URL}holidays/edit`, data, { headers });
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(errMessage);
      }
    }
  };

  getUserPTOs = async (): Promise<Array<IUserPTOWithCalcDays>> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${this.authService.getToken()}`,
    };

    return (await axios.get(`${BASE_URL}holidays/users`, { headers })).data;
  };

  PTODetailed = async (PTOId: string): Promise<IUserPTOFullDetails> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${this.authService.getToken()}`,
    };

    return (await axios.get(`${BASE_URL}holidays/${PTOId}`, { headers })).data;
  };

  getRequestedPTOById = async (PTOId: string): Promise<IUserPTOFullDetails> => {
    const headers = {
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${this.authService.getToken()}`,
    };
    try {
      return (await axios.get(`${BASE_URL}holidays/details/${PTOId}`, { headers })).data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(errMessage);
      }
    }
  };
}

export default PTOService;
