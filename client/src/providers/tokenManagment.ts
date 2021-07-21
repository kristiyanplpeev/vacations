import jwtDecode from "jwt-decode";

import { UserInfoTypes } from "store/user/types";

export const getToken = (): string => localStorage.getItem("token") || "";

export const extractUser = (token: string): UserInfoTypes => {
  try {
    return jwtDecode(token);
  } catch {
    return {
      id: "",
      googleId: "",
      email: "",
      firstName: "",
      lastName: "",
      picture: "",
    };
  }
};
