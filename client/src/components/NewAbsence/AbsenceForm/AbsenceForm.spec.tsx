import React from "react";

import { Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { mount } from "enzyme";
import { Provider } from "inversify-react";

import { RouteComponentPropsMock } from "common/testConstants";
import { PaidAndUnpaid, Court } from "components/NewAbsence/AbsenceForm/AbsenceForm";
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

const absenceServiceMock = {
  addAbsence: () => Promise.resolve(undefined),
};

const addAbsenceButtonDataUnitTest = "add-absence-button";
const warningMessageDataUnitTest = "warning-message";
const commentInputDatUnitTest = "comment-input";

const getSelector = (value: string) => `[data-unit-test="${value}"]`;

const getContainer = () => {
  myContainer.snapshot();
  myContainer.rebind(TYPES.Absence).toConstantValue(absenceServiceMock);

  return myContainer;
};

const getPaidAndUnpaidAbsenceComponent = (
  startingDate: string,
  endingDate: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return mount(
    <Provider container={container}>
      <PaidAndUnpaid
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

const getCourtAbsenceComponent = (
  startingDate: string,
  endingDate: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return mount(
    <Provider container={container}>
      <Court
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
describe("Absence Form ", () => {
  afterEach(() => {
    myContainer.restore();
  });
  it("Should render comment input when paid or unpaid leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getPaidAndUnpaidAbsenceComponent(
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const commentInput = component.find(getSelector(commentInputDatUnitTest));

    // assert
    expect(commentInput).toHaveLength(5);
  });

  it("Should not render comment input when court leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getCourtAbsenceComponent(
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const commentInput = component.find(getSelector(commentInputDatUnitTest));

    // assert
    expect(commentInput).toHaveLength(0);
  });
  it("Should render warning after clicking Add button with invalid absence period", () => {
    // arrange
    const containerMock = getContainer();
    const component = getPaidAndUnpaidAbsenceComponent(
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );
    const addAbsenceButton = component.find(getSelector(addAbsenceButtonDataUnitTest)).find(Button);

    // act
    component.find(PaidAndUnpaid).instance().setState({
      comment: mockedProps.comment,
    });
    component.update();
    addAbsenceButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest)).find(Alert);

    // assert
    expect(warning).toHaveLength(1);
  });
  it("Should render warning after clicking Add button with invalid comment", () => {
    // arrange
    const containerMock = getContainer();
    const component = getPaidAndUnpaidAbsenceComponent(mockedProps.startingDate, mockedProps.endingDate, containerMock);
    const addAbsenceButton = component.find(getSelector(addAbsenceButtonDataUnitTest)).find(Button);

    // act
    component.find(PaidAndUnpaid).instance().setState({
      comment: mockedPropsInvalid.comment,
    });
    component.update();
    addAbsenceButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest)).find(Alert);

    // assert
    expect(warning).toHaveLength(1);
  });
  it("Should not render warning after clicking Add button with valid absence data", () => {
    // arrange
    const containerMock = getContainer();
    const component = getPaidAndUnpaidAbsenceComponent(mockedProps.startingDate, mockedProps.endingDate, containerMock);
    const addAbsenceButton = component.find(getSelector(addAbsenceButtonDataUnitTest)).find(Button);

    // act
    component.find(PaidAndUnpaid).instance().setState({
      comment: mockedProps.comment,
    });
    component.update();
    addAbsenceButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest)).find(Alert);

    // assert
    expect(warning).toHaveLength(0);
  });
});
