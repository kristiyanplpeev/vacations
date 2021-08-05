import React from "react";

import { Button } from "@material-ui/core";
import { mount } from "enzyme";
import { BrowserRouter } from "react-router-dom";

import { TextFieldType } from "common/types";
import AdditionalInfo from "components/NewPTO/AdditionalInfo/AdditionalInfo";

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

const getComponent = (
  startingDate: string,
  endingDate: string,
  comment: TextFieldType,
  approvers: TextFieldType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return mount(
    <BrowserRouter>
      <AdditionalInfo
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
describe("AdditionalInfo", () => {
  it("Should render warning after clicking Add button with invalid PTO period", () => {
    const component = getComponent(
      mockedPropsInvalid.startingDate,
      mockedPropsInvalid.endingDate,
      mockedProps.comment,
      mockedProps.approvers,
    );
    const addPTOButton = component.find(`[data-unit-test="addPTO-button"]`).find(Button);
    addPTOButton.simulate("click");
    const warning = component.find(`[data-unit-test="warning-message"]`);
    expect(warning).toHaveLength(5);
  });
  it("Should render warning after clicking Add button with invalid PTO comment", () => {
    const component = getComponent(
      mockedProps.startingDate,
      mockedProps.endingDate,
      mockedPropsInvalid.comment,
      mockedProps.approvers,
    );
    const addPTOButton = component.find(`[data-unit-test="addPTO-button"]`).find(Button);
    addPTOButton.simulate("click");
    const warning = component.find(`[data-unit-test="warning-message"]`);
    expect(warning).toHaveLength(5);
  });
  it("Should render warning after clicking Add button with invalid PTO approvers", () => {
    const component = getComponent(
      mockedProps.startingDate,
      mockedProps.endingDate,
      mockedProps.comment,
      mockedPropsInvalid.approvers,
    );
    const addPTOButton = component.find(`[data-unit-test="addPTO-button"]`).find(Button);
    addPTOButton.simulate("click");
    const warning = component.find(`[data-unit-test="warning-message"]`);
    expect(warning).toHaveLength(5);
  });
  it("Should not render warning after clicking Add button", () => {
    const component = getComponent(
      mockedProps.startingDate,
      mockedProps.endingDate,
      mockedProps.comment,
      mockedProps.approvers,
    );
    const addPTOButton = component.find(`[data-unit-test="addPTO-button"]`).find(Button);
    addPTOButton.simulate("click");
    const warning = component.find(`[data-unit-test="warning-message"]`);
    expect(warning).toHaveLength(0);
  });
});
