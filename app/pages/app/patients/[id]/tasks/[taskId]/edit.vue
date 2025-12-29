<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink :to="`/app/patients/${patientId}/tasks`">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a Tareas
        </NuxtLink>
      </Button>
      <h1 class="text-3xl font-bold">Editar Tarea</h1>
      <p class="text-muted-foreground mt-1">
        Paciente ID #{{ patientId }} - Tarea #{{ taskId }}
      </p>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="loadError" class="text-center py-8">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:alert-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-500">Error al cargar la tarea</p>
          <p class="text-sm text-muted-foreground mt-2">{{ loadError.message }}</p>
        </CardContent>
      </Card>
    </div>

    <Card v-else-if="task">
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Información de la Tarea -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:clipboard-list" class="mr-2 h-5 w-5" />
              Detalles de la Tarea
            </h3>
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="title">
                  Título <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  v-model="formData.title"
                  required
                  maxlength="200"
                  placeholder="Ej: Completar diario de emociones"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="space-y-2">
                <Label for="description">Descripción</Label>
                <Textarea
                  id="description"
                  v-model="formData.description"
                  placeholder="Describe los detalles, instrucciones o pasos de la tarea..."
                  rows="4"
                  :disabled="isSubmitting"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="due_date">Fecha de Vencimiento</Label>
                  <Input
                    id="due_date"
                    v-model="formData.due_date"
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
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                      <SelectItem value="COMPLETED">Completada</SelectItem>
                      <SelectItem value="CANCELLED">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex items-start">
              <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-red-800">Error al actualizar la tarea</h3>
                <p class="text-sm text-red-700 mt-1">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Mensaje de Éxito -->
          <div v-if="successMessage" class="rounded-lg bg-green-50 p-4 border border-green-200">
            <div class="flex items-start">
              <Icon name="lucide:check-circle" class="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-green-800">Tarea actualizada</h3>
                <p class="text-sm text-green-700 mt-1">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <Button variant="outline" type="button" as-child :disabled="isSubmitting">
              <NuxtLink :to="`/app/patients/${patientId}/tasks`">
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
  getPatientTasks,
  updatePatientTask,
  type PatientTaskResponse,
  type UpdatePatientTaskRequest,
} from "~/lib/api/patient-tasks";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
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
const patientId = computed(() => Number(route.params.id));
const taskId = computed(() => Number(route.params.taskId));

// Cargar todas las tareas y filtrar la específica
const {
  data: tasks,
  pending,
  error: loadError,
} = await useAsyncData<PatientTaskResponse[]>(
  `patient-tasks-edit-${patientId.value}`,
  () => getPatientTasks(patientId.value),
);

const task = computed(() => {
  return tasks.value?.find(t => t.id === taskId.value);
});

const formData = ref<UpdatePatientTaskRequest>({
  title: "",
  description: "",
  due_date: "",
  status: "PENDING",
});

// Función para convertir date de backend a formato date input
function toDateInput(dateString?: string): string {
  if (!dateString) return "";
  return dateString.split("T")[0];
}

// Inicializar el formulario con los datos existentes
watch(
  task,
  (newTask) => {
    if (newTask) {
      formData.value = {
        title: newTask.title || "",
        description: newTask.description || "",
        due_date: toDateInput(newTask.due_date),
        status: newTask.status || "PENDING",
      };
    }
  },
  { immediate: true },
);

const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function handleSubmit() {
  if (!formData.value.title?.trim()) {
    errorMessage.value = "El título de la tarea es requerido";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const payload: UpdatePatientTaskRequest = {};

    // Solo incluir campos que han cambiado
    if (formData.value.title?.trim() !== task.value?.title) {
      payload.title = formData.value.title.trim();
    }
    if (formData.value.description?.trim() !== task.value?.description) {
      payload.description = formData.value.description?.trim() || undefined;
    }
    if (formData.value.due_date !== toDateInput(task.value?.due_date)) {
      payload.due_date = formData.value.due_date || undefined;
    }
    if (formData.value.status !== task.value?.status) {
      payload.status = formData.value.status as any;
    }

    if (Object.keys(payload).length === 0) {
      successMessage.value = "No hay cambios para guardar";
      return;
    }

    await updatePatientTask(taskId.value, payload);
    successMessage.value = "Tarea actualizada exitosamente";
    
    // Recargar los datos
    await refreshNuxtData(`patient-tasks-edit-${patientId.value}`);
  } catch (error: any) {
    console.error("Error updating patient task:", error);
    errorMessage.value = error.message || "Ocurrió un error al actualizar la tarea";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
