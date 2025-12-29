import { $api } from "~/utils/plain-fetch";
import type { PagedResponse, PaginationApiOptions } from "./base";

// Tipos para disponibilidad
export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface ProfessionalAvailability {
  employee_id: number;
  employee_name: string;
  specialty_id?: number;
  specialty_name?: string;
  available_slots: TimeSlot[];
}

export interface AvailabilityResponse {
  date: string;
  day_of_week: number;
  professionals: ProfessionalAvailability[];
}

export interface CheckAvailabilityParams {
  date: string; // YYYY-MM-DD
  specialtyId?: number;
  professionalId?: number;
}

// Tipos para citas
export interface CreateAppointmentRequest {
  patient_id: number;
  professional_id?: number;
  specialty_id?: number;
  appointment_type?: string;
  start_datetime: string; // ISO 8601
  end_datetime: string; // ISO 8601
  notes?: string;
}

export interface UpdateAppointmentRequest {
  professional_id?: number;
  start_datetime?: string;
  end_datetime?: string;
  appointment_type?: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: number;
  patient_id: number;
  professional_id?: number;
  specialty_id?: number;
  appointment_type?: string;
  start_datetime: string;
  end_datetime: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
  };
  professional?: {
    id: number;
    first_name: string;
    last_name: string;
    license_number?: string;
  };
  specialty?: {
    id: number;
    name: string;
  };
}

export interface FilterAppointmentsOptions extends PaginationApiOptions {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  professionalId?: number;
  patientId?: number;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
}

export const appointmentsApi = {
  // Consultar disponibilidad
  async checkAvailability(
    params: CheckAvailabilityParams
  ): Promise<AvailabilityResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("date", params.date);
    if (params.specialtyId)
      queryParams.append("specialtyId", params.specialtyId.toString());
    if (params.professionalId)
      queryParams.append("professionalId", params.professionalId.toString());

    return await $api<AvailabilityResponse>(
      `/appointments/availability?${queryParams.toString()}`
    );
  },

  // Crear cita
  async create(
    data: CreateAppointmentRequest
  ): Promise<AppointmentResponse> {
    return await $api<AppointmentResponse>("/appointments", {
      method: "POST",
      body: data,
    });
  },

  // Listar citas
  async list(
    filters?: FilterAppointmentsOptions
  ): Promise<PagedResponse<AppointmentResponse>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.from) params.append("from", filters.from);
    if (filters?.to) params.append("to", filters.to);
    if (filters?.professionalId)
      params.append("professionalId", filters.professionalId.toString());
    if (filters?.patientId)
      params.append("patientId", filters.patientId.toString());
    if (filters?.status) params.append("status", filters.status);

    const queryString = params.toString();
    return await $api<PagedResponse<AppointmentResponse>>(
      `/appointments${queryString ? `?${queryString}` : ""}`
    );
  },

  // Obtener cita por ID
  async getById(id: number): Promise<AppointmentResponse> {
    return await $api<AppointmentResponse>(`/appointments/${id}`);
  },

  // Actualizar/Reprogramar cita
  async update(
    id: number,
    data: UpdateAppointmentRequest
  ): Promise<AppointmentResponse> {
    return await $api<AppointmentResponse>(`/appointments/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  // Cancelar cita
  async cancel(id: number): Promise<AppointmentResponse> {
    return await $api<AppointmentResponse>(`/appointments/${id}/cancel`, {
      method: "POST",
    });
  },

  // Marcar como completada
  async complete(id: number): Promise<AppointmentResponse> {
    return await $api<AppointmentResponse>(`/appointments/${id}/complete`, {
      method: "POST",
    });
  },

  // Mis citas (portal paciente)
  async myAppointments(): Promise<AppointmentResponse[]> {
    return await $api<AppointmentResponse[]>("/appointments/my-appointments");
  },
};
