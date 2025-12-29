<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Reportes</h1>
      <p class="text-muted-foreground mt-2">
        Consulta y genera reportes financieros, de recursos humanos y clínicos.
      </p>
    </div>

    <Tabs default-value="revenue" class="w-full">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="revenue">Ingresos</TabsTrigger>
        <TabsTrigger value="payroll">Nómina</TabsTrigger>
        <TabsTrigger value="sales">Ventas</TabsTrigger>
        <TabsTrigger value="patients">Pacientes</TabsTrigger>
      </TabsList>

      <!-- Reporte de Ingresos -->
      <TabsContent value="revenue" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Ingresos por Período</CardTitle>
            <CardDescription>
              Obtiene el total de ingresos basados en facturas y pagos realizados
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="revenue-start">Fecha de inicio</Label>
                <Input
                  id="revenue-start"
                  v-model="revenueFilters.start_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="revenue-end">Fecha de fin</Label>
                <Input
                  id="revenue-end"
                  v-model="revenueFilters.end_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="revenue-currency">Moneda</Label>
                <Input
                  id="revenue-currency"
                  v-model="revenueFilters.currency"
                  placeholder="GTQ"
                />
              </div>
            </div>
            <Button @click="loadRevenueReport" :disabled="revenueLoading">
              <span v-if="revenueLoading">Cargando...</span>
              <span v-else>Generar Reporte</span>
            </Button>
          </CardContent>
        </Card>

        <Card v-if="revenueData">
          <CardHeader>
            <CardTitle>Resumen de Ingresos</CardTitle>
            <CardDescription>
              Período: {{ revenueData.period.start_date }} - {{ revenueData.period.end_date }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Total Facturado</p>
                <p class="text-2xl font-bold">
                  {{ revenueData.currency }} {{ formatNumber(revenueData.summary.total_invoiced) }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Total Pagado</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ revenueData.currency }} {{ formatNumber(revenueData.summary.total_paid) }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Pendiente</p>
                <p class="text-2xl font-bold text-orange-600">
                  {{ revenueData.currency }} {{ formatNumber(revenueData.summary.pending) }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="font-semibold">Desglose por Mes</h3>
              <div class="border rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead class="bg-muted">
                    <tr>
                      <th class="text-left p-3">Mes</th>
                      <th class="text-right p-3">Facturado</th>
                      <th class="text-right p-3">Pagado</th>
                      <th class="text-right p-3">Facturas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(month, idx) in revenueData.by_month" :key="idx" class="border-t">
                      <td class="p-3">{{ month.month }}</td>
                      <td class="text-right p-3">{{ formatNumber(month.invoiced) }}</td>
                      <td class="text-right p-3">{{ formatNumber(month.paid) }}</td>
                      <td class="text-right p-3">{{ month.count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Reporte de Nómina -->
      <TabsContent value="payroll" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Pagos a Empleados</CardTitle>
            <CardDescription>
              Obtiene los pagos de nómina realizados a empleados en un período
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="payroll-start">Fecha de inicio</Label>
                <Input
                  id="payroll-start"
                  v-model="payrollFilters.start_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="payroll-end">Fecha de fin</Label>
                <Input
                  id="payroll-end"
                  v-model="payrollFilters.end_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="payroll-employee">ID Empleado (opcional)</Label>
                <Input
                  id="payroll-employee"
                  v-model.number="payrollFilters.employee_id"
                  type="number"
                  placeholder="Todos"
                />
              </div>
            </div>
            <Button @click="loadPayrollReport" :disabled="payrollLoading">
              <span v-if="payrollLoading">Cargando...</span>
              <span v-else>Generar Reporte</span>
            </Button>
          </CardContent>
        </Card>

        <Card v-if="payrollData">
          <CardHeader>
            <CardTitle>Resumen de Nómina</CardTitle>
            <CardDescription>
              Período: {{ payrollData.period.start_date }} - {{ payrollData.period.end_date }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Total Pagado</p>
                <p class="text-2xl font-bold">
                  Q {{ formatNumber(payrollData.summary.total_paid) }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Salario Base</p>
                <p class="text-xl font-semibold">
                  Q {{ formatNumber(payrollData.summary.total_base_salary) }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Sesiones</p>
                <p class="text-xl font-semibold">
                  Q {{ formatNumber(payrollData.summary.total_sessions_amount) }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Empleados</p>
                <p class="text-2xl font-bold">
                  {{ payrollData.summary.employees_count }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="font-semibold">Registros de Nómina</h3>
              <div class="border rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead class="bg-muted">
                    <tr>
                      <th class="text-left p-3">Empleado</th>
                      <th class="text-left p-3">Área</th>
                      <th class="text-right p-3">Salario Base</th>
                      <th class="text-right p-3">Sesiones</th>
                      <th class="text-right p-3">Total</th>
                      <th class="text-center p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in payrollData.records" :key="record.id" class="border-t">
                      <td class="p-3">{{ record.employee.name }}</td>
                      <td class="p-3">{{ record.employee.area }}</td>
                      <td class="text-right p-3">Q {{ formatNumber(record.base_salary_amount) }}</td>
                      <td class="text-right p-3">
                        {{ record.sessions_count }} (Q {{ formatNumber(record.sessions_amount) }})
                      </td>
                      <td class="text-right p-3 font-semibold">
                        Q {{ formatNumber(record.total_pay) }}
                      </td>
                      <td class="text-center p-3">
                        <Badge :variant="record.period.status === 'PAID' ? 'default' : 'secondary'">
                          {{ record.period.status }}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Historial de Ventas -->
      <TabsContent value="sales" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Ventas</CardTitle>
            <CardDescription>
              Obtiene el detalle de todas las ventas (facturas con sus items)
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="sales-start">Fecha de inicio</Label>
                <Input
                  id="sales-start"
                  v-model="salesFilters.start_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="sales-end">Fecha de fin</Label>
                <Input
                  id="sales-end"
                  v-model="salesFilters.end_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="sales-patient">ID Paciente (opcional)</Label>
                <Input
                  id="sales-patient"
                  v-model.number="salesFilters.patient_id"
                  type="number"
                  placeholder="Todos"
                />
              </div>
            </div>
            <Button @click="loadSalesHistory" :disabled="salesLoading">
              <span v-if="salesLoading">Cargando...</span>
              <span v-else>Generar Reporte</span>
            </Button>
          </CardContent>
        </Card>

        <Card v-if="salesData">
          <CardHeader>
            <CardTitle>Resumen de Ventas</CardTitle>
            <CardDescription>
              Período: {{ salesData.period.start_date }} - {{ salesData.period.end_date }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Total Ventas</p>
                <p class="text-2xl font-bold">
                  Q {{ formatNumber(salesData.summary.total_sales) }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Facturas</p>
                <p class="text-2xl font-bold">
                  {{ salesData.summary.invoices_count }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Servicios</p>
                <p class="text-xl font-semibold">
                  {{ salesData.summary.services_count }} (Q {{ formatNumber(salesData.summary.services_amount) }})
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="font-semibold">Detalle de Ventas</h3>
              <div v-for="sale in salesData.sales" :key="sale.id" class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="font-semibold">{{ sale.invoice_number }}</p>
                    <p class="text-sm text-muted-foreground">{{ sale.patient.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ sale.invoice_date }}</p>
                  </div>
                  <div class="text-right">
                    <Badge :variant="sale.status === 'PAID' ? 'default' : 'secondary'">
                      {{ sale.status }}
                    </Badge>
                    <p class="text-xl font-bold mt-2">
                      {{ sale.currency }} {{ formatNumber(sale.total_amount) }}
                    </p>
                  </div>
                </div>
                <div class="border-t pt-3">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-muted-foreground">
                        <th class="text-left p-2">Item</th>
                        <th class="text-center p-2">Cant.</th>
                        <th class="text-right p-2">Precio Unit.</th>
                        <th class="text-right p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in sale.items" :key="item.id" class="border-t">
                        <td class="p-2">
                          <p class="font-medium">{{ item.name }}</p>
                          <p class="text-xs text-muted-foreground">{{ item.description }}</p>
                        </td>
                        <td class="text-center p-2">{{ item.quantity }}</td>
                        <td class="text-right p-2">{{ formatNumber(item.unit_price) }}</td>
                        <td class="text-right p-2 font-semibold">{{ formatNumber(item.total_amount) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Pacientes por Especialidad -->
      <TabsContent value="patients" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pacientes Atendidos por Especialidad</CardTitle>
            <CardDescription>
              Estadísticas de pacientes atendidos agrupados por especialidad y área
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="space-y-2">
                <Label for="patients-start">Fecha de inicio</Label>
                <Input
                  id="patients-start"
                  v-model="patientsFilters.start_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="patients-end">Fecha de fin</Label>
                <Input
                  id="patients-end"
                  v-model="patientsFilters.end_date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="patients-specialty">Especialidad (opcional)</Label>
                <Select
                  v-model="patientsFilters.specialty_id"
                >
                  <SelectTrigger id="patients-specialty">
                    <SelectValue placeholder="Todas las especialidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="specialty in specialties"
                      :key="specialty.id"
                      :value="String(specialty.id)"
                    >
                      {{ specialty.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="patients-area">Área (opcional)</Label>
                <Select
                  v-model="patientsFilters.area_id"
                >
                  <SelectTrigger id="patients-area">
                    <SelectValue placeholder="Todas las áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="area in areas"
                      :key="area.id"
                      :value="String(area.id)"
                    >
                      {{ area.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button @click="loadPatientsPerSpecialty" :disabled="patientsLoading">
              <span v-if="patientsLoading">Cargando...</span>
              <span v-else>Generar Reporte</span>
            </Button>
          </CardContent>
        </Card>

        <Card v-if="patientsData">
          <CardHeader>
            <CardTitle>Resumen de Atenciones</CardTitle>
            <CardDescription>
              Período: {{ patientsData.period.start_date }} - {{ patientsData.period.end_date }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Total Citas</p>
                <p class="text-2xl font-bold">
                  {{ patientsData.summary.total_appointments }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Pacientes Únicos</p>
                <p class="text-2xl font-bold">
                  {{ patientsData.summary.total_unique_patients }}
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <p class="text-sm text-muted-foreground">Especialidades</p>
                <p class="text-2xl font-bold">
                  {{ patientsData.summary.specialties_count }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="font-semibold">Por Especialidad</h3>
              <div class="border rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead class="bg-muted">
                    <tr>
                      <th class="text-left p-3">Especialidad</th>
                      <th class="text-left p-3">Área</th>
                      <th class="text-right p-3">Citas</th>
                      <th class="text-right p-3">Pacientes</th>
                      <th class="text-right p-3">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(spec, idx) in patientsData.by_specialty" :key="idx" class="border-t">
                      <td class="p-3 font-medium">{{ spec.specialty }}</td>
                      <td class="p-3">{{ spec.area }}</td>
                      <td class="text-right p-3">{{ spec.appointments_count }}</td>
                      <td class="text-right p-3">{{ spec.unique_patients_count }}</td>
                      <td class="text-right p-3">{{ spec.avg_appointments_per_patient.toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getRevenueReport,
  getPayrollReport,
  getSalesHistory,
  getPatientsPerSpecialty,
  type RevenueReportResponse,
  type PayrollReportResponse,
  type SalesHistoryResponse,
  type PatientsPerSpecialtyResponse,
} from '@/lib/api/reports';
import { areasApi } from '@/lib/api/areas';
import { specialtiesApi } from '@/lib/api/specialties';

// Revenue Report
const revenueFilters = ref({
  start_date: '',
  end_date: '',
  currency: 'GTQ',
});
const revenueData = ref<RevenueReportResponse | null>(null);
const revenueLoading = ref(false);

async function loadRevenueReport() {
  if (!revenueFilters.value.start_date || !revenueFilters.value.end_date) {
    alert('Por favor ingresa las fechas de inicio y fin');
    return;
  }
  
  revenueLoading.value = true;
  try {
    revenueData.value = await getRevenueReport(revenueFilters.value);
  } catch (error) {
    console.error('Error loading revenue report:', error);
    alert('Error al cargar el reporte de ingresos');
  } finally {
    revenueLoading.value = false;
  }
}

// Payroll Report
const payrollFilters = ref({
  start_date: '',
  end_date: '',
  employee_id: undefined as number | undefined,
});
const payrollData = ref<PayrollReportResponse | null>(null);
const payrollLoading = ref(false);

async function loadPayrollReport() {
  if (!payrollFilters.value.start_date || !payrollFilters.value.end_date) {
    alert('Por favor ingresa las fechas de inicio y fin');
    return;
  }
  
  payrollLoading.value = true;
  try {
    payrollData.value = await getPayrollReport(payrollFilters.value);
  } catch (error) {
    console.error('Error loading payroll report:', error);
    alert('Error al cargar el reporte de nómina');
  } finally {
    payrollLoading.value = false;
  }
}

// Sales History
const salesFilters = ref({
  start_date: '',
  end_date: '',
  patient_id: undefined as number | undefined,
});
const salesData = ref<SalesHistoryResponse | null>(null);
const salesLoading = ref(false);

async function loadSalesHistory() {
  if (!salesFilters.value.start_date || !salesFilters.value.end_date) {
    alert('Por favor ingresa las fechas de inicio y fin');
    return;
  }
  
  salesLoading.value = true;
  try {
    salesData.value = await getSalesHistory(salesFilters.value);
  } catch (error) {
    console.error('Error loading sales history:', error);
    alert('Error al cargar el historial de ventas');
  } finally {
    salesLoading.value = false;
  }
}

// Patients per Specialty
const patientsFilters = ref({
  start_date: '',
  end_date: '',
  specialty_id: undefined as number | undefined,
  area_id: undefined as number | undefined,
});
const patientsData = ref<PatientsPerSpecialtyResponse | null>(null);
const patientsLoading = ref(false);

// Lists for filters
const specialties = ref<Array<{ id: number; name: string; description: string }>>([]);
const areas = ref<Array<{ id: number; name: string; description: string }>>([]);

// Load specialties and areas on mount
onMounted(async () => {
  try {
    [specialties.value, areas.value] = await Promise.all([
      specialtiesApi.list(),
      areasApi.list(),
    ]);
  } catch (error) {
    console.error('Error loading specialties/areas:', error);
  }
});

async function loadPatientsPerSpecialty() {
  if (!patientsFilters.value.start_date || !patientsFilters.value.end_date) {
    alert('Por favor ingresa las fechas de inicio y fin');
    return;
  }
  
  patientsLoading.value = true;
  try {
    patientsData.value = await getPatientsPerSpecialty(patientsFilters.value);
  } catch (error) {
    console.error('Error loading patients per specialty report:', error);
    alert('Error al cargar el reporte de pacientes por especialidad');
  } finally {
    patientsLoading.value = false;
  }
}

// Helper function
function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
</script>
