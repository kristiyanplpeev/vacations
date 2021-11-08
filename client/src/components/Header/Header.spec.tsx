import React from "react";

import { shallow } from "enzyme";

import { UserRolesEnum } from "common/constants";
import { RouteComponentPropsMock } from "common/testConstants";
import { Header } from "components/Header/Header";
import { mockUser } from "components/UsersList/UsersList.spec";

const adminPanelButtonUnitTest = "admin-panel-button";

const getUserReducer = (userDetails: any) => ({
  isAuthenticated: true,
  userDetails,
});

const getSelector = (value: string) => `[data-unit-test="${value}"]`;

const getComponent = (
  userInfo: any,
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any => {
  return shallow(<Header userInfo={userInfo} logOutUser={jest.fn()} {...RouteComponentPropsMock} />);
};

describe("Header", () => {
  it("Should not render admin panel button when user with role user is logged in.", () => {
    //arrange
    const component = getComponent(getUserReducer(mockUser));

    //act
    const adminButton = component.find(getSelector(adminPanelButtonUnitTest));

    // assert
    expect(adminButton).toHaveLength(0);
  });

  it("Should render admin panel button when user with role admin is logged in.", () => {
    //arrange
    const component = getComponent(getUserReducer({ ...mockUser, role: UserRolesEnum.admin }));

    //act
    const adminButton = component.find(getSelector(adminPanelButtonUnitTest));

    // assert
    expect(adminButton).toHaveLength(1);
  });
});
