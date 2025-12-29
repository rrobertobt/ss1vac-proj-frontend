import { $api } from "~/utils/plain-fetch";
import type { PagedResponse, PaginationApiOptions } from "./base";

export interface CreatePatientRequest {
  email?: string;
  username?: string;
  first_name: string;
  last_name: string;
  dob?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  marital_status?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "DOMESTIC_PARTNERSHIP";
  occupation?: string;
  education_level?: string;
  address?: string;
  phone?: string;
  patient_email?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
}

export interface UpdatePatientRequest {
  dob?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  marital_status?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "DOMESTIC_PARTNERSHIP";
  occupation?: string;
  education_level?: string;
  address?: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
}

export interface PatientResponse {
  id: number;
  user_id?: number;
  first_name: string;
  last_name: string;
  dob?: string;
  gender?: string;
  marital_status?: string;
  occupation?: string;
  education_level?: string;
  address?: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
    role?: {
      id: number;
      name: string;
      label: string;
    };
  };
}

export interface PatientItemList {
  id: number;
  user_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: string;
  user?: {
    id: number;
    email: string;
    role?: {
      id: number;
      name: string;
    };
  };
}

export interface FilterPatientsOptions extends PaginationApiOptions {
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export const patientsApi = {
  async create(data: CreatePatientRequest): Promise<PatientResponse> {
    return await $api<PatientResponse>("/patients", {
      method: "POST",
      body: data,
    });
  },

  async list(filters?: FilterPatientsOptions): Promise<PagedResponse<PatientItemList>> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);

    const queryString = params.toString();
    return await $api<PagedResponse<PatientItemList>>(
      `/patients${queryString ? `?${queryString}` : ""}`
    );
  },

  async getById(id: number): Promise<PatientResponse> {
    return await $api<PatientResponse>(`/patients/${id}`);
  },

  async update(id: number, data: UpdatePatientRequest): Promise<PatientResponse> {
    return await $api<PatientResponse>(`/patients/${id}`, {
      method: "PATCH",
      body: data,
    });
  },
};
