import axios from "axios";
import { injectable } from "inversify";

import { applicationJSON, BASE_URL, errorHandle } from "common/constants";
import { IPTO, IPTOWithId, IUserPTOWithCalcDays, IUserPTOFullDetails } from "common/interfaces";
import { IPTOService, IAuthService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class PTOService implements IPTOService {
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

  addPTO = async ({ startingDate, endingDate, comment }: IPTO): Promise<void | { warning: string }> => {
    const data = {
      startingDate,
      endingDate,
      comment,
    };
    try {
      await axios.post(`${BASE_URL}holidays`, data, this.getConfig());
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  editPTO = async ({ startingDate, endingDate, comment, id }: IPTOWithId): Promise<void> => {
    const data = {
      id,
      startingDate,
      endingDate,
      comment,
    };
    try {
      await axios.post(`${BASE_URL}holidays/edit`, data, this.getConfig());
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  getUserPTOs = async (): Promise<Array<IUserPTOWithCalcDays>> => {
    try {
      return (await axios.get(`${BASE_URL}holidays/users`, this.getConfig())).data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  PTODetailed = async (PTOId: string): Promise<IUserPTOFullDetails> => {
    try {
      return (await axios.get(`${BASE_URL}holidays/${PTOId}`, this.getConfig())).data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  getRequestedPTOById = async (PTOId: string): Promise<IUserPTOFullDetails> => {
    try {
      return (await axios.get(`${BASE_URL}holidays/details/${PTOId}`, this.getConfig())).data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };
}

export default PTOService;
