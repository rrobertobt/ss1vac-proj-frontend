<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Gestión de Citas</h1>
      <Button as-child>
        <NuxtLink to="/app/appointments/new">
          <Icon name="lucide:calendar-plus" class="mr-2 h-4 w-4" />
          Nueva Cita
        </NuxtLink>
      </Button>
    </div>

    <!-- Filtros -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-2">
            <Label for="dateFrom">Fecha Desde</Label>
            <Input
              id="dateFrom"
              v-model="dateFrom"
              type="date"
              @change="applyFilters"
            />
          </div>
          <div class="space-y-2">
            <Label for="dateTo">Fecha Hasta</Label>
            <Input
              id="dateTo"
              v-model="dateTo"
              type="date"
              @change="applyFilters"
            />
          </div>
          <div class="space-y-2">
            <Label for="status">Estado</Label>
            <Select v-model="statusFilter" @update:model-value="applyFilters">
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="SCHEDULED">Programadas</SelectItem>
                <SelectItem value="COMPLETED">Completadas</SelectItem>
                <SelectItem value="CANCELLED">Canceladas</SelectItem>
                <SelectItem value="NO_SHOW">No Asistió</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-end">
            <Button variant="outline" @click="clearFilters" class="w-full">
              <Icon name="lucide:x" class="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="rounded-lg relative" v-if="appointments">
      <DataTable
        :columns="columns"
        :data="appointments?.data"
        :totalElements="appointments?.meta.total"
        :totalPages="appointments?.meta.totalPages"
        :paginationState="paginationOptions"
        :enable-sorting="false"
        table-key-name="appointments-table"
        @pagination-change="handlePaginationChange"
      />
    </div>
  </div>
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
  import type { PagedResponse } from "~/lib/api/base";
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import { Card, CardContent } from "~/components/ui/card";
  import { Input } from "~/components/ui/input";
  import { Label } from "~/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
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

  const route = useRoute();
  const router = useRouter();

  const dateFrom = ref(route.query.from?.toString() || "");
  const dateTo = ref(route.query.to?.toString() || "");
  const statusFilter = ref(route.query.status?.toString() || "ALL");

  const cancelDialogOpen = ref(false);
  const completeDialogOpen = ref(false);
  const selectedAppointment = ref<AppointmentResponse | null>(null);

  const {
    data: appointments,
    status,
    error,
    refresh: refreshAppointments,
  } = await useAsyncData<PagedResponse<AppointmentResponse>>(
    "admin-appointments",
    () =>
      appointmentsApi.list({
        page: route.query.page ? Number(route.query.page) : 1,
        from: route.query.from ? String(route.query.from) : undefined,
        to: route.query.to ? String(route.query.to) : undefined,
        status:
          route.query.status && route.query.status !== "ALL"
            ? (route.query.status as any)
            : undefined,
      }),
    {
      lazy: true,
      watch: [() => route.query],
    },
  );

  const paginationOptions = computed({
    get: () => ({
      pageIndex: route.query.page ? Number(route.query.page) - 1 : 0,
      pageSize: route.query.limit ? Number(route.query.limit) : 10,
    }),
    set: (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: value.pageIndex + 1,
          limit: value.pageSize,
        },
      });
    },
  });

  function handlePaginationChange(updater: any) {
    if (typeof updater === "function") {
      paginationOptions.value = updater(paginationOptions.value);
    } else {
      paginationOptions.value = {
        ...paginationOptions.value,
        ...updater,
      };
    }
  }

  function applyFilters() {
    navigateTo({
      query: {
        ...route.query,
        from: dateFrom.value || undefined,
        to: dateTo.value || undefined,
        status: statusFilter.value !== "ALL" ? statusFilter.value : undefined,
        page: 1,
      },
    });
  }

  function clearFilters() {
    dateFrom.value = "";
    dateTo.value = "";
    statusFilter.value = "ALL";
    navigateTo({
      query: {
        page: 1,
      },
    });
  }

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

  function openCancelDialog(appointment: AppointmentResponse) {
    selectedAppointment.value = appointment;
    cancelDialogOpen.value = true;
  }

  function openCompleteDialog(appointment: AppointmentResponse) {
    selectedAppointment.value = appointment;
    completeDialogOpen.value = true;
  }

  async function confirmCancel() {
    if (!selectedAppointment.value) return;

    try {
      await appointmentsApi.cancel(selectedAppointment.value.id);
      toast.success("Cita cancelada exitosamente");
      refreshAppointments();
      cancelDialogOpen.value = false;
    } catch (error: any) {
      toast.error(error.data?.message || "Error al cancelar la cita");
    }
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
        <div class="text-sm">{row.getValue("professional")}</div>
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
      cell: ({ row }) => (
        <div class="text-sm">{row.original.appointment_type || "N/A"}</div>
      ),
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
          <div class="flex items-center justify-center gap-2">
            <div class={`h-2 w-2 rounded-full ${badge.class}`} />
            <span class="text-sm">{badge.label}</span>
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
          {row.original.status === "SCHEDULED" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/app/appointments/${row.original.id}/edit`)}
              >
                <Icon name="lucide:pencil" class="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="text-green-600 hover:text-green-700"
                onClick={() => openCompleteDialog(row.original)}
              >
                <Icon name="lucide:check" class="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openCancelDialog(row.original)}
              >
                <Icon name="lucide:x" class="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];
</script>

<style scoped></style>
