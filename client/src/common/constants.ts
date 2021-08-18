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
