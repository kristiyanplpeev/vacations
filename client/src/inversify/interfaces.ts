import { UserInfoType } from "common/types";

export interface UserServiceInterface {
  logInUserRequest(): Promise<UserInfoType>;
}

export interface RedirectingInterface {}
