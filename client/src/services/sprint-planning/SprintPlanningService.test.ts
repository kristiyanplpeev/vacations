/* eslint-disable sonarjs/no-duplicate-string */
import { differenceInCalendarDays } from "date-fns";

import { PositionsEnum, UserRolesEnum } from "common/constants";
import "reflect-metadata";
import { ISprintPlanningService } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

const firstSprintBeginning = new Date("2021-11-03");
const sprintLengthDays = 14;

const sprintDaysWithStatus = [
  {
    date: "2021-11-03",
    status: "workday",
  },
  {
    date: "2021-11-04",
    status: "workday",
  },
  {
    date: "2021-11-05",
    status: "workday",
  },
  {
    date: "2021-11-06",
    status: "weekend",
  },
  {
    date: "2021-11-07",
    status: "some holiday",
  },
];

const users = [
  {
    id: "5527181e-943d-4857-af1c-6784cba56bbc",
    googleId: "106643188234018012380",
    email: "todor.paskalev@atscale.com",
    firstName: "Todor",
    lastName: "Paskalev",
    picture: "https://lh3.googleusercontent.com/a-/AOh14GiUB5LK_sXHpfrKRHRNdctXy6yi6iBN3buG72r9",
    role: UserRolesEnum.admin,
    team: {
      id: "8a77b5f8-ff80-499a-a773-89cca4727234",
      team: "Orchestrator",
      isDeleted: false,
    },
    position: {
      id: "c68b0256-2112-4036-b30f-cfa6a62b146d",
      position: PositionsEnum.senior,
      coefficient: 0.75,
      sortOrder: 5,
    },
  },
  {
    id: "9fa11633-60c7-46f1-8ad3-2c2cc531b0c6",
    googleId: "118306999807603705118",
    email: "milen.ivanov@atscale.com",
    firstName: "Milen",
    lastName: "Ivanov",
    picture: "https://lh3.googleusercontent.com/a-/AOh14GiCx2TZzDKyUCgx6QBxlKhOIEIHfE4u7m9bfiXV",
    role: UserRolesEnum.admin,
    team: {
      id: "8a77b5f8-ff80-499a-a773-89cca4727234",
      team: "Orchestrator",
      isDeleted: false,
    },
    position: {
      id: "4ad8c831-440a-428a-90a6-0119d300ddcc",
      position: PositionsEnum.regular,
      coefficient: 0.5,
      sortOrder: 7,
    },
  },
  {
    id: "fec8eb16-3724-45b4-bc0a-205c57694ed5",
    googleId: "103940883475219076274",
    email: "ivelin.stoyanov@atscale.com",
    firstName: "Ivelin",
    lastName: "Stoyanov",
    picture: "https://lh3.googleusercontent.com/a-/AOh14Gih3GacYmbSKCYhxB14IRajGr2YGx9e6bqk10Zf",
    role: UserRolesEnum.admin,
    team: {
      id: "8a77b5f8-ff80-499a-a773-89cca4727234",
      team: "Orchestrator",
      isDeleted: false,
    },
    position: {
      id: "3c83da86-76f1-441b-926e-2935ba565fd0",
      position: PositionsEnum.junior,
      coefficient: 0.35,
      sortOrder: 10,
    },
  },
  {
    id: "868e3fb8-908f-45a5-8cc3-f63f97401863",
    googleId: "106956791077954804246",
    email: "kristiyan.peev@atscale.com",
    firstName: "Kristiyan",
    lastName: "Peev",
    picture: "https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c",
    role: UserRolesEnum.admin,
    team: {
      id: "8a77b5f8-ff80-499a-a773-89cca4727234",
      team: "Orchestrator",
      isDeleted: false,
    },
    position: {
      id: "3c83da86-76f1-441b-926e-2935ba565fd0",
      position: PositionsEnum.junior,
      coefficient: 0.35,
      sortOrder: 10,
    },
  },
];

const absences = [
  {
    id: "d240aae8-c692-48e2-97f2-ac8104065ec9",
    type: "Paid",
    startingDate: "2021-11-05",
    endingDate: "2021-11-25",
    comment: "Out of office",
    employee: {
      id: "fec8eb16-3724-45b4-bc0a-205c57694ed5",
      googleId: "103940883475219076274",
      email: "ivelin.stoyanov@atscale.com",
      firstName: "Ivelin",
      lastName: "Stoyanov",
      picture: "https://lh3.googleusercontent.com/a-/AOh14Gih3GacYmbSKCYhxB14IRajGr2YGx9e6bqk10Zf",
      role: UserRolesEnum.admin,
      position: {
        id: "3c83da86-76f1-441b-926e-2935ba565fd0",
        position: "Junior",
        coefficient: "0.35",
        sort_order: 10,
      },
      team: {
        id: "8a77b5f8-ff80-499a-a773-89cca4727234",
        team: "Orchestrator",
        is_deleted: false,
      },
    },
    totalDays: 12,
    workingDays: 8,
  },
  {
    id: "fdc84a01-5ec6-44a5-8c99-0a0ac35b7763",
    type: "Paid",
    startingDate: "2021-11-03",
    endingDate: "2021-11-04",
    comment: "Out of office",
    employee: {
      id: "fec8eb16-3724-45b4-bc0a-205c57694ed5",
      googleId: "103940883475219076274",
      email: "ivelin.stoyanov@atscale.com",
      firstName: "Ivelin",
      lastName: "Stoyanov",
      picture: "https://lh3.googleusercontent.com/a-/AOh14Gih3GacYmbSKCYhxB14IRajGr2YGx9e6bqk10Zf",
      role: UserRolesEnum.admin,
      position: {
        id: "3c83da86-76f1-441b-926e-2935ba565fd0",
        position: "Junior",
        coefficient: "0.35",
        sort_order: 10,
      },
      team: {
        id: "8a77b5f8-ff80-499a-a773-89cca4727234",
        team: "Orchestrator",
        is_deleted: false,
      },
    },
    totalDays: 2,
    workingDays: 2,
  },
  {
    id: "2bf37a38-b8c8-4a8a-82e6-2a2738171cb9",
    type: "Paid",
    startingDate: "2021-11-05",
    endingDate: "2021-11-25",
    comment: "Out of office",
    employee: {
      id: "868e3fb8-908f-45a5-8cc3-f63f97401863",
      googleId: "106956791077954804246",
      email: "kristiyan.peev@atscale.com",
      firstName: "Kristiyan",
      lastName: "Peev",
      picture: "https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c",
      role: UserRolesEnum.admin,
      position: {
        id: "3c83da86-76f1-441b-926e-2935ba565fd0",
        position: "Junior",
        coefficient: "0.35",
        sort_order: 10,
      },
      team: {
        id: "8a77b5f8-ff80-499a-a773-89cca4727234",
        team: "Orchestrator",
        is_deleted: false,
      },
    },
    totalDays: 12,
    workingDays: 8,
  },
];

// eslint-disable-next-line max-lines-per-function
describe("SprintPlanningService", () => {
  const service = myContainer.get<ISprintPlanningService>(TYPES.SprintPlanning);

  describe("getUsersAbsenceDaysCount", () => {
    it("should return a Map with each user's id as key and the number/count of the user's absence days for the sprint as value", () => {});
    const expected = new Map();
    expected.set("5527181e-943d-4857-af1c-6784cba56bbc", 0);
    expected.set("9fa11633-60c7-46f1-8ad3-2c2cc531b0c6", 0);
    expected.set("868e3fb8-908f-45a5-8cc3-f63f97401863", 8);
    expected.set("fec8eb16-3724-45b4-bc0a-205c57694ed5", 10);
    const allUsersAbsenceDays = service.getUsersAbsenceDaysCount(users, absences);
    expect(allUsersAbsenceDays).toEqual(expected);
  });
  describe("calculateTotalWorkdays", () => {
    it("should return the number of workdays for a given array of days with status", () => {
      const totalWorkdays = service.calculateTotalWorkdays(sprintDaysWithStatus);
      expect(totalWorkdays).toBe(3);
    });
  });
  describe("convertSprintPeriodDatesToStrings", () => {
    it("should convert the starting- and endingDates props of a SprintPeriod object to strings", () => {
      const sprintPeriod = { startingDate: new Date("2021-11-17"), endingDate: new Date("2021-11-30") };
      const expected = { startingDate: "2021-11-17", endingDate: "2021-11-30" };
      const sprintPeriodStringified = service.convertSprintPeriodDatesToStrings(sprintPeriod);
      expect(sprintPeriodStringified).toEqual(expected);
    });
  });
  describe("getSprintPeriod", () => {
    it("should return starting date that is 14*n days after first sprint beginning.", () => {
      const currentSprint = service.getSprintPeriod(0);
      const isSprintBeginningAliquot =
        differenceInCalendarDays(firstSprintBeginning, currentSprint.startingDate) % sprintLengthDays === 0;
      expect(isSprintBeginningAliquot).toEqual(true);
    });
    it("should return sprint with correct sprint length.", () => {
      const currentSprint = service.getSprintPeriod(0);
      const isSprintLengthCorrect =
        differenceInCalendarDays(currentSprint.endingDate, currentSprint.startingDate) === sprintLengthDays - 1;
      expect(isSprintLengthCorrect).toEqual(true);
    });
    it("should throw if the user tries to access sprint that is before first sprint date.", () => {
      const today = new Date();
      const nonExistentSprintIndex = -Math.floor(differenceInCalendarDays(today, firstSprintBeginning) / 14) - 10;
      expect(() => service.getSprintPeriod(nonExistentSprintIndex)).toThrow();
    });
  });
});
