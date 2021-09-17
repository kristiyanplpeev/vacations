import React from "react";

import { Button } from "@material-ui/core";
import { shallow } from "enzyme";

import { RouteComponentPropsMock } from "common/testConstants";
import UsersList from "components/UsersList/UsersList";

const usersCardDataUnitTest = "users-card";
const changeButtonDataUnitTest = "change-button";

const mockUser = {
  id: "id",
  googleId: "googleId",
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  picture: "picture",
  team: "no team",
  position: "no position",
};

const getSelector = (value: string) => `[data-unit-test="${value}"]`;

const getComponent = (): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any => {
  return shallow(<UsersList {...RouteComponentPropsMock} />);
};

describe("UsersList", () => {
  it("Should render change selected button after clicking on user card", () => {
    //arrange
    const component = getComponent();

    //act
    component.setState({
      error: false,
      users: [mockUser],
    });
    const userCard = component.find(getSelector(usersCardDataUnitTest));
    userCard.simulate("click");
    const selectButton = component.find(getSelector(changeButtonDataUnitTest)).find(Button);

    // assert
    expect(selectButton).toHaveLength(1);
  });
});
