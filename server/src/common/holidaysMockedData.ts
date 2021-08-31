export const constantHolidays = [
  {
    id: '31f6a5ec-72c9-47f2-9a66-5e46d253fffd',
    date: '2022-01-01',
    movable: false,
    comment: "New Year's Day",
  },
  {
    id: 'a0deff5b-463c-490f-a271-862d7fee8334',
    date: '2022-03-03',
    movable: false,
    comment: 'Liberation Day',
  },
  {
    id: 'e30ba39f-7a12-49e1-bb9c-33c56086f816',
    date: '2022-05-01',
    movable: false,
    comment: 'Labour Day',
  },
  {
    id: 'ddfda220-1db2-4617-9654-36a211879ad5',
    date: '2022-05-06',
    movable: false,
    comment: "St. George's day",
  },
  {
    id: 'd10556cf-319c-4b39-97e4-28a5524e9abe',
    date: '2022-05-24',
    movable: false,
    comment: 'Culture And Literacy Day',
  },
  {
    id: '1567781d-93fc-4247-bb97-8c35fd47c02f',
    date: '2022-09-06',
    movable: false,
    comment: 'Unification Day',
  },
  {
    id: '17963a7e-35f0-4659-9e0e-46edb905afb8',
    date: '2022-09-22',
    movable: false,
    comment: 'Independence Day',
  },
  {
    id: '55c3951f-19cc-4c91-a5d0-bd75225d8233',
    date: '2022-12-24',
    movable: false,
    comment: 'Christmas Eve',
  },
  {
    id: 'ef828915-707c-439d-a50f-7e5b52b3b8eb',
    date: '2022-12-25',
    movable: false,
    comment: 'Christmas',
  },
  {
    id: '52e3bf5f-265f-4208-a4c4-289916260241',
    date: '2022-12-26',
    movable: false,
    comment: 'Second Day of Christmas',
  },
];

export const movableHolidays = [
  {
    id: '31f6a5ec-72c9-47f2-9a66-5e46d253fffd',
    date: '2022-04-22',
    movable: true,
    comment: 'Ortodox Good Friday',
  },
  {
    id: 'a0deff5b-463c-490f-a271-862d7fee8334',
    date: '2022-04-23',
    movable: true,
    comment: 'Ortodox Holy Saturday',
  },
  {
    id: 'e30ba39f-7a12-49e1-bb9c-33c56086f816',
    date: '2022-04-24',
    movable: true,
    comment: 'Ortodox Easter Day',
  },
  {
    id: 'ddfda220-1db2-4617-9654-36a211879ad5',
    date: '2022-04-25',
    movable: true,
    comment: 'Ortodox Easter Monday',
  },
];

export const mockReturnedPeriod = [
  {
    date: '2021-08-12',
    status: 'workday',
  },
  {
    date: '2021-08-13',
    status: 'workday',
  },
  {
    date: '2021-08-14',
    status: 'weekend',
  },
];
export const mockEmployeeHolidays = [
  {
    id: '8389e44d-d807-4580-a9bf-ac59c07f1c4f',
    from_date: '2021-08-04',
    to_date: '2021-08-04',
    comment: 'PTO',
    status: 'requested',
  },
  {
    id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
    from_date: '2021-08-05',
    to_date: '2021-08-05',
    comment: 'PTO',
    status: 'requested',
  },
];
export const mockPTOInfo = {
  id: '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
  from_date: '2021-07-07',
  to_date: '2021-07-08',
  comment: 'PTO',
  status: 'requested',
  employee: {
    id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
    googleId: '106956791077954804246',
    email: 'kristiyan.peev@atscale.com',
    firstName: 'Kristiyan',
    lastName: 'Peev',
    picture:
      'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
  },
  approvers: [
    {
      id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    },
  ],
};
export const mockApprovers = [
  {
    id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
    googleId: '106956791077954804246',
    email: 'kristiyan.peev@atscale.com',
    firstName: 'Kristiyan',
    lastName: 'Peev',
    picture:
      'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
  },
];

export const mockSavedHoliday = {
  from_date: '2021-08-05',
  to_date: '2021-08-05',
  comment: 'PTO',
  status: 'requested',
  employee: {
    id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
    googleId: '106956791077954804246',
    email: 'kristiyan.peev@atscale.com',
    lastName: 'Peev',
    picture:
      'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
  },
  approvers: [
    {
      id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    },
  ],
  id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
};

export const mockEditedHoliday = {
  startingDate: '2021-08-05',
  endingDate: '2021-08-05',
  comment: 'PTO',
  approvers: ['kristiyan.peev@atscale.com'],
  id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
};

export const mockedUser = {
  id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
  googleId: '106956791077954804246',
  email: 'kristiyan.peev@atscale.com',
  firstName: 'Kristiyan',
  lastName: 'Peev',
  picture:
    'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
  PTO: [],
};

export const mockEmployeeHolidaysCalc = [
  {
    id: '8389e44d-d807-4580-a9bf-ac59c07f1c4f',
    from_date: '2021-08-04',
    to_date: '2021-08-04',
    comment: 'PTO',
    status: 'requested',
    totalDays: 1,
    PTODays: 1,
  },
  {
    id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
    from_date: '2021-08-05',
    to_date: '2021-08-05',
    comment: 'PTO',
    status: 'requested',
    totalDays: 1,
    PTODays: 1,
  },
];
