<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Gestión de Pacientes</h1>
      <Button as-child>
        <NuxtLink to="/app/patients/new">
          <Icon name="lucide:user-plus" class="mr-2 h-4 w-4" />
          Crear Paciente
        </NuxtLink>
      </Button>
    </div>

    <!-- Filtros -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label for="search">Buscar</Label>
            <Input
              id="search"
              v-model="searchQuery"
              placeholder="Nombre, email o teléfono..."
              @input="debouncedSearch"
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
                <SelectItem value="ACTIVE">Activos</SelectItem>
                <SelectItem value="INACTIVE">Inactivos</SelectItem>
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

    <div class="rounded-lg relative" v-if="patients">
      <DataTable
        :columns="columns"
        :data="patients?.data"
        :totalElements="patients?.meta.total"
        :totalPages="patients?.meta.totalPages"
        :paginationState="paginationOptions"
        :enable-sorting="false"
        table-key-name="patients-table"
        @pagination-change="handlePaginationChange"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
  import { Icon } from "#components";
  import type { ColumnDef } from "@tanstack/vue-table";
  import DataTable from "~/components/datatable/DataTable.vue";
  import { patientsApi, type PatientItemList } from "~/lib/api/patients";
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

  const route = useRoute();
  const router = useRouter();

  const searchQuery = ref(route.query.search?.toString() || "");
  const statusFilter = ref(route.query.status?.toString() || "ALL");

  const {
    data: patients,
    status,
    error,
    refresh: refreshPatients,
  } = await useAsyncData<PagedResponse<PatientItemList>>(
    "admin-patients",
    () =>
      patientsApi.list({
        page: route.query.page ? Number(route.query.page) : 1,
        search: route.query.search ? String(route.query.search) : undefined,
        status:
          route.query.status && route.query.status !== "ALL"
            ? (route.query.status as "ACTIVE" | "INACTIVE")
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
        ...route.query,
        search: searchQuery.value || undefined,
        status: statusFilter.value !== "ALL" ? statusFilter.value : undefined,
        page: 1,
      },
    });
  }

  function clearFilters() {
    searchQuery.value = "";
    statusFilter.value = "ALL";
    navigateTo({
      query: {
        page: 1,
      },
    });
  }

  const columns: ColumnDef<PatientItemList>[] = [
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "fullName",
      meta: {
        displayName: "Nombre Completo",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user" class="inline mr-1 mb-0.5" />
          Nombre
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("fullName")}</div>
      ),
    },
    {
      accessorKey: "email",
      meta: {
        displayName: "Email",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:mail" class="inline mr-1 mb-0.5" />
          Email
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-sm">{row.original.email || "N/A"}</div>
      ),
    },
    {
      accessorKey: "phone",
      meta: {
        displayName: "Teléfono",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:phone" class="inline mr-1 mb-0.5" />
          Teléfono
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-sm">{row.original.phone || "N/A"}</div>
      ),
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
      cell: ({ row }) => (
        <div class="flex items-center justify-center gap-2">
          <div
            class={{
              "h-2 w-2 rounded-full": true,
              "bg-green-500": row.original.status === "ACTIVE",
              "bg-red-500": row.original.status === "INACTIVE",
            }}
          />
          <span class="text-sm">
            {row.original.status === "ACTIVE" ? "Activo" : "Inactivo"}
          </span>
        </div>
      ),
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
            <NuxtLink to={`/app/patients/${row.original.id}`}>
              <Icon name="lucide:eye" class="h-4 w-4" />
            </NuxtLink>
          </Button>
          <Button asChild size="sm">
            <NuxtLink to={`/app/patients/${row.original.id}/edit`}>
              <Icon name="lucide:pencil" class="h-4 w-4" />
            </NuxtLink>
          </Button>
        </div>
      ),
    },
  ];
</script>

<style scoped></style>
