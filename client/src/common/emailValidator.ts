export class ValidationUtil {
  private static domainRegEx = /^([a-zA-Z]{2,3})|([a-zA-Z]{1}[a-zA-Z0-9\-]{1,61}[a-zA-Z0-9]{1})$/;

  private static emailLocalSegmentRegEx = /^[a-zA-Z]{1}[a-zA-Z0-9!#$%’*+\-\/=?^_`{|}~]{1,61}[a-zA-Z]{1}$/;

  static isEmail(input: string, required = true): boolean {
    if (!input) {
      return !required;
    }

    if (!input.includes("@")) {
      return false;
    }

    const splitResult = input.split("@");
    if (splitResult.length !== 2) {
      return false;
    }

    const localPart = splitResult[0];
    const domainPart = splitResult[1];

    return ValidationUtil.isValidDomain(domainPart) && ValidationUtil.isValidEmailLocalPart(localPart);
  }

  private static isValidEmailLocalPart(input: string): boolean {
    const localSegments = input.split(".");

    for (const localSegment of localSegments) {
      if (!ValidationUtil.emailLocalSegmentRegEx.test(localSegment)) {
        return false;
      }
    }
    return true;
  }

  static isValidDomain(input: string, required = true): boolean {
    if (!input) {
      return !required;
    }

    if (!input.includes(".")) {
      return false;
    }

    const parts = input.split(".");

    for (const part of parts) {
      if (!ValidationUtil.domainRegEx.test(part)) {
        return false;
      }
    }

    return true;
  }
}
