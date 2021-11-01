import { injectable } from "inversify";

import { AbsencesEnum } from "common/constants";
import {
  IUserAbsenceWithWorkingDays,
  IUserAbsenceWithEachDayStatus,
  IUserAbsenceWithEmployee,
  IUserAbsenceWithWorkingDaysAndEmployee,
} from "common/interfaces";
import { IAbsenceService, IRestClient } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class AbsenceService implements IAbsenceService {
  private restClient = myContainer.get<IRestClient>(TYPES.Rest);

  addAbsence = async (type: AbsencesEnum, startingDate: string, endingDate: string, comment: string): Promise<void> => {
    const data = {
      type,
      startingDate,
      endingDate,
      comment,
    };
    await this.restClient.post(`absences`, { data });
  };

  editAbsence = async (
    id: string,
    type: AbsencesEnum,
    startingDate: string,
    endingDate?: string,
    comment?: string,
  ): Promise<void> => {
    const data = {
      type,
      startingDate,
      endingDate,
      comment,
    };
    await this.restClient.put(`absences/${id}`, { data });
  };

  getAbsenceEndDate = async (type: AbsencesEnum, startingDate: string): Promise<{ endingDate: string }> => {
    return await this.restClient.get(`absences/${type}/end-date?from=${startingDate}`);
  };

  getUserAbsences = async (): Promise<Array<IUserAbsenceWithWorkingDays>> => {
    return await this.restClient.get(`absences`);
  };

  getAbsenceWithEachDay = async (absenceId: string): Promise<IUserAbsenceWithEachDayStatus> => {
    return await this.restClient.get(`absences/${absenceId}`);
  };

  getAllUsersAbsences = async (): Promise<Array<IUserAbsenceWithWorkingDaysAndEmployee>> => {
    return await this.restClient.get(`absences/team`);
  };

  getAbsence = async (absenceId: string): Promise<IUserAbsenceWithEmployee> => {
    return await this.restClient.get(`absences/${absenceId}/details`);
  };

  deleteAbsence = async (absenceId: string): Promise<void> => {
    await this.restClient.delete(`absences/${absenceId}`);
  };
}

export default AbsenceService;
