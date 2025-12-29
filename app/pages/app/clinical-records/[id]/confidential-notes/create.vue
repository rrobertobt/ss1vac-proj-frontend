<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/confidential-notes`">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a Notas Confidenciales
        </NuxtLink>
      </Button>
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <Icon name="lucide:lock" class="h-8 w-8 text-amber-600" />
          Nueva Nota Confidencial
        </h1>
        <p class="text-muted-foreground mt-1">
          Historia Clínica #{{ clinicalRecordId }}
        </p>
        <div class="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
          <Icon name="lucide:shield-alert" class="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p class="font-medium mb-1">Información Confidencial</p>
            <p class="text-xs text-amber-600">
              Esta nota contendrá información sensible y de acceso restringido.
              Solo personal autorizado podrá visualizarla.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Card class="border-amber-200">
      <CardContent class="pt-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Contenido de la Nota -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="lucide:file-text" class="mr-2 h-5 w-5" />
              Contenido de la Nota
            </h3>
            <div class="space-y-2">
              <Label for="content">
                Contenido <span class="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                v-model="formData.content"
                required
                placeholder="Escribe aquí la información confidencial...&#10;&#10;Esta nota es para documentar aspectos sensibles del caso que requieren protección especial."
                rows="12"
                class="font-mono text-sm"
                :disabled="isSubmitting"
              />
              <p class="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="lucide:info" class="h-3 w-3" />
                Asegúrate de incluir todos los detalles relevantes de manera clara y precisa
              </p>
            </div>
          </div>

          <!-- Guías de Contenido -->
          <div class="rounded-lg bg-muted/50 p-4 space-y-2">
            <p class="text-sm font-medium flex items-center gap-2">
              <Icon name="lucide:lightbulb" class="h-4 w-4" />
              Guía: ¿Qué incluir en una nota confidencial?
            </p>
            <ul class="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Información personal sensible del paciente</li>
              <li>Detalles de situaciones de riesgo o vulnerabilidad</li>
              <li>Información médica que requiere discreción especial</li>
              <li>Observaciones sobre dinámicas familiares complejas</li>
              <li>Cualquier detalle que deba ser de acceso limitado</li>
            </ul>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200">
            <div class="flex items-start">
              <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-red-800">Error al crear la nota</h3>
                <p class="text-sm text-red-700 mt-1">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Confirmación de Confidencialidad -->
          <div class="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <div class="flex items-start gap-3">
              <Icon name="lucide:shield-check" class="h-5 w-5 text-amber-600 mt-0.5" />
              <div class="flex-1 text-sm">
                <p class="font-medium text-amber-900 mb-1">
                  Compromiso de Confidencialidad
                </p>
                <p class="text-amber-700 text-xs">
                  Al crear esta nota, confirmo que la información contenida es de carácter
                  confidencial y debe ser tratada con el máximo nivel de protección según
                  las normativas de privacidad y ética profesional.
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <Button variant="outline" type="button" as-child :disabled="isSubmitting">
              <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/confidential-notes`">
                Cancelar
              </NuxtLink>
            </Button>
            <Button type="submit" :disabled="isSubmitting" class="bg-amber-600 hover:bg-amber-700">
              <Icon
                v-if="isSubmitting"
                name="lucide:loader-2"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <Icon v-else name="lucide:lock" class="mr-2 h-4 w-4" />
              {{ isSubmitting ? "Creando..." : "Crear Nota Confidencial" }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { createConfidentialNote, type CreateConfidentialNoteRequest } from "~/lib/api/confidential-notes";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Icon } from "#components";
import { NuxtLink } from "#components";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const clinicalRecordId = computed(() => Number(route.params.id));

const formData = ref<CreateConfidentialNoteRequest>({
  content: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  if (!formData.value.content.trim()) {
    errorMessage.value = "El contenido de la nota es requerido";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await createConfidentialNote(clinicalRecordId.value, {
      content: formData.value.content.trim(),
    });
    
    // Redirigir a la lista de notas
    await router.push(`/app/clinical-records/${clinicalRecordId.value}/confidential-notes`);
  } catch (error: any) {
    console.error("Error creating confidential note:", error);
    errorMessage.value = error.message || "Ocurrió un error al crear la nota confidencial";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
