import React from "react";

import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import { mount } from "enzyme";
import { Provider } from "inversify-react";

import { RouteComponentPropsMock } from "common/testConstants";
import AbsenceFactory, {
  PaidAndUnpaid,
  Court,
  AbsenceWithCalculatedEndDate,
} from "components/NewAbsence/AbsenceForm/AbsenceForm";
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

const getSelector = (value: string) => `[data-unit-test="${value}"]`;

const getContainer = () => {
  myContainer.snapshot();
  myContainer.rebind(TYPES.Absence).toConstantValue(absenceServiceMock);

  return myContainer;
};

const getComponent = (
  absenceType: string,
  startingDate: string,
  endingDate: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  const AbsenceInputs = AbsenceFactory.create(absenceType);
  return mount(
    <Provider container={container}>
      <AbsenceInputs
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
  it("Should render PaidAndUnpaid component when paid leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(
      "paid",
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const renderedComponent = component.find(PaidAndUnpaid);

    // assert
    expect(renderedComponent).toHaveLength(1);
  });

  it("Should render PaidAndUnpaid component when unpaid leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(
      "unpaid",
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const renderedComponent = component.find(PaidAndUnpaid);

    // assert
    expect(renderedComponent).toHaveLength(1);
  });

  it("Should render Court component when court leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(
      "court",
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const renderedComponent = component.find(Court);

    // assert
    expect(renderedComponent).toHaveLength(1);
  });

  it("Should render AbsenceWithCalculatedEndDate component when wedding leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(
      "wedding",
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const renderedComponent = component.find(AbsenceWithCalculatedEndDate);

    // assert
    expect(renderedComponent).toHaveLength(1);
  });
  it("Should render AbsenceWithCalculatedEndDate component when bereavement leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(
      "bereavement",
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const renderedComponent = component.find(AbsenceWithCalculatedEndDate);

    // assert
    expect(renderedComponent).toHaveLength(1);
  });

  it("Should render AbsenceWithCalculatedEndDate component when blood donation leave is selected", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(
      "blood-donation",
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );

    // act
    const renderedComponent = component.find(AbsenceWithCalculatedEndDate);

    // assert
    expect(renderedComponent).toHaveLength(1);
  });
  it("Should render warning after clicking Add button with invalid absence period", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent(
      "paid",
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      containerMock,
    );
    const addAbsenceButton = component.find(getSelector(addAbsenceButtonDataUnitTest)).find(Button);

    // act
    addAbsenceButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest)).find(Alert);

    // assert
    expect(warning).toHaveLength(1);
  });
  it("Should render warning after clicking Add button with invalid comment", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent("paid", mockedProps.startingDate, mockedProps.endingDate, containerMock);
    const addAbsenceButton = component.find(getSelector(addAbsenceButtonDataUnitTest)).find(Button);

    // act
    component
      .find(TextField)
      .find("textarea")
      .at(0)
      .simulate("change", { target: { value: "" } });

    addAbsenceButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest)).find(Alert);

    // assert
    expect(warning).toHaveLength(1);
  });
  it("Should not render warning after clicking Add button with valid absence data", () => {
    // arrange
    const containerMock = getContainer();
    const component = getComponent("paid", mockedProps.startingDate, mockedProps.endingDate, containerMock);
    const addAbsenceButton = component.find(getSelector(addAbsenceButtonDataUnitTest)).find(Button);

    // act
    addAbsenceButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest)).find(Alert);

    // assert
    expect(warning).toHaveLength(0);
  });
});
