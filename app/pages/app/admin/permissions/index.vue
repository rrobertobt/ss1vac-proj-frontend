<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Gestión de Permisos</h1>
      <p class="text-muted-foreground mt-2">
        Administra los permisos asignados a cada rol del sistema
      </p>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <Icon
        name="lucide:alert-circle"
        class="h-12 w-12 mx-auto text-destructive mb-4"
      />
      <h2 class="text-2xl font-bold mb-2">Error al cargar roles</h2>
      <p class="text-muted-foreground mb-4">{{ error }}</p>
      <Button @click="refresh">Reintentar</Button>
    </div>

    <div v-else class="grid gap-4">
      <Card v-for="role in roles" :key="role.id">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>{{ role.label }}</CardTitle>
              <CardDescription class="mt-1">
                {{ role.description }}
              </CardDescription>
            </div>
            <Button
              @click="router.push(`/app/admin/permissions/${role.id}`)"
              size="sm"
            >
              <Icon name="lucide:settings" class="mr-2 h-4 w-4" />
              Gestionar Permisos
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { roleApi, type RoleItemList } from "~/lib/api/roles";

  const router = useRouter();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const roles = ref<RoleItemList[]>([]);

  async function loadRoles() {
    try {
      loading.value = true;
      error.value = null;
      roles.value = await roleApi.list();
    } catch (err: any) {
      error.value = err.data?.message || "Error al cargar los roles";
      console.error("Error loading roles:", err);
    } finally {
      loading.value = false;
    }
  }

  function refresh() {
    loadRoles();
  }

  onMounted(() => {
    loadRoles();
  });
</script>

<style scoped></style>
