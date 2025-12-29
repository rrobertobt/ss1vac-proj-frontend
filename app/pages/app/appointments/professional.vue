<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">Mi Agenda</h1>
        <p class="text-muted-foreground text-sm mt-1">
          Consulta tus citas asignadas
        </p>
      </div>
    </div>

    <div class="rounded-lg relative" v-if="appointments">
      <DataTable
        :columns="columns"
        :data="appointments"
        :totalElements="appointments.length"
        :enable-sorting="false"
        table-key-name="professional-appointments-table"
      />
    </div>
  </div>

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
</template>

<script setup lang="tsx">
  import { Icon } from "#components";
  import type { ColumnDef } from "@tanstack/vue-table";
  import DataTable from "~/components/datatable/DataTable.vue";
  import {
    appointmentsApi,
    type AppointmentResponse,
  } from "~/lib/api/appointments";
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import { Badge } from "~/components/ui/badge";
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

  const router = useRouter();
  const completeDialogOpen = ref(false);
  const selectedAppointment = ref<AppointmentResponse | null>(null);

  // Cargar citas del profesional
  const {
    data: appointments,
    status,
    error,
    refresh: refreshAppointments,
  } = await useAsyncData<AppointmentResponse[]>(
    "professional-appointments",
    async () => {
      return await appointmentsApi.myProfessionalAppointments();
    }
  );

  function getStatusBadge(status: string) {
    const badges: Record<string, { class: string; label: string }> = {
      SCHEDULED: { class: "bg-blue-500", label: "Programada" },
      COMPLETED: { class: "bg-green-500", label: "Completada" },
      CANCELLED: { class: "bg-red-500", label: "Cancelada" },
      NO_SHOW: { class: "bg-gray-500", label: "No Asistió" },
    };
    return badges[status] || { class: "bg-gray-500", label: status };
  }

  function formatDateTime(datetime: string) {
    return new Date(datetime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  function openCompleteDialog(appointment: AppointmentResponse) {
    selectedAppointment.value = appointment;
    completeDialogOpen.value = true;
  }

  async function confirmComplete() {
    if (!selectedAppointment.value) return;

    try {
      await appointmentsApi.complete(selectedAppointment.value.id);
      toast.success("Cita marcada como completada");
      refreshAppointments();
      completeDialogOpen.value = false;
    } catch (error: any) {
      toast.error(error.data?.message || "Error al completar la cita");
    }
  }

  const columns: ColumnDef<AppointmentResponse>[] = [
    {
      accessorFn: (row) =>
        `${row.patient?.first_name} ${row.patient?.last_name}`,
      id: "patient",
      meta: {
        displayName: "Paciente",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user" class="inline mr-1 mb-0.5" />
          Paciente
        </div>
      ),
      cell: ({ row }) => <div class="text-base">{row.getValue("patient")}</div>,
    },
    {
      accessorKey: "specialty.name",
      meta: {
        displayName: "Especialidad",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:briefcase-medical" class="inline mr-1 mb-0.5" />
          Especialidad
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-sm">{row.original.specialty?.name || "N/A"}</div>
      ),
    },
    {
      accessorKey: "start_datetime",
      meta: {
        displayName: "Fecha y Hora",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:calendar" class="inline mr-1 mb-0.5" />
          Fecha y Hora
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-sm">
          {formatDateTime(row.original.start_datetime)}
        </div>
      ),
    },
    {
      accessorKey: "appointment_type",
      meta: {
        displayName: "Tipo",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:file-text" class="inline mr-1 mb-0.5" />
          Tipo
        </div>
      ),
      cell: ({ row }) => <div class="text-sm">{row.getValue("appointment_type")}</div>,
    },
    {
      accessorKey: "status",
      meta: {
        displayName: "Estado",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:info" class="inline mr-1 mb-0.5" />
          Estado
        </div>
      ),
      cell: ({ row }) => {
        const badge = getStatusBadge(row.original.status);
        return (
          <div class="flex justify-center">
            <Badge class={badge.class}>{badge.label}</Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      meta: {
        displayName: "Acciones",
      },
      header: () => <div class="text-center font-semibold">Acciones</div>,
      cell: ({ row }) => {
        const handleComplete = () => {
          openCompleteDialog(row.original);
        };

        return (
          <div class="flex gap-2 justify-center">
            <Button asChild size="sm" variant="outline">
              <NuxtLink to={`/app/appointments/${row.original.id}`}>
                <Icon name="lucide:eye" class="h-4 w-4" />
              </NuxtLink>
            </Button>
            {row.original.status === "SCHEDULED" && (
              <button
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm h-9 px-4 py-2 text-green-600 hover:bg-accent hover:text-green-700"
                onClick={handleComplete}
              >
                <Icon name="lucide:check" class="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
</script>

<style scoped></style>
