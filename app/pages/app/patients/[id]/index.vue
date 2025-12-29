<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <Icon
        name="lucide:alert-circle"
        class="h-12 w-12 mx-auto text-destructive mb-4"
      />
      <h2 class="text-2xl font-bold mb-2">Error al cargar paciente</h2>
      <p class="text-muted-foreground mb-4">{{ error }}</p>
      <Button @click="router.back()">Volver</Button>
    </div>

    <div v-else-if="patient" class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" @click="router.back()">
            <Icon name="lucide:arrow-left" class="h-5 w-5" />
          </Button>
          <div>
            <h1 class="text-3xl font-bold">
              {{ patient.first_name }} {{ patient.last_name }}
            </h1>
            <p class="text-muted-foreground">Paciente</p>
          </div>
        </div>
        <Button
          @click="
            router.push(`/app/patients/${route.params.id}/edit`)
          "
        >
          <Icon name="lucide:pencil" class="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <!-- Información del Usuario -->
      <Card v-if="patient.user">
        <CardHeader>
          <CardTitle>Acceso al Sistema</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-muted-foreground">Email de Usuario</Label>
            <p class="font-medium">{{ patient.user?.email || "N/A" }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Usuario</Label>
            <p class="font-medium">{{ patient.user?.username || "N/A" }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Rol</Label>
            <p class="font-medium">
              {{ patient.user?.role?.label || "N/A" }}
            </p>
          </div>
          <div>
            <Label class="text-muted-foreground">Estado</Label>
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                :class="
                  patient.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                "
              />
              <span class="font-medium">
                {{ patient.status === "ACTIVE" ? "Activo" : "Inactivo" }}
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
            <p class="font-medium">{{ patient.first_name }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Apellido</Label>
            <p class="font-medium">{{ patient.last_name }}</p>
          </div>
          <div v-if="patient.dob">
            <Label class="text-muted-foreground">Fecha de Nacimiento</Label>
            <p class="font-medium">{{ formatDate(patient.dob) }}</p>
          </div>
          <div v-if="patient.gender">
            <Label class="text-muted-foreground">Género</Label>
            <p class="font-medium">{{ getGenderLabel(patient.gender) }}</p>
          </div>
          <div v-if="patient.marital_status">
            <Label class="text-muted-foreground">Estado Civil</Label>
            <p class="font-medium">
              {{ getMaritalStatusLabel(patient.marital_status) }}
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Información de Contacto -->
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="patient.phone">
            <Label class="text-muted-foreground">Teléfono</Label>
            <p class="font-medium">{{ patient.phone }}</p>
          </div>
          <div v-if="patient.email">
            <Label class="text-muted-foreground">Email Personal</Label>
            <p class="font-medium">{{ patient.email }}</p>
          </div>
          <div v-if="patient.address" class="md:col-span-2">
            <Label class="text-muted-foreground">Dirección</Label>
            <p class="font-medium">{{ patient.address }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Información Profesional/Académica -->
      <Card v-if="patient.occupation || patient.education_level">
        <CardHeader>
          <CardTitle>Información Profesional y Académica</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="patient.occupation">
            <Label class="text-muted-foreground">Ocupación</Label>
            <p class="font-medium">{{ patient.occupation }}</p>
          </div>
          <div v-if="patient.education_level">
            <Label class="text-muted-foreground">Nivel Educativo</Label>
            <p class="font-medium">{{ patient.education_level }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Contacto de Emergencia -->
      <Card
        v-if="
          patient.emergency_contact_name ||
          patient.emergency_contact_phone ||
          patient.emergency_contact_relationship
        "
      >
        <CardHeader>
          <CardTitle>Contacto de Emergencia</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="patient.emergency_contact_name">
            <Label class="text-muted-foreground">Nombre</Label>
            <p class="font-medium">{{ patient.emergency_contact_name }}</p>
          </div>
          <div v-if="patient.emergency_contact_relationship">
            <Label class="text-muted-foreground">Relación</Label>
            <p class="font-medium">
              {{ patient.emergency_contact_relationship }}
            </p>
          </div>
          <div v-if="patient.emergency_contact_phone">
            <Label class="text-muted-foreground">Teléfono</Label>
            <p class="font-medium">{{ patient.emergency_contact_phone }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Información del Sistema -->
      <Card>
        <CardHeader>
          <CardTitle>Información del Registro</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-muted-foreground">Fecha de Registro</Label>
            <p class="font-medium">{{ formatDate(patient.created_at) }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Última Actualización</Label>
            <p class="font-medium">{{ formatDate(patient.updated_at) }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import { Label } from "~/components/ui/label";
  import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
  import { patientsApi } from "~/lib/api/patients";

  const route = useRoute();
  const router = useRouter();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const patient = ref<any>(null);

  onMounted(async () => {
    try {
      loading.value = true;
      const id = Number(route.params.id);
      patient.value = await patientsApi.getById(id);
    } catch (err: any) {
      error.value = err.data?.message || "Error al cargar el paciente";
      console.error("Error loading patient:", err);
    } finally {
      loading.value = false;
    }
  });

  function getGenderLabel(gender: string): string {
    const labels: Record<string, string> = {
      MALE: "Masculino",
      FEMALE: "Femenino",
      OTHER: "Otro",
    };
    return labels[gender] || gender;
  }

  function getMaritalStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      SINGLE: "Soltero/a",
      MARRIED: "Casado/a",
      DIVORCED: "Divorciado/a",
      WIDOWED: "Viudo/a",
      DOMESTIC_PARTNERSHIP: "Unión Libre",
    };
    return labels[status] || status;
  }

  function formatDate(date: string): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
</script>

<style scoped></style>
