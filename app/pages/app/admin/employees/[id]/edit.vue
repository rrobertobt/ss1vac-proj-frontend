<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loadingData" class="flex justify-center items-center min-h-[400px]">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="errorLoading" class="text-center py-12">
      <Icon name="lucide:alert-circle" class="h-12 w-12 mx-auto text-destructive mb-4" />
      <h2 class="text-2xl font-bold mb-2">Error al cargar empleado</h2>
      <p class="text-muted-foreground mb-4">{{ errorLoading }}</p>
      <Button @click="router.back()">Volver</Button>
    </div>

    <div v-else>
      <div class="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.back()">
          <Icon name="lucide:arrow-left" class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-3xl font-bold">Editar Empleado</h1>
          <p class="text-muted-foreground">
            Actualiza la información del empleado
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de Usuario</CardTitle>
            <CardDescription>
              Credenciales y rol del empleado en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="email">Email *</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="empleado@example.com"
                  :disabled="loading"
                />
              </div>

              <div class="space-y-2">
                <Label for="username">Usuario *</Label>
                <Input
                  id="username"
                  v-model="form.username"
                  type="text"
                  placeholder="usuario.empleado"
                  :disabled="loading"
                />
              </div>

              <div class="space-y-2">
                <Label for="role">Rol *</Label>
                <Select
                  :model-value="form.role_id?.toString()"
                  @update:model-value="(value) => (form.role_id = Number(value))"
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="role in roles"
                      :key="role.id"
                      :value="role.id.toString()"
                    >
                      {{ role.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Datos personales del empleado</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  v-model="form.first_name"
                  type="text"
                  placeholder="María"
                  :disabled="loading"
                />
              </div>

              <div class="space-y-2">
                <Label for="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  v-model="form.last_name"
                  type="text"
                  placeholder="López"
                  :disabled="loading"
                />
              </div>

              <div class="space-y-2">
                <Label for="licenseNumber">Número de Licencia *</Label>
                <Input
                  id="licenseNumber"
                  v-model="form.license_number"
                  type="text"
                  placeholder="PSI-12345"
                  :disabled="loading"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Laboral</CardTitle>
            <CardDescription>
              Detalles del puesto y compensación
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="area">Área *</Label>
                <Select
                  :model-value="form.area_id?.toString()"
                  @update:model-value="(value) => (form.area_id = Number(value))"
                >
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Selecciona un área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="area in areas"
                      :key="area.id"
                      :value="area.id.toString()"
                    >
                      {{ area.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="hiredAt">Fecha de Contratación *</Label>
                <Input
                  id="hiredAt"
                  v-model="form.hired_at"
                  type="date"
                  :disabled="loading"
                />
              </div>

              <div class="space-y-2">
                <Label for="baseSalary">Salario Base (Q) *</Label>
                <Input
                  id="baseSalary"
                  v-model.number="form.base_salary"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="5000.00"
                  :disabled="loading"
                />
              </div>

              <div class="space-y-2">
                <Label for="sessionRate">Tarifa por Sesión (Q) *</Label>
                <Input
                  id="sessionRate"
                  v-model.number="form.session_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="250.00"
                  :disabled="loading"
                />
              </div>

              <div class="space-y-2">
                <Label for="igssPercentage">Porcentaje IGSS (%) *</Label>
                <Input
                  id="igssPercentage"
                  v-model.number="form.igss_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="12.67"
                  :disabled="loading"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Especialidades</CardTitle>
            <CardDescription>
              Selecciona las especialidades del empleado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <Label>Especialidades</Label>
              <div
                class="grid grid-cols-2 md:grid-cols-3 gap-3"
                v-if="specialties && specialties.length > 0"
              >
                <label
                  v-for="specialty in specialties"
                  :key="specialty.id"
                  class="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  :class="{
                    'bg-accent border-primary':
                      form.specialty_ids?.includes(specialty.id),
                  }"
                >
                  <input
                    type="checkbox"
                    :value="specialty.id"
                    :checked="form.specialty_ids?.includes(specialty.id)"
                    @change="toggleSpecialty(specialty.id)"
                    class="rounded"
                    :disabled="loading"
                  />
                  <span class="text-sm">{{ specialty.name }}</span>
                </label>
              </div>
              <p v-else class="text-sm text-muted-foreground">
                No hay especialidades disponibles
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disponibilidad</CardTitle>
            <CardDescription>
              Configura los horarios de disponibilidad del empleado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailabilitySchedule
              v-model="form.availability"
              :specialties="specialties"
            />
          </CardContent>
        </Card>

        <div class="flex justify-end gap-4">
          <Button type="button" variant="outline" @click="router.back()">
            Cancelar
          </Button>
          <Button type="submit" :disabled="loading">
            <Icon
              v-if="loading"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <Icon v-else name="lucide:save" class="mr-2 h-4 w-4" />
            {{ loading ? "Guardando..." : "Guardar Cambios" }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import { Input } from "~/components/ui/input";
  import { Label } from "~/components/ui/label";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
  import AvailabilitySchedule from "~/components/AvailabilitySchedule.vue";
  import { toast } from "vue-sonner";
  import {
    employeesApi,
    type EmployeeAvailability,
  } from "~/lib/api/employees";
  import { roleApi, type RoleItemList } from "~/lib/api/roles";
  import { areasApi } from "~/lib/api/areas";
  import { specialtiesApi } from "~/lib/api/specialties";

  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const loadingData = ref(true);
  const errorLoading = ref<string | null>(null);

  // Cargar datos de catálogos
  const { data: roles } = await useAsyncData<RoleItemList[]>(
    "roles",
    () => roleApi.list(),
    { lazy: true },
  );

  const { data: areas } = await useAsyncData<
    Array<{ id: number; name: string; description: string }>
  >("areas", () => areasApi.list(), { lazy: true });

  const { data: specialties } = await useAsyncData<
    Array<{ id: number; name: string; description: string }>
  >("specialties", () => specialtiesApi.list(), { lazy: true });

  // Formulario
  const form = reactive<{
    email?: string;
    username?: string;
    role_id?: number;
    first_name?: string;
    last_name?: string;
    license_number?: string;
    area_id?: number;
    base_salary?: number;
    session_rate?: number;
    igss_percentage?: number;
    hired_at?: string;
    specialty_ids?: number[];
    availability?: EmployeeAvailability[];
  }>({
    email: "",
    username: "",
    role_id: undefined,
    first_name: "",
    last_name: "",
    license_number: "",
    area_id: undefined,
    base_salary: 0,
    session_rate: 0,
    igss_percentage: 12.67,
    hired_at: "",
    specialty_ids: [],
    availability: [],
  });

  // Cargar datos del empleado
  onMounted(async () => {
    try {
      loadingData.value = true;
      const id = Number(route.params.id);
      const employee = await employeesApi.getById(id);

      // Llenar el formulario con los datos existentes
      form.email = employee.user?.email || "";
      form.username = employee.user?.username || "";
      form.role_id = employee.user?.role_id;
      form.first_name = employee.first_name;
      form.last_name = employee.last_name;
      form.license_number = employee.license_number;
      form.area_id = employee.area_id;
      form.base_salary = employee.base_salary;
      form.session_rate = employee.session_rate;
      form.igss_percentage = employee.igss_percentage;
      form.hired_at = employee.hired_at?.split("T")[0]; // Solo la fecha
      form.specialty_ids = employee.specialties?.map((s: any) => s.id) || [];
      form.availability = employee.availability?.map((a: any) => {
        return {
        day_of_week: a.day_of_week,
        start_time: a.start_time?.substring(0, 5) || a.start_time,
        end_time: a.end_time?.substring(0, 5) || a.end_time,
        specialty_id: a.specialty_id,
      };
      }) || [];
    } catch (err: any) {
      errorLoading.value = err.data?.message || "Error al cargar el empleado";
      console.error("Error loading employee:", err);
    } finally {
      loadingData.value = false;
    }
  });

  function toggleSpecialty(specialtyId: number) {
    if (!form.specialty_ids) {
      form.specialty_ids = [];
    }

    const index = form.specialty_ids.indexOf(specialtyId);
    if (index > -1) {
      form.specialty_ids.splice(index, 1);
    } else {
      form.specialty_ids.push(specialtyId);
    }
  }

  async function handleSubmit() {
    // Validaciones básicas (solo campos que se van a actualizar)
    const hasChanges = Object.values(form).some(
      (value) => value !== undefined && value !== null && value !== "",
    );

    if (!hasChanges) {
      toast.error("No hay cambios para guardar");
      return;
    }

    loading.value = true;

    try {
      const id = Number(route.params.id);

      // Preparar datos: solo enviar campos que tienen valores
      const dataToSend: any = {};

      if (form.email) dataToSend.email = form.email;
      if (form.username) dataToSend.username = form.username;
      if (form.role_id) dataToSend.role_id = Number(form.role_id);
      if (form.first_name) dataToSend.first_name = form.first_name;
      if (form.last_name) dataToSend.last_name = form.last_name;
      if (form.license_number) dataToSend.license_number = form.license_number;
      if (form.area_id) dataToSend.area_id = Number(form.area_id);
      if (form.base_salary !== undefined)
        dataToSend.base_salary = form.base_salary;
      if (form.session_rate !== undefined)
        dataToSend.session_rate = form.session_rate;
      if (form.igss_percentage !== undefined)
        dataToSend.igss_percentage = form.igss_percentage;
      if (form.hired_at) dataToSend.hired_at = form.hired_at;

      // Especialidades y disponibilidad
      dataToSend.specialty_ids = form.specialty_ids || [];
      dataToSend.availability = form.availability || [];

      await employeesApi.update(id, dataToSend);
      toast.success("Empleado actualizado exitosamente");

      // Redirigir a la vista de detalle
      setTimeout(() => {
        router.push(`/app/admin/employees/${id}`);
      }, 1000);
    } catch (error: any) {
      console.error("Error al actualizar empleado:", error);
      toast.error(
        error.data?.message || error.message || "Error al actualizar el empleado",
      );
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped></style>
