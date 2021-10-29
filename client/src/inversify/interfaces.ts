import { AxiosRequestConfig } from "axios";
import { Dispatch } from "redux";

import { AbsencesEnum } from "common/constants";
import {
  IAbsencePeriod,
  HolidayDays,
  IUserAbsenceWithWorkingDays,
  IUserAbsenceWithEachDayStatus,
  IUserWithTeamAndPosition,
  ITeams,
  IPositions,
  IUserAbsenceWithEmployee,
} from "common/interfaces";
import { AppActions, IUserDetails } from "store/user/types";

export interface IAuthService {
  getToken(): string;
  extractUser(token: string): IUserDetails;
}

export interface IHolidayService {
  getDatesStatus({ startingDate, endingDate }: IAbsencePeriod): Promise<HolidayDays>;
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
}

export interface IUserService {
  logInUser(): Promise<IUserDetails>;
  getAllUsers(teamId: string, positionId: string, role: string): Promise<Array<IUserWithTeamAndPosition>>;
  getUsersByIds(usersIds: string): Promise<Array<IUserWithTeamAndPosition>>;
  getTeams(): Promise<Array<ITeams>>;
  getPositions(): Promise<Array<IPositions>>;
  updateUsersTeam(users: Array<string>, newTeamId: string): Promise<void>;
  updateUsersPosition(users: Array<string>, newPositionId: string): Promise<void>;
  updateUsersRole(users: Array<string>, newRole: string): Promise<void>;
}

export interface IRestClient {
  get<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, input?: AxiosRequestConfig): Promise<T>;
}
