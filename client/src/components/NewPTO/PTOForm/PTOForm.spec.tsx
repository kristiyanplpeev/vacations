import React from "react";

import { Button } from "@material-ui/core";
import { mount, shallow } from "enzyme";
import { Provider } from "inversify-react";

import { RouteComponentPropsMock } from "common/testConstants";
import { PTOForm } from "components/NewPTO/PTOForm/PTOForm";
import { IPTOService } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

const setError = jest.fn();
const setStartingDate = jest.fn();
const setEndingDate = jest.fn();
const editMode = jest.fn();

const mockedProps = {
  startingDate: "2021-05-21",
  endingDate: "2021-05-22",
  comment: {
    value: "PTO",
    isValid: true,
    validate: jest.fn(),
    errorText: "Еrror text",
  },
};

const mockedPropsInvalid = {
  startingDate: "2021-05-21",
  endingDate: "2021-05-20",
  comment: {
    value: "",
    isValid: false,
    validate: jest.fn(),
    errorText: "Mock Error text",
  },
};

const PTOServiceMock = {
  addPTO: () => Promise.resolve(undefined),
};

const addPTOButtonDataUnitTest = "addPTO-button";
const warningMessageDataUnitTest = "warning-message";

const getSelector = (value: string) => `[data-unit-test="${value}"]`;

const getContainer = () => {
  myContainer.snapshot();
  myContainer.rebind(TYPES.PTO).toConstantValue(PTOServiceMock);

  return myContainer;
};

const getComponent = (
  startingDate: string,
  endingDate: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return mount(
    <Provider container={container}>
      <PTOForm
        startingDate={startingDate}
        endingDate={endingDate}
        setStartingDate={setStartingDate}
        setEndingDate={setEndingDate}
        setError={setError}
        editMode={editMode}
        {...RouteComponentPropsMock}
      />
    </Provider>,
  );
};

// eslint-disable-next-line max-lines-per-function
describe("PTOForm", () => {
  afterEach(() => {
    myContainer.restore();
  });
  it("Should render warning after clicking Add button with invalid PTO period", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(mockedPropsInvalid.startingDate, mockedPropsInvalid.endingDate, containerMock);
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    component.find(PTOForm).instance().setState({
      comment: mockedProps.comment,
    });
    component.update();
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(5);
  });
  it("Should render warning after clicking Add button with invalid PTO comment", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(mockedProps.startingDate, mockedProps.endingDate, containerMock);
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    component.find(PTOForm).instance().setState({
      comment: mockedPropsInvalid.comment,
    });
    component.update();
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(5);
  });
  it("Should not render warning after clicking Add button with valid PTO data", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(mockedProps.startingDate, mockedProps.endingDate, containerMock);
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    component.find(PTOForm).instance().setState({
      comment: mockedProps.comment,
    });
    component.update();
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(0);
  });
});
