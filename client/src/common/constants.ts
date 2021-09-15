export const BASE_URL = "http://localhost:5000/";

export const dayStatus = {
  workday: "workday",
  weekend: "weekend",
};

export const PTOStatus = {
  approved: "approved",
  requested: "requested",
  rejected: "rejected",
};

export const user = {
  login: "LOGIN_USER",
  logout: "LOGOUT_USER",
  check: "CHECK_USER",
};

export const errMessage = "Something went wrong.";

export const emptyUser = {
  id: "",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandle = (err: any): string => {
  if (err.response) {
    return err.response.data.message;
  } else {
    return errMessage;
  }
};
export const anyTeam = "any team";

export const anyPosition = "any position";
