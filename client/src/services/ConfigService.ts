import { injectable } from "inversify";

import { IConfigService } from "inversify/interfaces";

const envFileMissingError = "Environment file missing.";

@injectable()
class ConfigService implements IConfigService {
  getFirstSprintBeginning = (): Date => {
    if (process.env.REACT_APP_FIRST_SPRINT_BEGINNING) {
      return new Date(process.env.REACT_APP_FIRST_SPRINT_BEGINNING);
    }
    throw new Error(envFileMissingError);
  };
  getSprintLengthDays = (): number => {
    if (process.env.REACT_APP_SPRINT_LENGTH) {
      return Number(process.env.REACT_APP_SPRINT_LENGTH);
    }
    throw new Error(envFileMissingError);
  };
}

export default ConfigService;
