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

export const noLoggedUser = {
  isAuthenticated: false,
  user: emptyUser,
};
