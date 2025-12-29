import { $api } from "~/utils/plain-fetch";
import { type PagedResponse, type PaginationApiOptions } from "./base";

export interface EmployeeAvailability {
  day_of_week: number;
  start_time: string;
  end_time: string;
  specialty_id?: number;
}

export interface CreateEmployeeRequest {
  email: string;
  username: string;
  role_id: number;
  first_name: string;
  last_name: string;
  license_number: string;
  area_id: number;
  base_salary: number;
  session_rate: number;
  igss_percentage: number;
  hired_at: string;
  specialty_ids: number[];
  availability: EmployeeAvailability[];
}

export interface EmployeeResponse {
  id: number;
  first_name: string;
  last_name: string;
  license_number: string;
  area_id: number;
  base_salary: number;
  session_rate: number;
  igss_percentage: number;
  hired_at: string;
  status: string;
  user?: {
    id: number;
    email: string;
    username: string;
    role_id: number;
  };
}

export interface EmployeeItemList {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  license_number: string;
  area_id: number;
  base_salary: string;
  session_rate: string;
  igss_percentage: string;
  hired_at: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  user: {
    id: number;
    email: string;
    username: string;
    password_hash: string;
    role_id: number;
    is_active: boolean;
    last_login_at: null;
    two_fa_enabled: boolean;
    two_fa_secret: null;
    two_fa_expires_at: null;
    two_fa_attempts: number;
    password_reset_token: null;
    password_reset_expires: null;
    created_at: Date;
    updated_at: Date;
    role: {
      id: number;
      name: string;
      label: string;
      description: string;
      created_at: Date;
      updated_at: Date;
    };
  };
}

export interface FilterEmployeeOptions extends PaginationApiOptions {
  area_id?: number;
  status?: string;
  search?: string;
  role_id?: number;
}

export const employeesApi = {
  async create(data: CreateEmployeeRequest): Promise<EmployeeResponse> {
    return await $api<EmployeeResponse>("/employees", {
      method: "POST",
      body: data,
    });
  },

  async list(queryOptions?: FilterEmployeeOptions) {
    return await $api<PagedResponse<EmployeeItemList>>("/employees", {
      query: queryOptions,
    });
  },

  async getById(id: number) {
    return await $api(`/employees/${id}`);
  },

  async update(id: number, data: Partial<CreateEmployeeRequest>) {
    return await $api(`/employees/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  async delete(id: number) {
    return await $api(`/employees/${id}`, {
      method: "DELETE",
    });
  },
};
