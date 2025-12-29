<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <Icon name="lucide:alert-circle" class="h-12 w-12 mx-auto text-destructive mb-4" />
      <h2 class="text-2xl font-bold mb-2">Error al cargar empleado</h2>
      <p class="text-muted-foreground mb-4">{{ error }}</p>
      <Button @click="router.back()">Volver</Button>
    </div>

    <div v-else-if="employee" class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" @click="router.back()">
            <Icon name="lucide:arrow-left" class="h-5 w-5" />
          </Button>
          <div>
            <h1 class="text-3xl font-bold">
              {{ employee.first_name }} {{ employee.last_name }}
            </h1>
          </div>
        </div>
        <Button @click="router.push(`/app/admin/employees/${route.params.id}/edit`)">
          <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <!-- Información del Usuario -->
      <Card>
        <CardHeader>
          <CardTitle>Información de Usuario</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-muted-foreground">Email</Label>
            <p class="font-medium">{{ employee.user?.email || 'N/A' }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Usuario</Label>
            <p class="font-medium">{{ employee.user?.username || 'N/A' }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Rol</Label>
            <p class="font-medium">{{ employee.user?.role?.label || 'N/A' }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Estado</Label>
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                :class="employee.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'"
              />
              <span class="font-medium">
                {{ employee.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información Personal -->
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-muted-foreground">Nombre</Label>
            <p class="font-medium">{{ employee.first_name }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Apellido</Label>
            <p class="font-medium">{{ employee.last_name }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Número de Licencia</Label>
            <p class="font-medium">{{ employee.license_number }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Información Laboral -->
      <Card>
        <CardHeader>
          <CardTitle>Información Laboral</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-muted-foreground">Área</Label>
            <p class="font-medium">{{ employee.area?.name || 'N/A' }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Fecha de Contratación</Label>
            <p class="font-medium">{{ formatDate(employee.hired_at) }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Salario Base</Label>
            <p class="font-medium">Q {{ formatCurrency(employee.base_salary) }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Tarifa por Sesión</Label>
            <p class="font-medium">Q {{ formatCurrency(employee.session_rate) }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Porcentaje IGSS</Label>
            <p class="font-medium">{{ employee.igss_percentage }}%</p>
          </div>
        </CardContent>
      </Card>

      <!-- Especialidades -->
      <Card v-if="employee.specialties && employee.specialties.length > 0">
        <CardHeader>
          <CardTitle>Especialidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="specialty in employee.specialties"
              :key="specialty.id"
              class="px-3 py-1.5 bg-accent rounded-full text-sm font-medium"
            >
              {{ specialty.name }}
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Disponibilidad -->
      <Card v-if="employee.availability && employee.availability.length > 0">
        <CardHeader>
          <CardTitle>Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="(slot, index) in employee.availability"
            :key="index"
            class="p-4 border rounded-lg"
          >
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label class="text-muted-foreground">Día</Label>
                <p class="font-medium">{{ getDayLabel(slot.day_of_week) }}</p>
              </div>
              <div>
                <Label class="text-muted-foreground">Horario</Label>
                <p class="font-medium">
                  {{ slot.start_time }} - {{ slot.end_time }}
                </p>
              </div>
              <div v-if="slot.specialty">
                <Label class="text-muted-foreground">Especialidad</Label>
                <p class="font-medium">{{ slot.specialty.name }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import { Label } from "~/components/ui/label";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { employeesApi } from "~/lib/api/employees";

  const route = useRoute();
  const router = useRouter();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const employee = ref<any>(null);

  onMounted(async () => {
    try {
      loading.value = true;
      const id = Number(route.params.id);
      employee.value = await employeesApi.getById(id);
    } catch (err: any) {
      error.value = err.data?.message || "Error al cargar el empleado";
      console.error("Error loading employee:", err);
    } finally {
      loading.value = false;
    }
  });

  function getEmployeeTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      PSYCHOLOGIST: "Psicólogo/a",
      PSYCHIATRIST: "Psiquiatra",
      TECHNICIAN: "Técnico/a",
      MAINTENANCE: "Mantenimiento",
      ADMIN_STAFF: "Personal Administrativo",
    };
    return labels[type] || type;
  }

  function getDayLabel(day: number): string {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[day] || "";
  }

  function formatDate(date: string): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-GT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
</script>

<style scoped></style>
