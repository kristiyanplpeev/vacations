export type Token = {
  access_token: string;
};

export interface PTODetails {
  id?: string;
  startingDate: string;
  endingDate: string;
  comment: string;
  approvers: Array<string>;
}
