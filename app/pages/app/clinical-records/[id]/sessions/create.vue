<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/sessions`">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a Sesiones
        </NuxtLink>
      </Button>
      <h1 class="text-3xl font-bold">Nueva Sesión de Atención</h1>
      <p class="text-muted-foreground mt-1">
        Historia Clínica #{{ clinicalRecordId }}
      </p>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Información Básica -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:calendar" class="mr-2 h-5 w-5" />
              Información de la Sesión
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="session_datetime">
                  Fecha y Hora <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="session_datetime"
                  v-model="formData.session_datetime"
                  type="datetime-local"
                  required
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="session_number">Número de Sesión</Label>
                <Input
                  id="session_number"
                  v-model.number="formData.session_number"
                  type="number"
                  min="1"
                  placeholder="1, 2, 3..."
                  :disabled="isSubmitting"
                />
                <p class="text-xs text-muted-foreground">
                  Número correlativo de la sesión (opcional)
                </p>
              </div>

              <div class="space-y-2">
                <Label for="professional_id">ID del Profesional</Label>
                <Input
                  id="professional_id"
                  v-model.number="formData.professional_id"
                  type="number"
                  placeholder="ID del profesional responsable"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="appointment_id">ID de Cita</Label>
                <Input
                  id="appointment_id"
                  v-model.number="formData.appointment_id"
                  type="number"
                  placeholder="ID de la cita relacionada"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Asistencia -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:user-check" class="mr-2 h-5 w-5" />
              Asistencia
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="attended">¿El paciente asistió?</Label>
                <Select v-model="attendedValue" :disabled="isSubmitting">
                  <SelectTrigger id="attended">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="true">Sí, asistió</SelectItem>
                    <SelectItem value="false">No asistió</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div v-if="attendedValue === 'false'" class="space-y-2">
                <Label for="absence_reason">Motivo de inasistencia</Label>
                <Input
                  id="absence_reason"
                  v-model="formData.absence_reason"
                  placeholder="Motivo por el que no asistió"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Contenido de la Sesión -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:file-text" class="mr-2 h-5 w-5" />
              Contenido de la Sesión
            </h3>
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="topics">Temas Tratados</Label>
                <Textarea
                  id="topics"
                  v-model="formData.topics"
                  placeholder="Describe los temas principales abordados en la sesión..."
                  rows="3"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="interventions">Intervenciones Realizadas</Label>
                <Textarea
                  id="interventions"
                  v-model="formData.interventions"
                  placeholder="Técnicas, estrategias o intervenciones aplicadas..."
                  rows="3"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="patient_response">Respuesta del Paciente</Label>
                <Textarea
                  id="patient_response"
                  v-model="formData.patient_response"
                  placeholder="Cómo respondió o reaccionó el paciente..."
                  rows="3"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="assigned_tasks">Tareas Asignadas</Label>
                <Textarea
                  id="assigned_tasks"
                  v-model="formData.assigned_tasks"
                  placeholder="Tareas o ejercicios asignados para casa..."
                  rows="2"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="observations">Observaciones Adicionales</Label>
                <Textarea
                  id="observations"
                  v-model="formData.observations"
                  placeholder="Cualquier otra observación relevante..."
                  rows="2"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- Próxima Cita -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:calendar-clock" class="mr-2 h-5 w-5" />
              Seguimiento
            </h3>
            <div class="space-y-2">
              <Label for="next_appointment_datetime">Próxima Cita Programada</Label>
              <Input
                id="next_appointment_datetime"
                v-model="formData.next_appointment_datetime"
                type="datetime-local"
                :disabled="isSubmitting"
              />
              <p class="text-xs text-muted-foreground">
                Fecha y hora de la próxima sesión (opcional)
              </p>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex items-start">
              <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-red-800">Error al crear la sesión</h3>
                <p class="text-sm text-red-700 mt-1">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <Button variant="outline" type="button" as-child :disabled="isSubmitting">
              <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/sessions`">
                Cancelar
              </NuxtLink>
            </Button>
            <Button type="submit" :disabled="isSubmitting">
              <Icon
                v-if="isSubmitting"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <Icon v-else name="lucide:save" class="mr-2 h-4 w-4" />
              {{ isSubmitting ? "Creando..." : "Crear Sesión" }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { createSession, type CreateSessionRequest } from "~/lib/api/sessions";
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
const router = useRouter();
const clinicalRecordId = computed(() => Number(route.params.id));

const formData = ref<CreateSessionRequest>({
  session_datetime: "",
  professional_id: undefined,
  session_number: undefined,
  attended: undefined,
  absence_reason: "",
  topics: "",
  interventions: "",
  patient_response: "",
  assigned_tasks: "",
  observations: "",
  next_appointment_datetime: "",
  appointment_id: undefined,
});

const attendedValue = ref<"pending" | "true" | "false">("pending");

// Sincronizar el valor de attended con el formData
watch(attendedValue, (newValue) => {
  if (newValue === "true") {
    formData.value.attended = true;
    formData.value.absence_reason = "";
  } else if (newValue === "false") {
    formData.value.attended = false;
  } else {
    formData.value.attended = undefined;
    formData.value.absence_reason = "";
  }
});

const isSubmitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  if (!formData.value.session_datetime) {
    errorMessage.value = "La fecha y hora de la sesión son requeridas";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const payload: CreateSessionRequest = {
      session_datetime: formData.value.session_datetime,
    };

    if (formData.value.professional_id) {
      payload.professional_id = formData.value.professional_id;
    }
    if (formData.value.session_number) {
      payload.session_number = formData.value.session_number;
    }
    if (formData.value.attended !== undefined) {
      payload.attended = formData.value.attended;
    }
    if (formData.value.absence_reason?.trim()) {
      payload.absence_reason = formData.value.absence_reason.trim();
    }
    if (formData.value.topics?.trim()) {
      payload.topics = formData.value.topics.trim();
    }
    if (formData.value.interventions?.trim()) {
      payload.interventions = formData.value.interventions.trim();
    }
    if (formData.value.patient_response?.trim()) {
      payload.patient_response = formData.value.patient_response.trim();
    }
    if (formData.value.assigned_tasks?.trim()) {
      payload.assigned_tasks = formData.value.assigned_tasks.trim();
    }
    if (formData.value.observations?.trim()) {
      payload.observations = formData.value.observations.trim();
    }
    if (formData.value.next_appointment_datetime?.trim()) {
      payload.next_appointment_datetime = formData.value.next_appointment_datetime.trim();
    }
    if (formData.value.appointment_id) {
      payload.appointment_id = formData.value.appointment_id;
    }

    await createSession(clinicalRecordId.value, payload);
    
    // Redirigir a la lista de sesiones
    await router.push(`/app/clinical-records/${clinicalRecordId.value}/sessions`);
  } catch (error: any) {
    console.error("Error creating session:", error);
    errorMessage.value = error.message || "Ocurrió un error al crear la sesión";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
