<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
    <div
      class="max-w-6xl mx-auto rounded-lg relative"
      v-if="users"
    >
      <DataTable
        :columns="columns"
        :data="users?.data"
        :totalElements="users?.meta.total"
        :totalPages="users?.meta.totalPages"
        :paginationState="paginationOptions"
        :enable-sorting="false"
        table-key-name="inscriptions-table"
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
import type { ColumnDef } from '@tanstack/vue-table';
import DataTable from "~/components/datatable/DataTable.vue";
import type { PagedResponse } from '~/lib/api/base';
import { usersApi, type UserItemList } from '~/lib/api/users';

  const route = useRoute();

  const {
    data: users,
    status,
    error,
    refresh: refreshUsers,
  } = await useAsyncData<PagedResponse<UserItemList>>(
    "admin-users",
    () => usersApi.list({
      page: route.query.page ? Number(route.query.page) : 1,
      // All filters from the query
      role_id: route.query.role_id ? Number(route.query.role_id) : undefined,
      is_active:
        route.query.is_active !== undefined
          ? route.query.is_active === "true"
          : undefined,
      search: route.query.search ? String(route.query.search) : undefined,
    }),
    {
      lazy: true,
      watch: [() => route.query],
    },
  );

  const paginationOptions = computed({
    get: () => ({
      // Convert from 1-based (API) to 0-based (TanStack Table)
      pageIndex: route.query.page ? Number(route.query.page) - 1 : 0,
      pageSize: route.query.limit ? Number(route.query.limit) : 10,
    }),
    set: (value) => {
      navigateTo({
        query: {
          ...route.query,
          // Convert from 0-based (TanStack Table) to 1-based (API)
          page: value.pageIndex + 1,
          limit: value.pageSize,
        },
      });
    },
  });

  const columns: ColumnDef<UserItemList>[] = [
    {
      accessorFn: (row) => {
        return row.employee ? `${row.employee.first_name} ${row.employee.last_name}` : row.patient ? `${row.patient.first_name} ${row.patient.last_name}` : "N/A";
      },
      id: "fullName",
      meta: {
        displayName: "Nombres",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user" class="inline mr-1 mb-0.5" />
          Nombres
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("fullName")}</div>
      ),
    },
  ]
</script>
<style scoped></style>
