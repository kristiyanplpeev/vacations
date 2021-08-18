import React from "react";

import { Button } from "@material-ui/core";
import { mount } from "enzyme";
import { BrowserRouter } from "react-router-dom";

import PTOForm from "components/NewPTO/PTOForm/PTOForm";

const handleCommentsChange = jest.fn();
const handleApproversChange = jest.fn();
const setStartingDate = jest.fn();
const setEndingDate = jest.fn();
const addPTO = jest.fn();

const mockedProps = {
  startingDate: "2021-05-21",
  endingDate: "2021-05-22",
  comment: {
    value: "PTO",
    isValid: true,
    validate: jest.fn(),
    errorText: "Еrror text",
    textBoxInvalid: false,
  },
  approvers: {
    value: "kristiyan.peev@abv.bg",
    isValid: true,
    validate: jest.fn(),
    errorText: "Error text",
    textBoxInvalid: false,
  },
};

const addPTOButtonDataUnitTest = "addPTO-button";
const warningMessageDataUnitTest = "warning-message";

const getSelector = (value: string) => `[data-unit-test="${value}"]`;

const getComponent = (
  warning: string,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return mount(
    <BrowserRouter>
      <PTOForm
        loading={false}
        addPTO={addPTO}
        warning={warning}
        successMessage={false}
        handleApproversChange={handleApproversChange}
        handleCommentChange={handleCommentsChange}
        startingDate={mockedProps.startingDate}
        endingDate={mockedProps.endingDate}
        comment={mockedProps.comment}
        approvers={mockedProps.approvers}
        setStartingDate={setStartingDate}
        setEndingDate={setEndingDate}
      />
    </BrowserRouter>,
  );
};

// eslint-disable-next-line max-lines-per-function
describe("PTOForm", () => {
  it("Should render warning if there is one", () => {
    // arrange
    const component = getComponent("Some warning");
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(5);
  });
  it("Should not render warning if there is not one", () => {
    // arrange
    const component = getComponent("");
    const addPTOButton = component.find(getSelector(addPTOButtonDataUnitTest)).find(Button);

    // act
    addPTOButton.simulate("click");
    const warning = component.find(getSelector(warningMessageDataUnitTest));

    // assert
    expect(warning).toHaveLength(0);
  });
});
