/* eslint-disable @typescript-eslint/no-explicit-any */
import { errMessage } from "common/constants";

export class ErrorUtil {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static errorHandle = (err: any): string => {
    if (err.response) {
      return err.response.data.message;
    } else {
      return errMessage;
    }
  };
}
