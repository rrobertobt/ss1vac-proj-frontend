<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink to="/app/clinical-records">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a Historias Clínicas
        </NuxtLink>
      </Button>
      <h1 class="text-3xl font-bold">Nueva Historia Clínica</h1>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Información del Paciente -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:user" class="mr-2 h-5 w-5" />
              Información del Paciente
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="patient_id">
                  ID del Paciente <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="patient_id"
                  v-model.number="formData.patient_id"
                  type="number"
                  required
                  placeholder="ID del paciente"
                  :disabled="isSubmitting"
                />
                <p class="text-xs text-muted-foreground">
                  ID del paciente al que pertenece esta historia clínica
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Información General -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:file-text" class="mr-2 h-5 w-5" />
              Información General
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="record_number">Número de Historia</Label>
                <Input
                  id="record_number"
                  v-model="formData.record_number"
                  placeholder="HC-2024-001"
                  maxlength="50"
                  :disabled="isSubmitting"
                />
                <p class="text-xs text-muted-foreground">
                  Número único de identificación (opcional)
                </p>
              </div>

              <div class="space-y-2">
                <Label for="institution_name">Institución</Label>
                <Input
                  id="institution_name"
                  v-model="formData.institution_name"
                  placeholder="PsiFirm Clinic"
                  maxlength="150"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="service">Servicio</Label>
                <Input
                  id="service"
                  v-model="formData.service"
                  placeholder="Psicología clínica"
                  maxlength="120"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="opening_date">Fecha de Apertura</Label>
                <Input
                  id="opening_date"
                  v-model="formData.opening_date"
                  type="date"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Profesional Responsable -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:user-check" class="mr-2 h-5 w-5" />
              Profesional Responsable
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="responsible_employee_id">ID del Empleado</Label>
                <Input
                  id="responsible_employee_id"
                  v-model.number="formData.responsible_employee_id"
                  type="number"
                  placeholder="ID del profesional responsable"
                  :disabled="isSubmitting"
                />
                <p class="text-xs text-muted-foreground">
                  ID del profesional que estará a cargo
                </p>
              </div>

              <div class="space-y-2">
                <Label for="responsible_license">Número de Licencia</Label>
                <Input
                  id="responsible_license"
                  v-model="formData.responsible_license"
                  placeholder="PSI-12345"
                  maxlength="100"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Información Clínica -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:clipboard-list" class="mr-2 h-5 w-5" />
              Información Clínica
            </h3>
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <Label for="referral_source">Fuente de Referencia</Label>
                <Input
                  id="referral_source"
                  v-model="formData.referral_source"
                  placeholder="Médico General Dr. Pérez"
                  maxlength="150"
                  :disabled="isSubmitting"
                />
                <p class="text-xs text-muted-foreground">
                  Quién refiere al paciente (opcional)
                </p>
              </div>

              <div class="space-y-2">
                <Label for="chief_complaint">Motivo de Consulta</Label>
                <Textarea
                  id="chief_complaint"
                  v-model="formData.chief_complaint"
                  placeholder="Ansiedad y estrés laboral..."
                  rows="4"
                  :disabled="isSubmitting"
                />
                <p class="text-xs text-muted-foreground">
                  Razón principal por la que el paciente busca atención
                </p>
              </div>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex items-start">
              <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-red-800">Error al crear la historia clínica</h3>
                <p class="text-sm text-red-700 mt-1">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <Button variant="outline" type="button" as-child :disabled="isSubmitting">
              <NuxtLink to="/app/clinical-records">Cancelar</NuxtLink>
            </Button>
            <Button type="submit" :disabled="isSubmitting">
              <Icon
                v-if="isSubmitting"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <Icon v-else name="lucide:save" class="mr-2 h-4 w-4" />
              {{ isSubmitting ? "Creando..." : "Crear Historia Clínica" }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { createClinicalRecord, type CreateClinicalRecordRequest } from "~/lib/api/clinical-records";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Icon } from "#components";
import { NuxtLink } from "#components";

const router = useRouter();

const formData = ref<CreateClinicalRecordRequest>({
  patient_id: 0,
  record_number: "",
  institution_name: "",
  service: "",
  opening_date: "",
  responsible_employee_id: undefined,
  responsible_license: "",
  referral_source: "",
  chief_complaint: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  if (!formData.value.patient_id) {
    errorMessage.value = "El ID del paciente es requerido";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    // Limpiar campos vacíos opcionales
    const payload: CreateClinicalRecordRequest = {
      patient_id: formData.value.patient_id,
    };

    if (formData.value.record_number?.trim()) {
      payload.record_number = formData.value.record_number.trim();
    }
    if (formData.value.institution_name?.trim()) {
      payload.institution_name = formData.value.institution_name.trim();
    }
    if (formData.value.service?.trim()) {
      payload.service = formData.value.service.trim();
    }
    if (formData.value.opening_date?.trim()) {
      payload.opening_date = formData.value.opening_date.trim();
    }
    if (formData.value.responsible_employee_id) {
      payload.responsible_employee_id = formData.value.responsible_employee_id;
    }
    if (formData.value.responsible_license?.trim()) {
      payload.responsible_license = formData.value.responsible_license.trim();
    }
    if (formData.value.referral_source?.trim()) {
      payload.referral_source = formData.value.referral_source.trim();
    }
    if (formData.value.chief_complaint?.trim()) {
      payload.chief_complaint = formData.value.chief_complaint.trim();
    }

    const result = await createClinicalRecord(payload);
    
    // Redirigir al detalle de la historia clínica creada
    await router.push(`/app/clinical-records/${result.id}`);
  } catch (error: any) {
    console.error("Error creating clinical record:", error);
    errorMessage.value = error.message || "Ocurrió un error al crear la historia clínica";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
