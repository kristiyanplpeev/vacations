import { AbsencesEnum } from "common/constants";

export class StringUtil {
  static zipString(string: string): string {
    return string.replaceAll(" ", "").toLowerCase();
  }

  static unzipAbsenceType(type: string): AbsencesEnum {
    const absences = Object.values(AbsencesEnum);
    return absences.filter((el) => StringUtil.zipString(el) === type)[0];
  }
}
