<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Gestión de Empleados</h1>
    <Button as-child>
      <NuxtLink to="/app/admin/employees/new">
        Crear Empleado
        <Icon name="lucide:user-plus" class="inline" />
      </NuxtLink>
    </Button>

    <UsersFilters class="mt-2 mb-6" :loading="status === 'pending'" />

    <div class="max-w-6xl mx-auto rounded-lg relative" v-if="users">
      <DataTable
        :columns="columns"
        :data="users?.data"
        :totalElements="users?.meta.total"
        :totalPages="users?.meta.totalPages"
        :paginationState="paginationOptions"
        :enable-sorting="false"
        table-key-name="users-table"
        @pagination-change="
          ($event) => {
            if (typeof $event === 'function') {
              paginationOptions = $event(paginationOptions);
            } else {
              paginationOptions = {
                ...paginationOptions,
                ...$event,
              };
            }
          }
        "
      />
    </div>
  </div>
</template>
<script setup lang="tsx">
  import { Icon } from "#components";
  import type { ColumnDef } from "@tanstack/vue-table";
  import DataTable from "~/components/datatable/DataTable.vue";
  import UsersFilters from "~/components/users/UsersFilters.vue";
  import { employeesApi, type EmployeeItemList } from "~/lib/api/employees";
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";

  const route = useRoute();

  const {
    data: users,
    status,
    error,
    refresh: refreshUsers,
  } = await useAsyncData(
    "admin-employees",
    () => {
      return employeesApi.list({
        page: route.query.page ? Number(route.query.page) : 1,
        role_id: route.query.role_id ? Number(route.query.role_id) : undefined,
        search: route.query.search ? String(route.query.search) : undefined,
      });
    },
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

  const columns: ColumnDef<EmployeeItemList>[] = [
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "fullName",
      meta: {
        displayName: "Nombres",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user" class="inline mr-1 " />
          Nombres
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("fullName")}</div>
      ),
    },
    {
      accessorKey: "user.email",
      meta: {
        displayName: "Correo Electrónico",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:mail" class="inline mr-1 " />
          Correo Electrónico
        </div>
      ),
    },
    {
      accessorKey: "user.role.label",
      meta: {
        displayName: "Rol",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:shield-check" class="inline mr-1 " />
          Rol
        </div>
      ),
    },
    {
      id: "Acciones",
      header: () => <div class="text-center font-semibold">Acciones</div>,
      cell: ({ row }) => (
        <div class="flex gap-2 justify-center">
          <Button asChild size="sm" class="bg-blue-500">
            <NuxtLink
              to={`/app/admin/employees/${row.original.id}`}
            >
              Ver
            </NuxtLink>
          </Button>
          <Button asChild size="sm" variant="destructive">
            <NuxtLink
              to={`/app/admin/employees/${row.original.id}/edit`}
            >
              Editar
            </NuxtLink>
          </Button>
        </div>
      ),
    },
  ];
</script>
<style scoped></style>
