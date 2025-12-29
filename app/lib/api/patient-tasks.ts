import { $api } from "~/utils/plain-fetch";

export interface CreatePatientTaskRequest {
  clinical_record_id?: number;
  title: string;
  description?: string;
  due_date?: string;
}

export interface UpdatePatientTaskRequest {
  title?: string;
  description?: string;
  due_date?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface PatientTaskResponse {
  id: number;
  patient_id: number;
  clinical_record_id?: number;
  assigned_by_employee_id?: number;
  title: string;
  description?: string;
  due_date?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  completed_at?: string;
  created_at: string;
  updated_at: string;
  assigned_by?: {
    id: number;
    first_name: string;
    last_name: string;
    license_number?: string;
  };
  clinical_record?: {
    id: number;
    record_number?: string;
  };
}

/**
 * Crea una nueva tarea para un paciente
 */
export function createPatientTask(patientId: number, data: CreatePatientTaskRequest) {
  return $api<PatientTaskResponse>(`/patients/${patientId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Obtiene todas las tareas de un paciente
 */
export function getPatientTasks(patientId: number) {
  return $api<PatientTaskResponse[]>(`/patients/${patientId}/tasks`, {
    method: "GET",
  });
}

/**
 * Actualiza una tarea existente
 */
export function updatePatientTask(taskId: number, data: UpdatePatientTaskRequest) {
  return $api<PatientTaskResponse>(`/patient-tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Obtiene las tareas del paciente autenticado
 */
export function getMyTasks() {
  return $api<PatientTaskResponse[]>("/patients/me/tasks", {
    method: "GET",
  });
}
