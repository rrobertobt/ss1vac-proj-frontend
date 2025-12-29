<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Historias Clínicas</h1>
      <Button as-child>
        <NuxtLink to="/app/clinical-records/create">
          <Icon name="lucide:file-plus" class="mr-2 h-4 w-4" />
          Nueva Historia Clínica
        </NuxtLink>
      </Button>
    </div>

    <!-- Filtros -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-2">
            <Label for="patientId">ID Paciente</Label>
            <Input
              id="patientId"
              v-model.number="filters.patientId"
              type="number"
              placeholder="Filtrar por ID..."
              @input="debouncedSearch"
            />
          </div>
          <div class="space-y-2">
            <Label for="professionalId">ID Profesional</Label>
            <Input
              id="professionalId"
              v-model.number="filters.professionalId"
              type="number"
              placeholder="Filtrar por ID..."
              @input="debouncedSearch"
            />
          </div>
          <div class="space-y-2">
            <Label for="status">Estado</Label>
            <Select v-model="filters.status" @update:model-value="applyFilters">
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="ACTIVE">Activos</SelectItem>
                <SelectItem value="CLOSED">Cerrados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-end">
            <Button variant="outline" @click="clearFilters" class="w-full">
              <Icon name="lucide:x" class="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="rounded-lg relative" v-if="clinicalRecords">
      <DataTable
        :columns="columns"
        :data="clinicalRecords?.data"
        :totalElements="clinicalRecords?.meta.total"
        :totalPages="clinicalRecords?.meta.totalPages"
        :paginationState="paginationOptions"
        :enable-sorting="false"
        table-key-name="clinical-records-table"
        @pagination-change="handlePaginationChange"
      />
    </div>

    <div v-else-if="status === 'pending'" class="flex justify-center py-8">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      Error al cargar las historias clínicas: {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="tsx">
import { Icon } from "#components";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTable from "~/components/datatable/DataTable.vue";
import { getClinicalRecords, type ClinicalRecordResponse } from "~/lib/api/clinical-records";
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
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const route = useRoute();
const router = useRouter();

const filters = ref({
  patientId: route.query.patientId ? Number(route.query.patientId) : undefined,
  professionalId: route.query.professionalId ? Number(route.query.professionalId) : undefined,
  status: route.query.status?.toString() || "ALL",
});

const {
  data: clinicalRecords,
  status,
  error,
  refresh: refreshClinicalRecords,
} = await useAsyncData<PagedResponse<ClinicalRecordResponse>>(
  "clinical-records",
  () =>
    getClinicalRecords({
      page: route.query.page ? Number(route.query.page) : 1,
      limit: route.query.limit ? Number(route.query.limit) : 10,
      patientId: filters.value.patientId,
      professionalId: filters.value.professionalId,
      status: filters.value.status !== "ALL" ? (filters.value.status as "ACTIVE" | "CLOSED") : undefined,
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

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
function debouncedSearch() {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
}

function applyFilters() {
  navigateTo({
    query: {
      patientId: filters.value.patientId || undefined,
      professionalId: filters.value.professionalId || undefined,
      status: filters.value.status !== "ALL" ? filters.value.status : undefined,
      page: 1,
      limit: route.query.limit || 10,
    },
  });
}

function clearFilters() {
  filters.value = {
    patientId: undefined,
    professionalId: undefined,
    status: "ALL",
  };
  navigateTo({
    query: {
      page: 1,
      limit: 10,
    },
  });
}

const columns: ColumnDef<ClinicalRecordResponse>[] = [
  {
    accessorKey: "record_number",
    meta: {
      displayName: "Número de Historia",
    },
    header: () => (
      <div class="text-center font-semibold">
        <Icon name="lucide:file-text" class="inline mr-1 mb-0.5" />
        Número
      </div>
    ),
    cell: ({ row }) => (
      <div class="text-sm font-mono">{row.original.record_number || "N/A"}</div>
    ),
  },
  {
    accessorFn: (row) => row.patient ? `${row.patient.first_name} ${row.patient.last_name}` : "N/A",
    id: "patientName",
    meta: {
      displayName: "Paciente",
    },
    header: () => (
      <div class="text-center font-semibold">
        <Icon name="lucide:user" class="inline mr-1 mb-0.5" />
        Paciente
      </div>
    ),
    cell: ({ row }) => (
      <div class="text-sm">
        {row.original.patient 
          ? `${row.original.patient.first_name} ${row.original.patient.last_name}` 
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "service",
    meta: {
      displayName: "Servicio",
    },
    header: () => (
      <div class="text-center font-semibold">
        <Icon name="lucide:briefcase" class="inline mr-1 mb-0.5" />
        Servicio
      </div>
    ),
    cell: ({ row }) => (
      <div class="text-sm">{row.original.service || "N/A"}</div>
    ),
  },
  {
    accessorFn: (row) => row.responsible_employee 
      ? `${row.responsible_employee.first_name} ${row.responsible_employee.last_name}` 
      : "N/A",
    id: "responsibleName",
    meta: {
      displayName: "Profesional Responsable",
    },
    header: () => (
      <div class="text-center font-semibold">
        <Icon name="lucide:user-check" class="inline mr-1 mb-0.5" />
        Profesional
      </div>
    ),
    cell: ({ row }) => (
      <div class="text-sm">
        {row.original.responsible_employee 
          ? `${row.original.responsible_employee.first_name} ${row.original.responsible_employee.last_name}` 
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "opening_date",
    meta: {
      displayName: "Fecha de Apertura",
    },
    header: () => (
      <div class="text-center font-semibold">
        <Icon name="lucide:calendar" class="inline mr-1 mb-0.5" />
        Fecha
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.opening_date;
      return (
        <div class="text-sm">
          {date ? new Date(date).toLocaleDateString("es-GT") : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    meta: {
      displayName: "Estado",
    },
    header: () => (
      <div class="text-center font-semibold">
        <Icon name="lucide:activity" class="inline mr-1 mb-0.5" />
        Estado
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div class="flex justify-center">
          <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
            {status === "ACTIVE" ? "Activa" : "Cerrada"}
          </Badge>
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
      const record = row.original;
      return (
        <div class="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Icon name="lucide:more-horizontal" class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <NuxtLink to={`/app/clinical-records/${record.id}`}>
                  <Icon name="lucide:eye" class="mr-2 h-4 w-4" />
                  Ver detalles
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NuxtLink to={`/app/clinical-records/edit/${record.id}`}>
                  <Icon name="lucide:edit" class="mr-2 h-4 w-4" />
                  Editar
                </NuxtLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
</script>
