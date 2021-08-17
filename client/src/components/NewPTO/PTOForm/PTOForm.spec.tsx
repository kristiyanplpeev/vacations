import React from "react";

import { Button } from "@material-ui/core";
import { mount } from "enzyme";
import { BrowserRouter } from "react-router-dom";

import { ITextBox } from "common/types";
import PTOForm from "components/NewPTO/PTOForm/PTOForm";

const handleCommentsChange = jest.fn();
const handleApproversChange = jest.fn();
const setStartingDate = jest.fn();
const setEndingDate = jest.fn();

const mockedProps = {
  startingDate: "2021-05-21",
  endingDate: "2021-05-22",
  comment: {
    value: "PTO",
    isValid: true,
    validate: jest.fn(),
    errorText: "Еrror text",
  },
  approvers: {
    value: "kristiyan.peev@abv.bg",
    isValid: true,
    validate: jest.fn(),
    errorText: "Error text",
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
  approvers: {
    value: "invalid.email",
    isValid: false,
    validate: jest.fn(),
    errorText: "Mock Error text",
  },
};

const addPTOButtonDataUnitTest = "addPTO-button";
const warningMessageDataUnitTest = "warning-message";

const getSelector = (value: string) => `[data-unit-test="${value}"]`;

const getComponent = (
  startingDate: string,
  endingDate: string,
  comment: ITextBox,
  approvers: ITextBox,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return mount(
    <BrowserRouter>
      <PTOForm
        handleApproversChange={handleApproversChange}
        handleCommentChange={handleCommentsChange}
        startingDate={startingDate}
        endingDate={endingDate}
        comment={comment}
        approvers={approvers}
        setStartingDate={setStartingDate}
        setEndingDate={setEndingDate}
      />
    </BrowserRouter>,
  );
};

// eslint-disable-next-line max-lines-per-function
describe("PTOForm", () => {
  it("Should render warning after clicking Add button with invalid PTO period", () => {
    // arrange
    const component = getComponent(
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      mockedProps.comment,
      mockedProps.approvers,
    );
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(5);
  });
  it("Should render warning after clicking Add button with invalid PTO comment", () => {
    // arrange
    const component = getComponent(
      mockedProps.startingDate,
      mockedProps.endingDate,
      mockedPropsInvalid.comment,
      mockedProps.approvers,
    );
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(5);
  });
  it("Should render warning after clicking Add button with invalid PTO approvers", () => {
    // arrange
    const component = getComponent(
      mockedProps.startingDate,
      mockedProps.endingDate,
      mockedProps.comment,
      mockedPropsInvalid.approvers,
    );
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(5);
  });
  it("Should not render warning after clicking Add button", () => {
    // arrange
    const component = getComponent(
      mockedProps.startingDate,
      mockedProps.endingDate,
      mockedProps.comment,
      mockedProps.approvers,
    );
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(0);
  });
});
