import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

export type UserInfoType = {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export type HolidayInfoType = {
  startingDate: MaterialUiPickersDate;
  endingDate: MaterialUiPickersDate;
};

export type HolidayDaysInfoType = { date: string; status: string }[];
