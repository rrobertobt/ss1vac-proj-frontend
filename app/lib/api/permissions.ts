import { $api } from "~/utils/plain-fetch";

export interface Permission {
  id: number;
  code: string;
  description: string;
}

export const permissionsApi = {
  list: () => $api<Array<Permission>>("/permissions"),
};
