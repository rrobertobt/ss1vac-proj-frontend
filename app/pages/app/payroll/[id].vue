<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <Button variant="outline" size="sm" as-child>
        <NuxtLink to="/app/payroll">
          ← Volver
        </NuxtLink>
      </Button>

      <div class="flex-1">
        <h1 class="text-3xl font-bold tracking-tight">
          Período de Nómina #{{ route.params.id }}
        </h1>
        <p v-if="periodData" class="text-muted-foreground mt-1">
          {{ formatDate(periodData.period.period_start) }} - {{ formatDate(periodData.period.period_end) }}
          <Badge :variant="getStatusVariant(periodData.period.status)" class="ml-2">
            {{ getStatusLabel(periodData.period.status) }}
          </Badge>
        </p>
      </div>
    </div>

    <!-- Loading -->
    <Card v-if="loading">
      <CardContent class="p-8 text-center">
        <p class="text-muted-foreground">Cargando registros...</p>
      </CardContent>
    </Card>

    <!-- Content -->
    <template v-else-if="periodData">
      <!-- Resumen -->
      <div class="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader class="pb-3">
            <CardDescription>Total Nómina</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-bold">
              Q {{ formatNumber(totalPayroll) }}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-3">
            <CardDescription>Empleados</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-bold">
              {{ periodData.records.length }}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-3">
            <CardDescription>Salario Base</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-bold">
              Q {{ formatNumber(totalBaseSalary) }}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-3">
            <CardDescription>Sesiones</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-bold">
              Q {{ formatNumber(totalSessions) }}
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Registros -->
      <Card>
        <CardHeader>
          <CardTitle>Registros de Nómina</CardTitle>
          <CardDescription>
            Detalle de pagos por empleado. Haz clic en un registro para ver más detalles o hacer ajustes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="periodData.records.length === 0" class="text-center p-8">
            <p class="text-muted-foreground">
              No hay registros calculados. Ejecuta el cálculo de nómina primero.
            </p>
            <Button
              v-if="periodData.period.status === 'OPEN'"
              @click="handleCalculate"
              :disabled="calculating"
              class="mt-4"
            >
              {{ calculating ? 'Calculando...' : 'Calcular Nómina' }}
            </Button>
          </div>

          <div v-else class="border rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-muted">
                <tr>
                  <th class="text-left p-3">Empleado</th>
                  <th class="text-right p-3">Salario Base</th>
                  <th class="text-right p-3">Sesiones</th>
                  <th class="text-right p-3">Bonos</th>
                  <th class="text-right p-3">IGSS</th>
                  <th class="text-right p-3">Otras Deduc.</th>
                  <th class="text-right p-3">Total</th>
                  <th class="text-center p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="record in periodData.records"
                  :key="record.id"
                  class="border-t hover:bg-muted/50"
                >
                  <td class="p-3">
                    <p class="font-medium">
                      {{ record.employee?.first_name }} {{ record.employee?.last_name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ record.employee?.license_number || 'Sin licencia' }}
                    </p>
                  </td>
                  <td class="text-right p-3">Q {{ formatNumber(record.base_salary_amount) }}</td>
                  <td class="text-right p-3">
                    <p>Q {{ formatNumber(record.sessions_amount) }}</p>
                    <p class="text-xs text-muted-foreground">({{ record.sessions_count }} sesiones)</p>
                  </td>
                  <td class="text-right p-3">Q {{ formatNumber(record.bonuses_amount) }}</td>
                  <td class="text-right p-3 text-red-600">-Q {{ formatNumber(record.igss_deduction) }}</td>
                  <td class="text-right p-3 text-red-600">-Q {{ formatNumber(record.other_deductions) }}</td>
                  <td class="text-right p-3 font-bold">Q {{ formatNumber(record.total_pay) }}</td>
                  <td class="text-center p-3">
                    <Button
                      v-if="periodData.period.status === 'OPEN'"
                      variant="outline"
                      size="sm"
                      @click="openEditDialog(record)"
                    >
                      Ajustar
                    </Button>
                    <Badge v-else-if="record.paid_at" variant="default" class="text-xs">
                      Pagado
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- Dialog para ajustar registro -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar Registro de Nómina</DialogTitle>
          <DialogDescription v-if="selectedRecord">
            {{ selectedRecord.employee?.first_name }} {{ selectedRecord.employee?.last_name }}
          </DialogDescription>
        </DialogHeader>

        <form v-if="selectedRecord" @submit.prevent="handleUpdateRecord" class="space-y-4">
          <div class="space-y-4">
            <!-- Información actual -->
            <div class="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Salario Base:</span>
                <span class="font-medium">Q {{ formatNumber(selectedRecord.base_salary_amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Sesiones ({{ selectedRecord.sessions_count }}):</span>
                <span class="font-medium">Q {{ formatNumber(selectedRecord.sessions_amount) }}</span>
              </div>
            </div>

            <!-- Ajustes -->
            <div class="space-y-2">
              <Label for="edit-bonuses">Bonificaciones</Label>
              <Input
                id="edit-bonuses"
                v-model.number="editForm.bonuses_amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                :disabled="updating"
              />
              <p class="text-xs text-muted-foreground">
                Montos adicionales por bono o comisión
              </p>
            </div>

            <div class="space-y-2">
              <Label for="edit-deductions">Otras Deducciones</Label>
              <Input
                id="edit-deductions"
                v-model.number="editForm.other_deductions"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                :disabled="updating"
              />
              <p class="text-xs text-muted-foreground">
                Deducciones adicionales (préstamos, anticipos, etc.)
              </p>
            </div>

            <!-- Preview del total -->
            <div class="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Subtotal:</span>
                <span class="font-medium">
                  Q {{ formatNumber(
                    selectedRecord.base_salary_amount + 
                    selectedRecord.sessions_amount + 
                    (editForm.bonuses_amount || 0)
                  ) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">IGSS (calculado):</span>
                <span class="font-medium text-red-600">
                  -Q {{ formatNumber(calculateIGSS()) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Otras Deducciones:</span>
                <span class="font-medium text-red-600">
                  -Q {{ formatNumber(editForm.other_deductions || 0) }}
                </span>
              </div>
              <Separator />
              <div class="flex justify-between font-bold">
                <span>Total a Pagar:</span>
                <span>Q {{ formatNumber(calculateNewTotal()) }}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              @click="showEditDialog = false"
              :disabled="updating"
            >
              Cancelar
            </Button>
            <Button type="submit" :disabled="updating">
              {{ updating ? 'Actualizando...' : 'Guardar Cambios' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  getPeriodRecords,
  updatePayrollRecord,
  calculatePayroll,
  type PeriodRecordsResponse,
  type PayrollRecord,
} from '@/lib/api/payroll';


const route = useRoute();
const periodId = computed(() => Number(route.params.id));

// State
const periodData = ref<PeriodRecordsResponse | null>(null);
const loading = ref(false);
const calculating = ref(false);
const showEditDialog = ref(false);
const selectedRecord = ref<PayrollRecord | null>(null);
const updating = ref(false);
const editForm = ref({
  bonuses_amount: 0,
  other_deductions: 0,
});

// Computed
const totalPayroll = computed(() => {
  return periodData.value?.records.reduce((sum, r) => sum + r.total_pay, 0) || 0;
});

const totalBaseSalary = computed(() => {
  return periodData.value?.records.reduce((sum, r) => sum + r.base_salary_amount, 0) || 0;
});

const totalSessions = computed(() => {
  return periodData.value?.records.reduce((sum, r) => sum + r.sessions_amount, 0) || 0;
});

// Load data
async function loadPeriodRecords() {
  loading.value = true;
  try {
    periodData.value = await getPeriodRecords(periodId.value);
  } catch (error) {
    console.error('Error loading period records:', error);
    alert('Error al cargar los registros');
  } finally {
    loading.value = false;
  }
}

// Calculate
async function handleCalculate() {
  if (!confirm('¿Calcular la nómina para este período?')) return;

  calculating.value = true;
  try {
    const result = await calculatePayroll(periodId.value);
    alert(`Nómina calculada: ${result.employees_processed} empleados procesados`);
    await loadPeriodRecords();
  } catch (error: any) {
    console.error('Error calculating payroll:', error);
    alert(error?.data?.message || 'Error al calcular la nómina');
  } finally {
    calculating.value = false;
  }
}

// Edit dialog
function openEditDialog(record: PayrollRecord) {
  selectedRecord.value = record;
  editForm.value = {
    bonuses_amount: record.bonuses_amount || 0,
    other_deductions: record.other_deductions || 0,
  };
  showEditDialog.value = true;
}

// Calculate IGSS preview
function calculateIGSS() {
  if (!selectedRecord.value) return 0;
  
  const subtotal = 
    selectedRecord.value.base_salary_amount + 
    selectedRecord.value.sessions_amount + 
    (editForm.value.bonuses_amount || 0);
  
  const igssPercentage = selectedRecord.value.employee?.igss_percentage || 0;
  return subtotal * (igssPercentage / 100);
}

// Calculate new total
function calculateNewTotal() {
  if (!selectedRecord.value) return 0;
  
  const subtotal = 
    selectedRecord.value.base_salary_amount + 
    selectedRecord.value.sessions_amount + 
    (editForm.value.bonuses_amount || 0);
  
  const igss = calculateIGSS();
  const otherDeductions = editForm.value.other_deductions || 0;
  
  return subtotal - igss - otherDeductions;
}

// Update record
async function handleUpdateRecord() {
  if (!selectedRecord.value) return;

  updating.value = true;
  try {
    await updatePayrollRecord(selectedRecord.value.id, {
      bonuses_amount: editForm.value.bonuses_amount || 0,
      other_deductions: editForm.value.other_deductions || 0,
    });
    
    alert('Registro actualizado exitosamente');
    showEditDialog.value = false;
    await loadPeriodRecords();
  } catch (error: any) {
    console.error('Error updating record:', error);
    alert(error?.data?.message || 'Error al actualizar el registro');
  } finally {
    updating.value = false;
  }
}

// Helpers
function getStatusVariant(status: string) {
  switch (status) {
    case 'OPEN': return 'secondary';
    case 'CLOSED': return 'outline';
    case 'PAID': return 'default';
    default: return 'secondary';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'OPEN': return 'Abierto';
    case 'CLOSED': return 'Cerrado';
    case 'PAID': return 'Pagado';
    default: return status;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

onMounted(() => {
  loadPeriodRecords();
});
</script>
