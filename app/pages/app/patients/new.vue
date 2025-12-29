<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="router.back()">
        <Icon name="lucide:arrow-left" class="h-5 w-5" />
      </Button>
      <div>
        <h1 class="text-3xl font-bold">Nuevo Paciente</h1>
        <p class="text-muted-foreground">
          Completa el formulario para registrar un nuevo paciente
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información del Usuario (Opcional) -->
      <Card>
        <CardHeader>
          <CardTitle>Acceso al Sistema (Opcional)</CardTitle>
          <CardDescription>
            Si deseas que el paciente tenga acceso al portal, completa estos
            campos
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="email">Email de Usuario</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="paciente@example.com"
                :disabled="loading"
              />
              <p class="text-xs text-muted-foreground">
                Se generará una contraseña y se enviará por correo
              </p>
            </div>

            <div class="space-y-2">
              <Label for="username">Usuario</Label>
              <Input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="usuario.paciente"
                :disabled="loading"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información Personal -->
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Datos personales del paciente</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">Nombre *</Label>
              <Input
                id="firstName"
                v-model="form.first_name"
                type="text"
                placeholder="Juan"
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
                placeholder="Pérez"
                required
                :disabled="loading"
              />
            </div>

            <div class="space-y-2">
              <Label for="dob">Fecha de Nacimiento</Label>
              <Input
                id="dob"
                v-model="form.dob"
                type="date"
                :max="new Date().toISOString().split('T')[0]"
                :disabled="loading"
              />
            </div>

            <div class="space-y-2">
              <Label for="gender">Género</Label>
              <Select
                :model-value="form.gender"
                @update:model-value="(value) => (form.gender = value)"
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Selecciona género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Masculino</SelectItem>
                  <SelectItem value="FEMALE">Femenino</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="maritalStatus">Estado Civil</Label>
              <Select
                :model-value="form.marital_status"
                @update:model-value="(value) => (form.marital_status = value)"
              >
                <SelectTrigger id="maritalStatus">
                  <SelectValue placeholder="Selecciona estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Soltero/a</SelectItem>
                  <SelectItem value="MARRIED">Casado/a</SelectItem>
                  <SelectItem value="DIVORCED">Divorciado/a</SelectItem>
                  <SelectItem value="WIDOWED">Viudo/a</SelectItem>
                  <SelectItem value="DOMESTIC_PARTNERSHIP"
                    >Unión Libre</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información de Contacto -->
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
          <CardDescription>
            Datos de contacto y ubicación del paciente
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="phone">Teléfono</Label>
              <Input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+502 5555-1234"
                :disabled="loading"
              />
            </div>

            <div class="space-y-2">
              <Label for="patientEmail">Email Personal</Label>
              <Input
                id="patientEmail"
                v-model="form.patient_email"
                type="email"
                placeholder="contacto@example.com"
                :disabled="loading"
              />
              <p class="text-xs text-muted-foreground">
                Email personal (diferente al de acceso)
              </p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="address">Dirección</Label>
              <Textarea
                id="address"
                v-model="form.address"
                placeholder="Zona 10, Ciudad de Guatemala"
                :disabled="loading"
                rows="2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información Profesional/Académica -->
      <Card>
        <CardHeader>
          <CardTitle>Información Profesional y Académica</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="occupation">Ocupación</Label>
              <Input
                id="occupation"
                v-model="form.occupation"
                type="text"
                placeholder="Ingeniero, Estudiante, etc."
                :disabled="loading"
              />
            </div>

            <div class="space-y-2">
              <Label for="educationLevel">Nivel Educativo</Label>
              <Input
                id="educationLevel"
                v-model="form.education_level"
                type="text"
                placeholder="Universitario, Bachillerato, etc."
                :disabled="loading"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Contacto de Emergencia -->
      <Card>
        <CardHeader>
          <CardTitle>Contacto de Emergencia</CardTitle>
          <CardDescription>
            Información de la persona a contactar en caso de emergencia
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="emergencyContactName">Nombre</Label>
              <Input
                id="emergencyContactName"
                v-model="form.emergency_contact_name"
                type="text"
                placeholder="María Pérez"
                :disabled="loading"
              />
            </div>

            <div class="space-y-2">
              <Label for="emergencyContactRelationship">Relación</Label>
              <Input
                id="emergencyContactRelationship"
                v-model="form.emergency_contact_relationship"
                type="text"
                placeholder="Madre, Esposo/a, etc."
                :disabled="loading"
              />
            </div>

            <div class="space-y-2">
              <Label for="emergencyContactPhone">Teléfono</Label>
              <Input
                id="emergencyContactPhone"
                v-model="form.emergency_contact_phone"
                type="tel"
                placeholder="+502 5555-5678"
                :disabled="loading"
              />
            </div>
          </div>
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
          {{ loading ? "Guardando..." : "Guardar Paciente" }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import { Input } from "~/components/ui/input";
  import { Label } from "~/components/ui/label";
  import { Textarea } from "~/components/ui/textarea";
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
  import { toast } from "vue-sonner";
  import {
    patientsApi,
    type CreatePatientRequest,
  } from "~/lib/api/patients";

  const router = useRouter();
  const loading = ref(false);

  const form = reactive<CreatePatientRequest>({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    dob: "",
    gender: undefined,
    marital_status: undefined,
    occupation: "",
    education_level: "",
    address: "",
    phone: "",
    patient_email: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
  });

  async function handleSubmit() {
    // Validaciones básicas
    if (!form.first_name || !form.last_name) {
      toast.error("El nombre y apellido son obligatorios");
      return;
    }

    loading.value = true;

    try {
      // Limpiar campos vacíos
      const dataToSend: CreatePatientRequest = {
        first_name: form.first_name,
        last_name: form.last_name,
      };

      if (form.email) dataToSend.email = form.email;
      if (form.username) dataToSend.username = form.username;
      if (form.dob) dataToSend.dob = form.dob;
      if (form.gender) dataToSend.gender = form.gender;
      if (form.marital_status) dataToSend.marital_status = form.marital_status;
      if (form.occupation) dataToSend.occupation = form.occupation;
      if (form.education_level)
        dataToSend.education_level = form.education_level;
      if (form.address) dataToSend.address = form.address;
      if (form.phone) dataToSend.phone = form.phone;
      if (form.patient_email) dataToSend.patient_email = form.patient_email;
      if (form.emergency_contact_name)
        dataToSend.emergency_contact_name = form.emergency_contact_name;
      if (form.emergency_contact_relationship)
        dataToSend.emergency_contact_relationship =
          form.emergency_contact_relationship;
      if (form.emergency_contact_phone)
        dataToSend.emergency_contact_phone = form.emergency_contact_phone;

      await patientsApi.create(dataToSend);
      toast.success("Paciente creado exitosamente");

      // Redirigir a la lista de pacientes
      setTimeout(() => {
        router.push("/app/patients");
      }, 1000);
    } catch (error: any) {
      console.error("Error al crear paciente:", error);
      toast.error(
        error.data?.message || error.message || "Error al crear el paciente",
      );
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped></style>
