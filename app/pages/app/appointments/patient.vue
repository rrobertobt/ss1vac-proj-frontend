<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">Mis Citas</h1>
        <p class="text-muted-foreground text-sm mt-1">
          Consulta tus citas programadas
        </p>
      </div>
    </div>

    <div class="rounded-lg relative" v-if="appointments">
      <DataTable
        :columns="columns"
        :data="appointments"
        :totalElements="appointments.length"
        :enable-sorting="false"
        table-key-name="patient-appointments-table"
      />
    </div>
  </div>
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

  const router = useRouter();

  // Cargar citas del paciente
  const {
    data: appointments,
    status,
    error,
    refresh: refreshAppointments,
  } = await useAsyncData<AppointmentResponse[]>(
    "patient-appointments",
    async () => {
      return await appointmentsApi.myAppointments();
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

  const columns: ColumnDef<AppointmentResponse>[] = [
    {
      accessorFn: (row) =>
        row.professional
          ? `${row.professional.first_name} ${row.professional.last_name}`
          : "Sin asignar",
      id: "professional",
      meta: {
        displayName: "Profesional",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:stethoscope" class="inline mr-1 mb-0.5" />
          Profesional
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("professional")}</div>
      ),
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
      cell: ({ row }) => (
        <div class="flex gap-2 justify-center">
          <Button asChild size="sm" variant="outline">
            <NuxtLink to={`/app/appointments/${row.original.id}`}>
              <Icon name="lucide:eye" class="h-4 w-4" />
            </NuxtLink>
          </Button>
        </div>
      ),
    },
  ];
</script>

<style scoped></style>
