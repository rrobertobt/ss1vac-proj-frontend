export interface RevenueReportParams {
  start_date: string;
  end_date: string;
  currency?: string;
}

export interface PayrollReportParams {
  start_date: string;
  end_date: string;
  employee_id?: number;
}

export interface SalesHistoryParams {
  start_date: string;
  end_date: string;
  patient_id?: number;
}

export interface PatientsPerSpecialtyParams {
  start_date: string;
  end_date: string;
  specialty_id?: number;
  area_id?: number;
}

export interface RevenueReportResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  currency: string;
  summary: {
    total_invoiced: number;
    total_paid: number;
    pending: number;
    invoices_count: number;
    payments_count: number;
  };
  by_month: Array<{
    month: string;
    invoiced: number;
    paid: number;
    count: number;
  }>;
  invoices: any[];
  payments: any[];
}

export interface PayrollReportResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_base_salary: number;
    total_sessions_amount: number;
    total_bonuses: number;
    total_igss_deduction: number;
    total_other_deductions: number;
    total_paid: number;
    total_sessions: number;
    employees_count: number;
  };
  records: Array<{
    id: number;
    employee: {
      id: number;
      name: string;
      area: string;
    };
    period: {
      start: string;
      end: string;
      status: string;
    };
    base_salary_amount: number;
    sessions_count: number;
    sessions_amount: number;
    bonuses_amount: number;
    igss_deduction: number;
    other_deductions: number;
    total_pay: number;
    paid_at: string;
  }>;
}

export interface SalesHistoryResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_sales: number;
    invoices_count: number;
    services_count: number;
    services_amount: number;
    products_count: number;
    products_amount: number;
  };
  sales: Array<{
    id: number;
    invoice_number: string;
    invoice_date: string;
    patient: {
      id: number;
      name: string;
      email: string;
    };
    created_by: string;
    status: string;
    total_amount: number;
    currency: string;
    items: Array<{
      id: number;
      type: string;
      name: string;
      description: string;
      quantity: number;
      unit_price: number;
      total_amount: number;
    }>;
  }>;
}

export interface PatientsPerSpecialtyResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_appointments: number;
    total_unique_patients: number;
    specialties_count: number;
  };
  by_specialty: Array<{
    specialty: string;
    area: string;
    appointments_count: number;
    unique_patients_count: number;
    avg_appointments_per_patient: number;
  }>;
}

/**
 * Obtiene el reporte de ingresos por período
 */
export async function getRevenueReport(params: RevenueReportParams): Promise<RevenueReportResponse> {
  return $api('/reports/revenue', {
    method: 'GET',
    params,
  });
}

/**
 * Obtiene el reporte de pagos a empleados
 */
export async function getPayrollReport(params: PayrollReportParams): Promise<PayrollReportResponse> {
  return $api('/reports/payroll', {
    method: 'GET',
    params,
  });
}

/**
 * Obtiene el historial de ventas
 */
export async function getSalesHistory(params: SalesHistoryParams): Promise<SalesHistoryResponse> {
  return $api('/reports/sales', {
    method: 'GET',
    params,
  });
}

/**
 * Obtiene el reporte de pacientes atendidos por especialidad
 */
export async function getPatientsPerSpecialty(
  params: PatientsPerSpecialtyParams
): Promise<PatientsPerSpecialtyResponse> {
  return $api('/reports/patients-per-specialty', {
    method: 'GET',
    params,
  });
}
