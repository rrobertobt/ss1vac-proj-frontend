import type { PagedResponse, PaginationApiOptions } from "./base";

export interface UserItemList {
  id: number;
  email: string;
  username: string;
  role_id: number;
  is_active: boolean;
  last_login_at: Date;
  two_fa_enabled: boolean;
  two_fa_secret: null;
  two_fa_expires_at: null;
  two_fa_attempts: number;
  password_reset_token: null;
  password_reset_expires: null;
  created_at: Date;
  updated_at: Date;
  role: Role;
  employee: Employee;
  patient: Patient;
}

export interface Employee {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  license_number: null;
  area_id: null;
  base_salary: string;
  session_rate: string;
  igss_percentage: string;
  hired_at: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Patient {
  id: number;
  user_id: null;
  first_name: string;
  last_name: string;
  dob: Date;
  gender: string;
  marital_status: string;
  occupation: string;
  education_level: string;
  address: string;
  phone: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  name: string;
  label: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface FilterUsersOptions extends PaginationApiOptions {
  role_id?: number;
  is_active?: boolean;
  search?: string;
}

export const usersApi = {
  list: (queryOptions?: FilterUsersOptions) => {
    return $api<PagedResponse<UserItemList>>("/users", {
      method: "GET",
      query: queryOptions,
    });
  },
};
