// eslint-disable-next-line import/no-cycle
import { IUserDetails } from "store/user/types";

export const BASE_URL = "http://localhost:5000/";

export const dayStatus = {
  workday: "workday",
  weekend: "weekend",
};

export const user = {
  login: "LOGIN_USER",
  logout: "LOGOUT_USER",
  check: "CHECK_USER",
};

export const errMessage = "Something went wrong.";

export const applicationJSON = "application/json";

export enum TeamsEnum {
  orchestrator = "Orchestrator",
  datadash = "Datadash",
  test = "Test team",
  noTeam = "no team",
}

export enum PositionsEnum {
  junior = "Junior",
  regular = "Regular",
  senior = "Senior",
  lead = "Team lead",
  noPosition = "no position",
}

export enum AbsencesEnum {
  paidLeave = "Paid",
  unpaidLeave = "Unpaid",
  weddingLeave = "Wedding",
  bereavementLeave = "Bereavement",
  bloodDonationLeave = "Blood donation",
  courtLeave = "Court",
}

export enum ViewsEnum {
  table = "table",
  calendar = "calendar",
}

export enum UserRolesEnum {
  admin = "admin",
  user = "user",
}

export enum AbsencesViewEnum {
  team = "team",
  mine = "mine",
}

export const noDataError = "There is no data before that period.";

export const firstSprintBeginning = new Date("2021-11-03");

export const sprintLengthDays = 14;

export const leaveTypesWithURLs = {
  paidLeave: { leave: AbsencesEnum.paidLeave, url: "paid" },
  unpaidLeave: { leave: AbsencesEnum.unpaidLeave, url: "unpaid" },
  weddingLeave: { leave: AbsencesEnum.weddingLeave, url: "wedding" },
  bereavementLeave: { leave: AbsencesEnum.bereavementLeave, url: "bereavement" },
  bloodDonationLeave: { leave: AbsencesEnum.bloodDonationLeave, url: "blood-donation" },
  courtLeave: { leave: AbsencesEnum.courtLeave, url: "court" },
};

export const noTeam = "no team";

export const anyTeam = "any team";

export const anyPosition = "any position";

export const anyRole = "any role";

export const noChange = "no change";

export const usersListClass = "users-list";

export const bulkChangeUsersClass = "change-bulk";

export const emptyUser: IUserDetails = {
  sub: "",
  googleId: "",
  email: "",
  firstName: "",
  lastName: "",
  picture: "",
  position: {
    id: "",
    position: PositionsEnum.noPosition,
    coefficient: 0,
    sortOrder: 0,
  },
  team: {
    id: "",
    team: "",
  },
  role: "",
};

export const noLoggedUser = {
  isAuthenticated: false,
  userDetails: emptyUser,
};
