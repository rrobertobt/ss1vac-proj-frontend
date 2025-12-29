import { $api } from "~/utils/plain-fetch";

export interface CreateConfidentialNoteRequest {
  content: string;
}

export interface ConfidentialNoteResponse {
  id: number;
  clinical_record_id: number;
  created_by_employee_id?: number;
  content: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    first_name: string;
    last_name: string;
    license_number?: string;
  };
}

/**
 * Crea una nueva nota confidencial para un clinical record
 */
export function createConfidentialNote(clinicalRecordId: number, data: CreateConfidentialNoteRequest) {
  return $api<ConfidentialNoteResponse>(`/clinical-records/${clinicalRecordId}/confidential-notes`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Obtiene todas las notas confidenciales de un clinical record
 */
export function getConfidentialNotes(clinicalRecordId: number) {
  return $api<ConfidentialNoteResponse[]>(`/clinical-records/${clinicalRecordId}/confidential-notes`, {
    method: "GET",
  });
}
