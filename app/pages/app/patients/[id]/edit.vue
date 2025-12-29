<template>
  <div class="max-w-4xl mx-auto">
    <div
      v-if="loadingData"
      class="flex justify-center items-center min-h-[400px]"
    >
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="errorLoading" class="text-center py-12">
      <Icon
        name="lucide:alert-circle"
        class="h-12 w-12 mx-auto text-destructive mb-4"
      />
      <h2 class="text-2xl font-bold mb-2">Error al cargar paciente</h2>
      <p class="text-muted-foreground mb-4">{{ errorLoading }}</p>
      <Button @click="router.back()">Volver</Button>
    </div>

    <div v-else>
      <div class="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.back()">
          <Icon name="lucide:arrow-left" class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-3xl font-bold">Editar Paciente</h1>
          <p class="text-muted-foreground">
            Actualiza la información del paciente
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Información Personal -->
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Nota: No se puede editar el nombre y apellido
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Nombre</Label>
                <Input :value="patientName" disabled />
              </div>

              <div class="space-y-2">
                <Label>Apellido</Label>
                <Input :value="patientLastName" disabled />
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
                <Label for="email">Email Personal</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="contacto@example.com"
                  :disabled="loading"
                />
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
  import { patientsApi, type UpdatePatientRequest } from "~/lib/api/patients";

  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const loadingData = ref(true);
  const errorLoading = ref<string | null>(null);
  const patientName = ref("");
  const patientLastName = ref("");

  const form = reactive<UpdatePatientRequest>({
    dob: "",
    gender: undefined,
    marital_status: undefined,
    occupation: "",
    education_level: "",
    address: "",
    phone: "",
    email: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
  });

  // Cargar datos del paciente
  onMounted(async () => {
    try {
      loadingData.value = true;
      const id = Number(route.params.id);
      const patient = await patientsApi.getById(id);

      // Guardar nombre y apellido (no editables)
      patientName.value = patient.first_name;
      patientLastName.value = patient.last_name;

      // Llenar el formulario con los datos existentes
      form.dob = patient.dob?.split("T")[0] || "";
      form.gender = patient.gender;
      form.marital_status = patient.marital_status;
      form.occupation = patient.occupation || "";
      form.education_level = patient.education_level || "";
      form.address = patient.address || "";
      form.phone = patient.phone || "";
      form.email = patient.email || "";
      form.emergency_contact_name = patient.emergency_contact_name || "";
      form.emergency_contact_relationship =
        patient.emergency_contact_relationship || "";
      form.emergency_contact_phone = patient.emergency_contact_phone || "";
    } catch (err: any) {
      errorLoading.value = err.data?.message || "Error al cargar el paciente";
      console.error("Error loading patient:", err);
    } finally {
      loadingData.value = false;
    }
  });

  async function handleSubmit() {
    loading.value = true;

    try {
      const id = Number(route.params.id);

      // Preparar datos: solo enviar campos que tienen valores
      const dataToSend: UpdatePatientRequest = {};

      if (form.dob) dataToSend.dob = form.dob;
      if (form.gender) dataToSend.gender = form.gender;
      if (form.marital_status) dataToSend.marital_status = form.marital_status;
      if (form.occupation) dataToSend.occupation = form.occupation;
      if (form.education_level)
        dataToSend.education_level = form.education_level;
      if (form.address) dataToSend.address = form.address;
      if (form.phone) dataToSend.phone = form.phone;
      if (form.email) dataToSend.email = form.email;
      if (form.emergency_contact_name)
        dataToSend.emergency_contact_name = form.emergency_contact_name;
      if (form.emergency_contact_relationship)
        dataToSend.emergency_contact_relationship =
          form.emergency_contact_relationship;
      if (form.emergency_contact_phone)
        dataToSend.emergency_contact_phone = form.emergency_contact_phone;

      await patientsApi.update(id, dataToSend);
      toast.success("Paciente actualizado exitosamente");

      // Redirigir a la vista de detalle
      setTimeout(() => {
        router.push(`/app/patients/${id}`);
      }, 1000);
    } catch (error: any) {
      console.error("Error al actualizar paciente:", error);
      toast.error(
        // error.data?.message ||
        //   error.message ||
        //   "Error al actualizar el paciente",
        error.data?.message instanceof Array
          ? error.data?.message.join(", ")
          : error.data?.message ||
              error.message ||
              "Error al actualizar el paciente",
      );
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped></style>
