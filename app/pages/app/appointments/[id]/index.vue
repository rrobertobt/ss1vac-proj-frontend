<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">Detalle de Cita</h1>
        <p class="text-muted-foreground">Información completa de la cita</p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink to="/app/appointments">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver
        </NuxtLink>
      </Button>
    </div>

    <div v-if="appointment">
      <!-- Estado y Acciones -->
      <Card class="mb-6">
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="`h-3 w-3 rounded-full ${getStatusColor(appointment.status)}`" />
              <span class="text-lg font-semibold">{{ getStatusLabel(appointment.status) }}</span>
            </div>
            <div v-if="appointment.status === 'SCHEDULED'" class="flex gap-2">
              <Button variant="outline" as-child>
                <NuxtLink :to="`/app/appointments/${appointment.id}/edit`">
                  <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
                  Editar
                </NuxtLink>
              </Button>
              <Button
                variant="outline"
                class="text-green-600 hover:text-green-700"
                @click="openCompleteDialog"
              >
                <Icon name="lucide:check" class="mr-2 h-4 w-4" />
                Completar
              </Button>
              <Button variant="destructive" @click="openCancelDialog">
                <Icon name="lucide:x" class="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información del Paciente -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>
            <Icon name="lucide:user" class="inline mr-2" />
            Información del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-muted-foreground">Nombre Completo</Label>
              <p class="text-base font-medium">
                {{ appointment.patient?.first_name }}
                {{ appointment.patient?.last_name }}
              </p>
            </div>
            <div v-if="appointment.patient?.email">
              <Label class="text-muted-foreground">Correo Electrónico</Label>
              <p class="text-base">{{ appointment.patient.email }}</p>
            </div>
            <div v-if="appointment.patient?.phone">
              <Label class="text-muted-foreground">Teléfono</Label>
              <p class="text-base">{{ appointment.patient.phone }}</p>
            </div>
            <div v-if="appointment.patient?.date_of_birth">
              <Label class="text-muted-foreground">Fecha de Nacimiento</Label>
              <p class="text-base">
                {{ formatDate(appointment.patient.date_of_birth) }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información del Profesional -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>
            <Icon name="lucide:stethoscope" class="inline mr-2" />
            Información del Profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-muted-foreground">Nombre Completo</Label>
              <p class="text-base font-medium">
                {{ appointment.professional?.first_name }}
                {{ appointment.professional?.last_name }}
              </p>
            </div>
            <div v-if="appointment.professional?.specialty">
              <Label class="text-muted-foreground">Especialidad</Label>
              <p class="text-base">
                {{ appointment.professional.specialty.name }}
              </p>
            </div>
            <div v-if="appointment.professional?.professional_id">
              <Label class="text-muted-foreground">Cédula Profesional</Label>
              <p class="text-base">
                {{ appointment.professional.professional_id }}
              </p>
            </div>
            <div v-if="appointment.professional?.phone">
              <Label class="text-muted-foreground">Teléfono</Label>
              <p class="text-base">{{ appointment.professional.phone }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Detalles de la Cita -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>
            <Icon name="lucide:calendar" class="inline mr-2" />
            Detalles de la Cita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-muted-foreground">Fecha y Hora de Inicio</Label>
              <p class="text-base font-medium">
                {{ formatDateTime(appointment.start_datetime) }}
              </p>
            </div>
            <div>
              <Label class="text-muted-foreground">Fecha y Hora de Fin</Label>
              <p class="text-base font-medium">
                {{ formatDateTime(appointment.end_datetime) }}
              </p>
            </div>
            <div>
              <Label class="text-muted-foreground">Duración</Label>
              <p class="text-base">{{ calculateDuration(appointment.start_datetime, appointment.end_datetime) }}</p>
            </div>
            <div v-if="appointment.specialty">
              <Label class="text-muted-foreground">Especialidad de la Cita</Label>
              <p class="text-base">{{ appointment.specialty.name }}</p>
            </div>
            <div v-if="appointment.appointment_type">
              <Label class="text-muted-foreground">Tipo de Cita</Label>
              <p class="text-base">{{ appointment.appointment_type }}</p>
            </div>
            <div class="md:col-span-2" v-if="appointment.notes">
              <Label class="text-muted-foreground">Notas</Label>
              <p class="text-base whitespace-pre-wrap">{{ appointment.notes }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información Adicional -->
      <Card>
        <CardHeader>
          <CardTitle>
            <Icon name="lucide:info" class="inline mr-2" />
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-muted-foreground">Fecha de Creación</Label>
              <p class="text-base">
                {{ formatDateTime(appointment.created_at) }}
              </p>
            </div>
            <div v-if="appointment.updated_at">
              <Label class="text-muted-foreground">Última Actualización</Label>
              <p class="text-base">
                {{ formatDateTime(appointment.updated_at) }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="status === 'pending'" class="flex justify-center py-12">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <div v-else class="text-center py-12">
      <p class="text-muted-foreground">No se encontró la cita</p>
    </div>

    <!-- Dialog para Cancelar -->
    <AlertDialog :open="cancelDialogOpen" @update:open="cancelDialogOpen = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar cita?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción cancelará la cita. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="confirmCancel">Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Dialog para Completar -->
    <AlertDialog
      :open="completeDialogOpen"
      @update:open="completeDialogOpen = $event"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Marcar cita como completada?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción marcará la cita como atendida/completada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="confirmComplete"
            >Confirmar</AlertDialogAction
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from "#components";
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { Label } from "~/components/ui/label";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "~/components/ui/alert-dialog";
  import { toast } from "vue-sonner";
  import {
    appointmentsApi,
    type AppointmentResponse,
  } from "~/lib/api/appointments";

  const route = useRoute();
  const router = useRouter();
  const appointmentId = computed(() => Number(route.params.id));

  const cancelDialogOpen = ref(false);
  const completeDialogOpen = ref(false);

  const {
    data: appointment,
    status,
    refresh: refreshAppointment,
  } = await useAsyncData<AppointmentResponse>(
    `appointment-${appointmentId.value}`,
    () => appointmentsApi.getById(appointmentId.value),
  );

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      SCHEDULED: "bg-blue-500",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
      NO_SHOW: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      SCHEDULED: "Programada",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada",
      NO_SHOW: "No Asistió",
    };
    return labels[status] || status;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatDateTime(datetime: string) {
    return new Date(datetime).toLocaleString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  function calculateDuration(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minutos`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hora${hours > 1 ? 's' : ''}`;
  }

  function openCancelDialog() {
    cancelDialogOpen.value = true;
  }

  function openCompleteDialog() {
    completeDialogOpen.value = true;
  }

  async function confirmCancel() {
    if (!appointment.value) return;

    try {
      await appointmentsApi.cancel(appointment.value.id);
      toast.success("Cita cancelada exitosamente");
      refreshAppointment();
      cancelDialogOpen.value = false;
    } catch (error: any) {
      toast.error(error.data?.message || "Error al cancelar la cita");
    }
  }

  async function confirmComplete() {
    if (!appointment.value) return;

    try {
      await appointmentsApi.complete(appointment.value.id);
      toast.success("Cita marcada como completada");
      refreshAppointment();
      completeDialogOpen.value = false;
    } catch (error: any) {
      toast.error(error.data?.message || "Error al completar la cita");
    }
  }
</script>

<style scoped></style>
