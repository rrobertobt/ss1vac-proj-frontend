import { $api } from "~/utils/plain-fetch";

export interface CreateSessionRequest {
  professional_id?: number;
  session_datetime: string;
  session_number?: number;
  attended?: boolean;
  absence_reason?: string;
  topics?: string;
  interventions?: string;
  patient_response?: string;
  assigned_tasks?: string;
  observations?: string;
  next_appointment_datetime?: string;
  appointment_id?: number;
}

export interface UpdateSessionRequest {
  professional_id?: number;
  session_datetime?: string;
  session_number?: number;
  attended?: boolean;
  absence_reason?: string;
  topics?: string;
  interventions?: string;
  patient_response?: string;
  assigned_tasks?: string;
  observations?: string;
  next_appointment_datetime?: string;
  appointment_id?: number;
}

export interface SessionResponse {
  id: number;
  clinical_record_id: number;
  professional_id?: number;
  session_datetime: string;
  session_number?: number;
  attended?: boolean;
  absence_reason?: string;
  topics?: string;
  interventions?: string;
  patient_response?: string;
  assigned_tasks?: string;
  observations?: string;
  next_appointment_datetime?: string;
  appointment_id?: number;
  created_at: string;
  updated_at: string;
  professional?: {
    id: number;
    first_name: string;
    last_name: string;
    license_number?: string;
    status: string;
  };
}

/**
 * Crea una nueva sesión para un clinical record
 */
export function createSession(clinicalRecordId: number, data: CreateSessionRequest) {
  return $api<SessionResponse>(`/clinical-records/${clinicalRecordId}/sessions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Obtiene todas las sesiones de un clinical record
 */
export function getSessionsByClinicalRecord(clinicalRecordId: number) {
  return $api<SessionResponse[]>(`/clinical-records/${clinicalRecordId}/sessions`, {
    method: "GET",
  });
}

/**
 * Actualiza una sesión existente
 */
export function updateSession(sessionId: number, data: UpdateSessionRequest) {
  return $api<SessionResponse>(`/clinical-sessions/${sessionId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
