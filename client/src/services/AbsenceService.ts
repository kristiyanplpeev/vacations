import axios from "axios";
import { injectable } from "inversify";

import { AbsencesEnum, applicationJSON, BASE_URL } from "common/constants";
import { ErrorUtil } from "common/ErrorUtil";
import { IUserAbsenceWithWorkingDays, IUserAbsenceWithEachDayStatus } from "common/interfaces";
import { IAbsenceService, IAuthService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class AbsenceService implements IAbsenceService {
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

  addAbsence = async (type: AbsencesEnum, startingDate: string, endingDate: string, comment: string): Promise<void> => {
    const data = {
      type,
      startingDate,
      endingDate,
      comment,
    };
    try {
      await axios.post(`${BASE_URL}holidays`, data, this.getConfig());
    } catch (error) {
      throw new Error(ErrorUtil.errorHandle(error));
    }
  };

  editAbsence = async (
    id: string,
    type: AbsencesEnum,
    startingDate: string,
    endingDate?: string,
    comment?: string,
  ): Promise<void> => {
    const data = {
      id,
      type,
      startingDate,
      endingDate,
      comment,
    };
    try {
      await axios.post(`${BASE_URL}holidays/edit`, data, this.getConfig());
    } catch (error) {
      throw new Error(ErrorUtil.errorHandle(error));
    }
  };

  getAbsenceEndDate = async (type: AbsencesEnum, startingDate: string): Promise<{ endingDate: string }> => {
    try {
      return (await axios.get(`${BASE_URL}holidays/end/${type}/${startingDate}`, this.getConfig())).data;
    } catch (error) {
      throw new Error(ErrorUtil.errorHandle(error));
    }
  };

  getUserAbsences = async (): Promise<Array<IUserAbsenceWithWorkingDays>> => {
    try {
      return (await axios.get(`${BASE_URL}holidays/users`, this.getConfig())).data;
    } catch (error) {
      throw new Error(ErrorUtil.errorHandle(error));
    }
  };

  DetailedAbsence = async (absenceId: string): Promise<IUserAbsenceWithEachDayStatus> => {
    try {
      return (await axios.get(`${BASE_URL}holidays/${absenceId}`, this.getConfig())).data;
    } catch (error) {
      throw new Error(ErrorUtil.errorHandle(error));
    }
  };

  getRequestedAbsenceById = async (absenceId: string): Promise<IUserAbsenceWithEachDayStatus> => {
    try {
      return (await axios.get(`${BASE_URL}holidays/details/${absenceId}`, this.getConfig())).data;
    } catch (error) {
      throw new Error(ErrorUtil.errorHandle(error));
    }
  };
}

export default AbsenceService;
