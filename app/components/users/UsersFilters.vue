<template>
  <section>
    <h3 class="text-lg font-semibold flex items-center gap-2">
      Filtros
      <Button
        variant="ghost"
        size="sm"
        @click="handleCleanAllFilters"
        :disabled="props.loading"
      >
        <Icon name="lucide:trash-2" class="mr-2" />
        Limpiar todos los filtros
      </Button>
    </h3>

    <fieldset
      class="grid grid-cols-1 md:grid-cols-4 gap-4"
      v-bind="$attrs"
      :disabled="props.loading"
    >
      <div class="space-y-2">
        <Label icon="lucide:user" class="flex gap-1">Nombre</Label>
        <Input
          placeholder="Buscar por nombre"
          @input="(e) => inputHandlers.search(e.target.value)"
          :model-value="$route.query.search || ''"
        />
      </div>
      <div class="space-y-2">
        <Label icon="lucide:shield-check" class="flex gap-1">Rol</Label>
        <Select
          :model-value="
            $route.query.role_id ? Number($route.query.role_id) : null
          "
          @update:model-value="
            ($event) => {
              inputHandlers.role_id($event);
              console.log($event);
            }
          "
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="role in rolesData || []"
              :key="role.id"
              :value="role.id"
            >
              {{ role.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </fieldset>
  </section>
</template>
<script setup>
  import { roleApi } from "~/lib/api/roles";
  import { Button } from "../ui/button";
  import { Label } from "../ui/label";
  import { Input } from "../ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const route = useRoute();

  const { data: rolesData } = await useAsyncData(() => roleApi.list(), {
    lazy: true,
  });

  function createInputHandler(field, options) {
    const updateQuery = (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: 1,
          [field]: value || undefined,
        },
      });
    };

    return options?.debounce ? useDebounceFn(updateQuery, 500) : updateQuery;
  }

  const inputHandlers = {
    role_id: createInputHandler("role_id"),
    is_active: createInputHandler("is_active"),
    search: createInputHandler("search", { debounce: true }),
  };

  function handleCleanAllFilters() {
    navigateTo({
      query: undefined, // Limpia todos los filtros
    });
  }
</script>
<style scoped></style>
