import { AxiosRequestConfig } from "axios";
import { Dispatch } from "redux";

import { AbsencesEnum } from "common/constants";
import {
  IAbsencePeriod,
  HolidayDays,
  IUserAbsenceWithWorkingDays,
  IUserAbsenceWithEachDayStatus,
  IUserWithTeamAndPositionEnums,
  ITeams,
  IPositions,
  IUserAbsenceWithWorkingDaysAndEmployee,
  IUserAbsenceWithEmployee,
  IUserWithTeamAndPosition,
  SprintPeriod,
} from "common/interfaces";
// eslint-disable-next-line import/no-cycle
import { IUserAbsenceWithDate } from "components/Absences/Absences";
import { AppActions, IUserDetails } from "store/user/types";

export interface IAuthService {
  getToken(): string;
  extractUser(token: string): IUserDetails;
}

export interface IHolidayService {
  getDatesStatus({ startingDate, endingDate }: IAbsencePeriod): Promise<HolidayDays>;
  checkIfDayIsHoliday(date: Date, daysInterval: HolidayDays): boolean;
}

export interface IAuthenticationActionCreator {
  logInUser(): Promise<AppActions>;
  logOutUser(): AppActions;
  checkIfUserIsLoggedIn(): AppActions;
  logInUserDispatch(): (dispatch: Dispatch<AppActions>) => Promise<void>;
  logOutUserDispatch(): (dispatch: Dispatch<AppActions>) => void;
  checkIfUserIsLoggedInDispatch(): (dispatch: Dispatch<AppActions>) => void;
}

export interface IAbsenceService {
  addAbsence(
    type: AbsencesEnum,
    startingDate: string,
    endingDate?: string,
    comment?: string,
  ): Promise<void | { warning: string }>;
  getUserAbsences(): Promise<Array<IUserAbsenceWithWorkingDays>>;
  getAllUsersAbsences(
    startingDate?: string,
    endingDate?: string,
  ): Promise<Array<IUserAbsenceWithWorkingDaysAndEmployee>>;
  getAbsenceEndDate(type: AbsencesEnum, startingDate: string): Promise<{ endingDate: string }>;
  getAbsenceWithEachDay(absenceId: string): Promise<IUserAbsenceWithEachDayStatus>;
  getAbsence(absenceId: string): Promise<IUserAbsenceWithEmployee>;
  editAbsence(
    id: string,
    type: AbsencesEnum,
    startingDate: string,
    endingDate?: string,
    comment?: string,
  ): Promise<void>;
  deleteAbsence(absenceId: string): Promise<void>;
  getAbsentEmployeesNames(
    date: Date,
    absences: Array<IUserAbsenceWithWorkingDaysAndEmployee | IUserAbsenceWithDate>,
  ): Array<string>;
}

export interface IUserService {
  logInUser(): Promise<IUserDetails>;
  getAllUsers(): Promise<Array<IUserWithTeamAndPosition>>;
  getFilteredUsers(teamId: string, positionId: string, role: string): Promise<Array<IUserWithTeamAndPosition>>;
  getUsersByIds(usersIds: string): Promise<Array<IUserWithTeamAndPositionEnums>>;
  getTeams(): Promise<Array<ITeams>>;
  getPositions(): Promise<Array<IPositions>>;
  postTeam(name: string): Promise<ITeams>;
  updateUsersTeam(users: Array<string>, newTeamId: string): Promise<void>;
  updateUsersPosition(users: Array<string>, newPositionId: string): Promise<void>;
  updateUsersRole(users: Array<string>, newRole: string): Promise<void>;
  deleteTeam(teamId: string): Promise<void>;
  updatePositionCoefficient(positionId: string, newCoefficient: number): Promise<void>;
}

export interface IRestClient {
  get<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
}

export interface ISprintPlanningService {
  getSprintPeriod(sprintIndex: number): SprintPeriod;
  getUsersAbsenceDaysCount(
    users: Array<IUserWithTeamAndPosition>,
    absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>,
  ): Map<string, number>;
  convertSprintPeriodDatesToStrings(sprintPeriod: SprintPeriod): IAbsencePeriod;
  calculateTotalWorkdays(totalSprintDaysWithStatus: HolidayDays): number;
}
