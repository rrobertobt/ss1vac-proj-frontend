<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink to="/app/clinical-records">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a Historias Clínicas
        </NuxtLink>
      </Button>
      <h1 class="text-3xl font-bold">Editar Historia Clínica</h1>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="loadError" class="text-center py-8">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:alert-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-500">Error al cargar la historia clínica</p>
          <p class="text-sm text-muted-foreground mt-2">{{ loadError.message }}</p>
        </CardContent>
      </Card>
    </div>

    <Card v-else-if="record">
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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

              <div class="space-y-2">
                <Label for="status">Estado</Label>
                <Select v-model="formData.status" :disabled="isSubmitting">
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Activa</SelectItem>
                    <SelectItem value="CLOSED">Cerrada</SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-muted-foreground">
                  Estado actual de la historia clínica
                </p>
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
              </div>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex items-start">
              <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-red-800">Error al actualizar la historia clínica</h3>
                <p class="text-sm text-red-700 mt-1">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Mensaje de Éxito -->
          <div v-if="successMessage" class="rounded-lg bg-green-50 p-4 border border-green-200">
            <div class="flex items-start">
              <Icon name="lucide:check-circle" class="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-green-800">Historia clínica actualizada</h3>
                <p class="text-sm text-green-700 mt-1">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <Button variant="outline" type="button" as-child :disabled="isSubmitting">
              <NuxtLink :to="`/app/clinical-records/${recordId}`">Cancelar</NuxtLink>
            </Button>
            <Button type="submit" :disabled="isSubmitting">
              <Icon
                v-if="isSubmitting"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <Icon v-else name="lucide:save" class="mr-2 h-4 w-4" />
              {{ isSubmitting ? "Guardando..." : "Guardar Cambios" }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  getClinicalRecordById,
  updateClinicalRecord,
  type ClinicalRecordResponse,
  type UpdateClinicalRecordRequest,
} from "~/lib/api/clinical-records";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Icon } from "#components";
import { NuxtLink } from "#components";


const route = useRoute();
const recordId = computed(() => Number(route.params.id));

const {
  data: record,
  pending,
  error: loadError,
} = await useAsyncData<ClinicalRecordResponse>(
  `clinical-record-edit-${recordId.value}`,
  () => getClinicalRecordById(recordId.value),
);

const formData = ref<UpdateClinicalRecordRequest>({
  record_number: "",
  institution_name: "",
  service: "",
  opening_date: "",
  responsible_employee_id: undefined,
  responsible_license: "",
  referral_source: "",
  chief_complaint: "",
  status: "ACTIVE",
});

// Inicializar el formulario con los datos existentes
watch(
  record,
  (newRecord) => {
    if (newRecord) {
      formData.value = {
        record_number: newRecord.record_number || "",
        institution_name: newRecord.institution_name || "",
        service: newRecord.service || "",
        opening_date: newRecord.opening_date || "",
        responsible_employee_id: newRecord.responsible_employee_id || undefined,
        responsible_license: newRecord.responsible_license || "",
        referral_source: newRecord.referral_source || "",
        chief_complaint: newRecord.chief_complaint || "",
        status: newRecord.status || "ACTIVE",
      };
    }
  },
  { immediate: true },
);

const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function handleSubmit() {
  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Preparar payload solo con campos modificados
    const payload: UpdateClinicalRecordRequest = {};

    if (formData.value.record_number?.trim() !== record.value?.record_number) {
      payload.record_number = formData.value.record_number?.trim() || undefined;
    }
    if (formData.value.institution_name?.trim() !== record.value?.institution_name) {
      payload.institution_name = formData.value.institution_name?.trim() || undefined;
    }
    if (formData.value.service?.trim() !== record.value?.service) {
      payload.service = formData.value.service?.trim() || undefined;
    }
    if (formData.value.opening_date?.trim() !== record.value?.opening_date) {
      payload.opening_date = formData.value.opening_date?.trim() || undefined;
    }
    if (formData.value.responsible_employee_id !== record.value?.responsible_employee_id) {
      payload.responsible_employee_id = formData.value.responsible_employee_id;
    }
    if (formData.value.responsible_license?.trim() !== record.value?.responsible_license) {
      payload.responsible_license = formData.value.responsible_license?.trim() || undefined;
    }
    if (formData.value.referral_source?.trim() !== record.value?.referral_source) {
      payload.referral_source = formData.value.referral_source?.trim() || undefined;
    }
    if (formData.value.chief_complaint?.trim() !== record.value?.chief_complaint) {
      payload.chief_complaint = formData.value.chief_complaint?.trim() || undefined;
    }
    if (formData.value.status !== record.value?.status) {
      payload.status = formData.value.status as "ACTIVE" | "CLOSED";
    }

    // Si no hay cambios, mostrar mensaje
    if (Object.keys(payload).length === 0) {
      successMessage.value = "No hay cambios para guardar";
      return;
    }

    await updateClinicalRecord(recordId.value, payload);
    successMessage.value = "Historia clínica actualizada exitosamente";
    
    // Recargar los datos
    await refreshNuxtData(`clinical-record-edit-${recordId.value}`);
  } catch (error: any) {
    console.error("Error updating clinical record:", error);
    errorMessage.value = error.message || "Ocurrió un error al actualizar la historia clínica";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
