import { injectable } from "inversify";

import { AbsencesEnum } from "common/constants";
import { IUserAbsenceWithWorkingDays, IUserAbsenceWithEachDayStatus } from "common/interfaces";
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
    await this.restClient.post(`holidays`, { data });
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
    await this.restClient.post(`holidays/edit`, { data });
  };

  getAbsenceEndDate = async (type: AbsencesEnum, startingDate: string): Promise<{ endingDate: string }> => {
    return await this.restClient.get(`holidays/${type}/end-date/${startingDate}`);
  };

  getUserAbsences = async (): Promise<Array<IUserAbsenceWithWorkingDays>> => {
    return await this.restClient.get(`holidays/users`);
  };

  DetailedAbsence = async (absenceId: string): Promise<IUserAbsenceWithEachDayStatus> => {
    return await this.restClient.get(`holidays/${absenceId}`);
  };

  getRequestedAbsenceById = async (absenceId: string): Promise<IUserAbsenceWithEachDayStatus> => {
    return await this.restClient.get(`holidays/${absenceId}/details`);
  };
}

export default AbsenceService;
