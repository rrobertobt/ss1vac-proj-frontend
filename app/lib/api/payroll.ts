// Types & Interfaces
export interface PayrollPeriod {
  id: number;
  period_start: string;
  period_end: string;
  status: 'OPEN' | 'CLOSED' | 'PAID';
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  license_number?: string;
  base_salary: number;
  session_rate: number;
  igss_percentage: number;
  status: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export interface PayrollRecord {
  id: number;
  employee_id: number;
  period_id: number;
  base_salary_amount: number;
  sessions_count: number;
  sessions_amount: number;
  bonuses_amount: number;
  igss_deduction: number;
  other_deductions: number;
  total_pay: number;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  period?: PayrollPeriod;
}

export interface CreatePeriodPayload {
  period_start: string;
  period_end: string;
}

export interface UpdatePayrollRecordPayload {
  bonuses_amount?: number;
  other_deductions?: number;
}

export interface PeriodRecordsResponse {
  period: PayrollPeriod;
  records: PayrollRecord[];
}

export interface EmployeeHistoryResponse {
  employee: Employee;
  records: PayrollRecord[];
}

export interface CalculateResponse {
  message: string;
  employees_processed: number;
}

/**
 * Crear un nuevo período de nómina
 */
export async function createPayrollPeriod(
  payload: CreatePeriodPayload
): Promise<PayrollPeriod> {
  return $api('/payroll/periods', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Obtener todos los períodos de nómina
 */
export async function getPayrollPeriods(): Promise<PayrollPeriod[]> {
  return $api('/payroll/periods', {
    method: 'GET',
  });
}

/**
 * Calcular nómina para un período
 */
export async function calculatePayroll(periodId: number): Promise<CalculateResponse> {
  return $api(`/payroll/periods/${periodId}/calculate`, {
    method: 'POST',
  });
}

/**
 * Obtener registros de nómina de un período
 */
export async function getPeriodRecords(periodId: number): Promise<PeriodRecordsResponse> {
  return $api(`/payroll/periods/${periodId}/records`, {
    method: 'GET',
  });
}

/**
 * Obtener detalle de un registro específico
 */
export async function getPayrollRecord(recordId: number): Promise<PayrollRecord> {
  return $api(`/payroll/records/${recordId}`, {
    method: 'GET',
  });
}

/**
 * Actualizar un registro de nómina (ajustes manuales)
 */
export async function updatePayrollRecord(
  recordId: number,
  payload: UpdatePayrollRecordPayload
): Promise<PayrollRecord> {
  return $api(`/payroll/records/${recordId}`, {
    method: 'PATCH',
    body: payload,
  });
}

/**
 * Cerrar un período de nómina
 */
export async function closePeriod(periodId: number): Promise<PayrollPeriod> {
  return $api(`/payroll/periods/${periodId}/close`, {
    method: 'POST',
  });
}

/**
 * Procesar pago de un período
 */
export async function payPeriod(periodId: number): Promise<PayrollPeriod> {
  return $api(`/payroll/periods/${periodId}/pay`, {
    method: 'POST',
  });
}

/**
 * Obtener historial de nómina de un empleado
 */
export async function getEmployeePayrollHistory(
  employeeId: number
): Promise<EmployeeHistoryResponse> {
  return $api(`/payroll/employees/${employeeId}/history`, {
    method: 'GET',
  });
}
