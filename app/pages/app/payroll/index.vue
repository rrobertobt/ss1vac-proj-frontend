<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Gestión de Nómina</h1>
        <p class="text-muted-foreground mt-2">
          Administra períodos de nómina, cálculos y pagos a empleados.
        </p>
      </div>

      <Button @click="showCreateDialog = true">
        Crear Período
      </Button>
    </div>

    <!-- Lista de períodos -->
    <Card>
      <CardHeader>
        <CardTitle>Períodos de Nómina</CardTitle>
        <CardDescription>
          Gestiona el ciclo completo: crear, calcular, revisar, cerrar y pagar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="periodsLoading" class="flex justify-center p-8">
          <p class="text-muted-foreground">Cargando períodos...</p>
        </div>

        <div v-else-if="!periods || periods.length === 0" class="text-center p-8">
          <p class="text-muted-foreground">No hay períodos de nómina creados.</p>
          <Button @click="showCreateDialog = true" class="mt-4" variant="outline">
            Crear Primer Período
          </Button>
        </div>

        <div v-else class="border rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-muted">
              <tr>
                <th class="text-left p-3">ID</th>
                <th class="text-left p-3">Período</th>
                <th class="text-center p-3">Estado</th>
                <th class="text-right p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="period in periods"
                :key="period.id"
                class="border-t hover:bg-muted/50"
              >
                <td class="p-3">{{ period.id }}</td>
                <td class="p-3">
                  <p class="font-medium">
                    {{ formatDate(period.period_start) }} - {{ formatDate(period.period_end) }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Creado: {{ formatDateTime(period.created_at) }}
                  </p>
                </td>
                <td class="text-center p-3">
                  <Badge :variant="getStatusVariant(period.status)">
                    {{ getStatusLabel(period.status) }}
                  </Badge>
                </td>
                <td class="text-right p-3">
                  <div class="flex justify-end gap-2">
                    <!-- Ver registros -->
                    <Button
                      variant="outline"
                      size="sm"
                      as-child
                    >
                      <NuxtLink :to="`/app/payroll/${period.id}`">
                        Ver Registros
                      </NuxtLink>
                    </Button>

                    <!-- Calcular (solo si OPEN) -->
                    <Button
                      v-if="period.status === 'OPEN'"
                      variant="default"
                      size="sm"
                      @click="handleCalculate(period.id)"
                      :disabled="calculatingPeriod === period.id"
                    >
                      {{ calculatingPeriod === period.id ? 'Calculando...' : 'Calcular' }}
                    </Button>

                    <!-- Cerrar (solo si OPEN) -->
                    <Button
                      v-if="period.status === 'OPEN'"
                      variant="secondary"
                      size="sm"
                      @click="handleClose(period.id)"
                      :disabled="closingPeriod === period.id"
                    >
                      {{ closingPeriod === period.id ? 'Cerrando...' : 'Cerrar' }}
                    </Button>

                    <!-- Pagar (solo si CLOSED) -->
                    <Button
                      v-if="period.status === 'CLOSED'"
                      variant="default"
                      size="sm"
                      @click="handlePay(period.id)"
                      :disabled="payingPeriod === period.id"
                    >
                      {{ payingPeriod === period.id ? 'Pagando...' : 'Pagar' }}
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Dialog para crear período -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Período de Nómina</DialogTitle>
          <DialogDescription>
            Define las fechas de inicio y fin del período de pago.
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleCreatePeriod" class="space-y-4">
          <div class="space-y-2">
            <Label for="period-start">Fecha de inicio</Label>
            <Input
              id="period-start"
              v-model="newPeriod.period_start"
              type="date"
              required
              :disabled="creatingPeriod"
            />
          </div>

          <div class="space-y-2">
            <Label for="period-end">Fecha de fin</Label>
            <Input
              id="period-end"
              v-model="newPeriod.period_end"
              type="date"
              required
              :disabled="creatingPeriod"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              @click="showCreateDialog = false"
              :disabled="creatingPeriod"
            >
              Cancelar
            </Button>
            <Button type="submit" :disabled="creatingPeriod">
              {{ creatingPeriod ? 'Creando...' : 'Crear Período' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
import {
  createPayrollPeriod,
  getPayrollPeriods,
  calculatePayroll,
  closePeriod,
  payPeriod,
  type PayrollPeriod,
} from '@/lib/api/payroll';

// State
const periods = ref<PayrollPeriod[]>([]);
const periodsLoading = ref(false);
const showCreateDialog = ref(false);
const newPeriod = ref({
  period_start: '',
  period_end: '',
});
const creatingPeriod = ref(false);
const calculatingPeriod = ref<number | null>(null);
const closingPeriod = ref<number | null>(null);
const payingPeriod = ref<number | null>(null);

// Load periods
async function loadPeriods() {
  periodsLoading.value = true;
  try {
    periods.value = await getPayrollPeriods();
    // Sort by most recent first
    periods.value.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error('Error loading periods:', error);
    alert('Error al cargar los períodos');
  } finally {
    periodsLoading.value = false;
  }
}

// Create period
async function handleCreatePeriod() {
  if (!newPeriod.value.period_start || !newPeriod.value.period_end) {
    alert('Por favor completa todas las fechas');
    return;
  }

  creatingPeriod.value = true;
  try {
    await createPayrollPeriod(newPeriod.value);
    alert('Período creado exitosamente');
    showCreateDialog.value = false;
    newPeriod.value = { period_start: '', period_end: '' };
    await loadPeriods();
  } catch (error: any) {
    console.error('Error creating period:', error);
    alert(error?.data?.message || 'Error al crear el período');
  } finally {
    creatingPeriod.value = false;
  }
}

// Calculate payroll
async function handleCalculate(periodId: number) {
  if (!confirm('¿Calcular la nómina para este período? Esto procesará todas las citas completadas.')) {
    return;
  }

  calculatingPeriod.value = periodId;
  try {
    const result = await calculatePayroll(periodId);
    alert(`Nómina calculada: ${result.employees_processed} empleados procesados`);
    await loadPeriods();
  } catch (error: any) {
    console.error('Error calculating payroll:', error);
    alert(error?.data?.message || 'Error al calcular la nómina');
  } finally {
    calculatingPeriod.value = null;
  }
}

// Close period
async function handleClose(periodId: number) {
  if (!confirm('¿Cerrar este período? No podrás hacer más ajustes después.')) {
    return;
  }

  closingPeriod.value = periodId;
  try {
    await closePeriod(periodId);
    alert('Período cerrado exitosamente');
    await loadPeriods();
  } catch (error: any) {
    console.error('Error closing period:', error);
    alert(error?.data?.message || 'Error al cerrar el período');
  } finally {
    closingPeriod.value = null;
  }
}

// Pay period
async function handlePay(periodId: number) {
  if (!confirm('¿Procesar el pago de este período? Esta acción es irreversible.')) {
    return;
  }

  payingPeriod.value = periodId;
  try {
    await payPeriod(periodId);
    alert('Pago procesado exitosamente');
    await loadPeriods();
  } catch (error: any) {
    console.error('Error paying period:', error);
    alert(error?.data?.message || 'Error al procesar el pago');
  } finally {
    payingPeriod.value = null;
  }
}

// Helpers
function getStatusVariant(status: string) {
  switch (status) {
    case 'OPEN':
      return 'secondary';
    case 'CLOSED':
      return 'outline';
    case 'PAID':
      return 'default';
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'OPEN':
      return 'Abierto';
    case 'CLOSED':
      return 'Cerrado';
    case 'PAID':
      return 'Pagado';
    default:
      return status;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

onMounted(() => {
  loadPeriods();
});
</script>
