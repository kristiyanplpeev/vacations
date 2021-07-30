export type UserInfoType = {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export type HolidayInfoType = {
  startingDate: string;
  endingDate: string;
};

export type HolidayFullInfoType = {
  startingDate: string;
  endingDate: string;
  comment: string;
  approvers: string[];
};

export type HolidayDaysInfoType = { date: string; status: string }[];

export type TextFieldType = {
  value: string;
  isValid: boolean;
  validate: (value: string) => boolean;
  errorText: string;
};
