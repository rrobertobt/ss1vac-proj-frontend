<template>
  <div class="max-w-5xl mx-auto">
    <div v-if="loadingData" class="flex justify-center items-center min-h-[400px]">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="errorLoading" class="text-center py-12">
      <Icon
        name="lucide:alert-circle"
        class="h-12 w-12 mx-auto text-destructive mb-4"
      />
      <h2 class="text-2xl font-bold mb-2">Error al cargar datos</h2>
      <p class="text-muted-foreground mb-4">{{ errorLoading }}</p>
      <Button @click="router.back()">Volver</Button>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.back()">
          <Icon name="lucide:arrow-left" class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-3xl font-bold">{{ roleInfo?.label }}</h1>
          <p class="text-muted-foreground">{{ roleInfo?.description }}</p>
        </div>
      </div>

      <!-- Formulario de Permisos -->
      <Card>
        <CardHeader>
          <CardTitle>Permisos Asignados</CardTitle>
          <CardDescription>
            Selecciona los permisos que deseas asignar a este rol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Búsqueda -->
          <div class="mb-6">
            <Label for="search">Buscar permisos</Label>
            <Input
              id="search"
              v-model="searchQuery"
              placeholder="Buscar por código o descripción..."
              class="mt-2"
            />
          </div>

          <!-- Lista de Permisos por Categoría -->
          <div class="space-y-6">
            <div
              v-for="(perms, category) in groupedPermissions"
              :key="category"
            >
              <div class="mb-3">
                <h3 class="text-lg font-semibold">{{ category }}</h3>
                <Separator class="mt-2" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  v-for="permission in perms"
                  :key="permission.id"
                  class="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  :class="{
                    'bg-accent border-primary':
                      selectedPermissions.includes(permission.id),
                  }"
                >
                  <input
                    type="checkbox"
                    :value="permission.id"
                    :checked="selectedPermissions.includes(permission.id)"
                    @change="togglePermission(permission.id)"
                    class="mt-1 rounded"
                    :disabled="loading"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-sm">
                      {{ permission.code }}
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {{ permission.description }}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div v-if="Object.keys(groupedPermissions).length === 0" class="text-center py-8 text-muted-foreground">
              No se encontraron permisos que coincidan con la búsqueda
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Resumen -->
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">
                Permisos seleccionados
              </p>
              <p class="text-2xl font-bold">
                {{ selectedPermissions.length }} / {{ allPermissions.length }}
              </p>
            </div>
            <div class="flex gap-2">
              <Button
                variant="outline"
                @click="selectAll"
                :disabled="loading"
              >
                Seleccionar Todos
              </Button>
              <Button
                variant="outline"
                @click="clearAll"
                :disabled="loading"
              >
                Limpiar Todos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Acciones -->
      <div class="flex justify-end gap-4">
        <Button type="button" variant="outline" @click="router.back()">
          Cancelar
        </Button>
        <Button @click="handleSave" :disabled="loading || !hasChanges">
          <Icon
            v-if="loading"
            name="lucide:loader-2"
            class="mr-2 h-4 w-4 animate-spin"
          />
          <Icon v-else name="lucide:save" class="mr-2 h-4 w-4" />
          {{ loading ? "Guardando..." : "Guardar Cambios" }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import { Input } from "~/components/ui/input";
  import { Label } from "~/components/ui/label";
  import { Separator } from "~/components/ui/separator";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { toast } from "vue-sonner";
  import { roleApi, type Permission } from "~/lib/api/roles";
  import { permissionsApi } from "~/lib/api/permissions";

  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const loadingData = ref(true);
  const errorLoading = ref<string | null>(null);

  const roleInfo = ref<{ label: string; description: string } | null>(null);
  const allPermissions = ref<Permission[]>([]);
  const selectedPermissions = ref<number[]>([]);
  const initialPermissions = ref<number[]>([]);
  const searchQuery = ref("");

  // Computed: Permisos filtrados por búsqueda
  const filteredPermissions = computed(() => {
    if (!searchQuery.value) return allPermissions.value;

    const query = searchQuery.value.toLowerCase();
    return allPermissions.value.filter(
      (p) =>
        p.code.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    );
  });

  // Computed: Agrupar permisos por categoría
  const groupedPermissions = computed(() => {
    const groups: Record<string, Permission[]> = {};

    filteredPermissions.value.forEach((permission) => {
      // Extraer categoría del código (ej: VIEW_PATIENTS -> PATIENTS)
      const parts = permission.code.split("_");
      let category = "General";

      if (parts.length > 1) {
        // Tomar la última palabra como categoría
        const lastPart = parts[parts.length - 1];
        category = getCategoryName(lastPart);
      }

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  });

  // Computed: Verificar si hay cambios
  const hasChanges = computed(() => {
    if (selectedPermissions.value.length !== initialPermissions.value.length) {
      return true;
    }
    return !selectedPermissions.value.every((id) =>
      initialPermissions.value.includes(id),
    );
  });

  function getCategoryName(code: string): string {
    const categories: Record<string, string> = {
      ROLES: "Administración de Roles",
      PERMISSIONS: "Permisos",
      USERS: "Usuarios",
      EMPLOYEES: "Empleados",
      AREAS: "Áreas",
      SPECIALTIES: "Especialidades",
      PATIENTS: "Pacientes",
      RECORDS: "Historia Clínica",
      NOTES: "Notas Confidenciales",
      SESSIONS: "Sesiones",
      TASKS: "Tareas",
      ALERTS: "Alertas",
      APPOINTMENTS: "Citas",
      INVENTORY: "Inventario",
      PRESCRIPTIONS: "Prescripciones",
      MEDICATION: "Medicación",
      INVOICES: "Facturas",
      PAYMENTS: "Pagos",
      RECEIVABLE: "Cuentas por Cobrar",
      PAYROLL: "Nómina",
      REPORTS: "Reportes",
      LOGS: "Auditoría",
    };

    return categories[code] || code;
  }

  function togglePermission(permissionId: number) {
    const index = selectedPermissions.value.indexOf(permissionId);
    if (index > -1) {
      selectedPermissions.value.splice(index, 1);
    } else {
      selectedPermissions.value.push(permissionId);
    }
  }

  function selectAll() {
    selectedPermissions.value = allPermissions.value.map((p) => p.id);
  }

  function clearAll() {
    selectedPermissions.value = [];
  }

  async function handleSave() {
    if (!hasChanges.value) {
      toast.info("No hay cambios para guardar");
      return;
    }

    loading.value = true;

    try {
      const roleId = Number(route.params.id);
      await roleApi.updatePermissions(roleId, {
        permission_ids: selectedPermissions.value,
      });

      toast.success("Permisos actualizados exitosamente");
      initialPermissions.value = [...selectedPermissions.value];

      // Redirigir después de un momento
      setTimeout(() => {
        router.push("/app/admin/permissions");
      }, 1000);
    } catch (error: any) {
      console.error("Error al actualizar permisos:", error);
      toast.error(
        error.data?.message ||
          error.message ||
          "Error al actualizar los permisos",
      );
    } finally {
      loading.value = false;
    }
  }

  // Cargar datos iniciales
  onMounted(async () => {
    try {
      loadingData.value = true;
      const roleId = Number(route.params.id);

      // Cargar en paralelo todos los datos necesarios
      const [rolePermissions, permissions] = await Promise.all([
        roleApi.getPermissions(roleId),
        permissionsApi.list(),
      ]);

      roleInfo.value = {
        label: rolePermissions.role.label,
        description: rolePermissions.role.description,
      };
      allPermissions.value = permissions;
      selectedPermissions.value = rolePermissions.permissions.map((p) => p.id);
      initialPermissions.value = [...selectedPermissions.value];
    } catch (err: any) {
      errorLoading.value = err.data?.message || "Error al cargar los datos";
      console.error("Error loading data:", err);
    } finally {
      loadingData.value = false;
    }
  });
</script>

<style scoped></style>
