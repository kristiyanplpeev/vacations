import { RouteComponentProps } from "react-router";

import { PTOFormMatchProps } from "components/NewPTO/PTOForm/PTOForm";

export const RouteComponentPropsMock: RouteComponentProps<PTOFormMatchProps> = {
  history: {
    action: "PUSH",
    block: jest.fn(),
    createHref: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    length: 33,
    listen: jest.fn(),
    location: {
      pathname: "/dashboard/id/test",
      search: "",
      hash: "",
      state: undefined,
      key: "2t81t7",
    },
    push: jest.fn(),
    replace: jest.fn(),
  },
  match: {
    isExact: true,
    params: { id: "3bc6ce5f-a500-4252-8571-e91a9ee54fc8" },
    path: "/dashboard/id/:id",
    url: "/dashboard/id/3bc6ce5f-a500-4252-8571-e91a9ee54fc8",
  },
  location: {
    hash: "",
    key: "2t81t7",
    pathname: "/dashboard/id/3bc6ce5f-a500-4252-8571-e91a9ee54fc8",
    search: "",
    state: undefined,
  },
};
