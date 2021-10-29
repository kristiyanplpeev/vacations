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

export const emptyUser = {
  sub: "",
  googleId: "",
  email: "",
  firstName: "",
  lastName: "",
  picture: "",
};

export const applicationJSON = "application/json";

export const noLoggedUser = {
  isAuthenticated: false,
  user: emptyUser,
};

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

export enum AbsencesViewEnum {
  team = "team",
  mine = "mine",
}

export const leaveTypesWithURLs = {
  paidLeave: { leave: AbsencesEnum.paidLeave, url: "paid" },
  unpaidLeave: { leave: AbsencesEnum.unpaidLeave, url: "unpaid" },
  weddingLeave: { leave: AbsencesEnum.weddingLeave, url: "wedding" },
  bereavementLeave: { leave: AbsencesEnum.bereavementLeave, url: "bereavement" },
  bloodDonationLeave: { leave: AbsencesEnum.bloodDonationLeave, url: "blood-donation" },
  courtLeave: { leave: AbsencesEnum.courtLeave, url: "court" },
};

export const anyTeam = "any team";

export const anyPosition = "any position";
