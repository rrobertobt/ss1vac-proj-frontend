export interface RoleItemList {
  id: number;
  name: string;
  label: string;
  description: string;
}

export interface RoleDetail {
  id: number;
  name: string;
  label: string;
  description: string;
}

export interface Permission {
  id: number;
  code: string;
  description: string;
}

export interface RolePermissionsResponse {
  role: RoleDetail;
  permissions: Permission[];
}

export interface UpdateRolePermissionsRequest {
  permission_ids: number[];
}

export const roleApi = {
  list: () => $api<Array<RoleItemList>>("/roles"),

  getById: (id: number) => $api<RoleDetail>(`/roles/${id}`),

  getPermissions: (roleId: number) =>
    $api<RolePermissionsResponse>(`/roles/${roleId}/permissions`),

  updatePermissions: (roleId: number, data: UpdateRolePermissionsRequest) =>
    $api<RolePermissionsResponse>(`/roles/${roleId}/permissions`, {
      method: "PUT",
      body: data,
    }),
};