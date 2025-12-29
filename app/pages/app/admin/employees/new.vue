<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="router.back()">
        <Icon name="lucide:arrow-left" class="h-5 w-5" />
      </Button>
      <div>
        <h1 class="text-3xl font-bold">Nuevo Empleado</h1>
        <p class="text-muted-foreground">
          Completa el formulario para registrar un nuevo empleado
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información del Usuario -->
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
                required
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
                required
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

      <!-- Información Personal -->
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
                required
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
                required
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
                required
                :disabled="loading"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información Laboral -->
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
                required
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
                required
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
                required
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
                required
                :disabled="loading"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Especialidades -->
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

      <!-- Disponibilidad -->
      <Card>
        <CardHeader>
          <CardTitle>Disponibilidad</CardTitle>
          <CardDescription>
            Configura los horarios de disponibilidad del empleado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilitySchedule
            v-model="form.availability "
            :specialties="specialties"
          />
        </CardContent>
      </Card>

      <!-- Acciones -->
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
          {{ loading ? "Guardando..." : "Guardar Empleado" }}
        </Button>
      </div>
    </form>
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
    type CreateEmployeeRequest,
    type EmployeeAvailability,
  } from "~/lib/api/employees";
  import { roleApi, type RoleItemList } from "~/lib/api/roles";
  import { areasApi } from "~/lib/api/areas";
  import { specialtiesApi } from "~/lib/api/specialties";

  const router = useRouter();
  const loading = ref(false);

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
  const form = reactive<CreateEmployeeRequest>({
    email: "",
    username: "",
    role_id: 0,
    first_name: "",
    last_name: "",
    license_number: "",
    area_id: 0,
    base_salary: 0,
    session_rate: 0,
    igss_percentage: 12.67,
    hired_at: new Date().toISOString().split("T")[0],
    specialty_ids: [],
    availability: [],
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
    // Validaciones básicas
    if (!form.email || !form.username || !form.role_id) {
      toast.error("Por favor completa todos los campos de usuario");
      return;
    }

    if (!form.first_name || !form.last_name) {
      toast.error("Por favor completa todos los campos personales");
      return;
    }

    if (!form.license_number || !form.area_id || !form.hired_at) {
      toast.error("Por favor completa todos los campos laborales");
      return;
    }

    if (
      form.base_salary <= 0 ||
      form.session_rate < 0 ||
      form.igss_percentage < 0 ||
      form.igss_percentage > 100
    ) {
      toast.error("Por favor verifica los montos y porcentajes");
      return;
    }

    loading.value = true;

    try {
      // Limpiar specialty_ids si está vacío
      const dataToSend = {
        ...form,
        role_id: Number(form.role_id),
        specialty_ids:
          form.specialty_ids && form.specialty_ids.length > 0
            ? form.specialty_ids
            : [],
        availability:
          form.availability && form.availability.length > 0
            ? form.availability
            : [],
      };

      console.log("Datos a enviar:", dataToSend);
      await employeesApi.create(dataToSend);
      toast.success("Empleado creado exitosamente");  

      // Redirigir a la lista de empleados
      // setTimeout(() => {
      //   router.push("/app/admin/employees");
      // }, 1000);
    } catch (error: any) {
      console.error("Error al crear empleado:", error);
      toast.error(
        error.data?.message ||
          error.message ||
          "Error al crear el empleado",
      );
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped></style>