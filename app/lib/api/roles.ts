export interface RoleItemList {
    id:          number;
    name:        string;
    label:       string;
    description: string;
}

export const roleApi = {
  list: () => $api('/roles')
}