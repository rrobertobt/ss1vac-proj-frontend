import { $api } from "~/utils/plain-fetch";
import type { PagedResponse, PaginationApiOptions } from "./base";

export interface CreateClinicalRecordRequest {
  patient_id: number;
  record_number?: string;
  institution_name?: string;
  service?: string;
  opening_date?: string;
  responsible_employee_id?: number;
  responsible_license?: string;
  referral_source?: string;
  chief_complaint?: string;
}

export interface UpdateClinicalRecordRequest {
  record_number?: string;
  institution_name?: string;
  service?: string;
  opening_date?: string;
  responsible_employee_id?: number;
  responsible_license?: string;
  referral_source?: string;
  chief_complaint?: string;
  status?: "ACTIVE" | "CLOSED";
}

export interface ClinicalRecordResponse {
  id: number;
  patient_id: number;
  record_number?: string;
  institution_name?: string;
  service?: string;
  opening_date?: string;
  responsible_employee_id?: number;
  responsible_license?: string;
  referral_source?: string;
  chief_complaint?: string;
  status: "ACTIVE" | "CLOSED";
  created_at: string;
  updated_at: string;
  patient?: {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    status: string;
  };
  responsible_employee?: {
    id: number;
    first_name: string;
    last_name: string;
    license_number?: string;
    status: string;
  };
}

export interface ClinicalRecordFilterOptions extends PaginationApiOptions {
  patientId?: number;
  professionalId?: number;
  status?: "ACTIVE" | "CLOSED";
}

/**
 * Obtiene la lista de historias clínicas con filtros opcionales
 */
export function getClinicalRecords(options?: ClinicalRecordFilterOptions) {
  const params = new URLSearchParams();
  
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.patientId) params.append("patientId", options.patientId.toString());
  if (options?.professionalId) params.append("professionalId", options.professionalId.toString());
  if (options?.status) params.append("status", options.status);

  return $api<PagedResponse<ClinicalRecordResponse>>(`/clinical-records?${params.toString()}`, {
    method: "GET",
  });
}

/**
 * Obtiene el detalle de una historia clínica
 */
export function getClinicalRecordById(id: number) {
  return $api<ClinicalRecordResponse>(`/clinical-records/${id}`, {
    method: "GET",
  });
}

/**
 * Crea una nueva historia clínica
 */
export function createClinicalRecord(data: CreateClinicalRecordRequest) {
  return $api<ClinicalRecordResponse>("/clinical-records", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza una historia clínica existente
 */
export function updateClinicalRecord(id: number, data: UpdateClinicalRecordRequest) {
  return $api<ClinicalRecordResponse>(`/clinical-records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Obtiene las historias clínicas del paciente autenticado
 */
export function getMyClinicalRecords() {
  return $api<ClinicalRecordResponse[]>("/clinical-records/me", {
    method: "GET",
  });
}
