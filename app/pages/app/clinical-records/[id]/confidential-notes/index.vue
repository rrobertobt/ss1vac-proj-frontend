<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}`">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a Historia Clínica
        </NuxtLink>
      </Button>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold flex items-center gap-2">
            <Icon name="lucide:lock" class="h-8 w-8 text-amber-600" />
            Notas Confidenciales
          </h1>
          <p class="text-muted-foreground mt-1">
            Historia Clínica #{{ clinicalRecordId }}
          </p>
          <div class="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            <Icon name="lucide:shield-alert" class="h-4 w-4" />
            Información sensible y confidencial. Acceso restringido.
          </div>
        </div>
        <Button as-child>
          <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/confidential-notes/create`">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Nueva Nota
          </NuxtLink>
        </Button>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:alert-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-500">Error al cargar las notas confidenciales</p>
          <p class="text-sm text-muted-foreground mt-2">{{ error.message }}</p>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="notes && notes.length === 0" class="text-center py-12">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:file-lock" class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">No hay notas confidenciales</h3>
          <p class="text-muted-foreground mb-6">
            Estas notas son para información sensible que requiere protección especial
          </p>
          <Button as-child>
            <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/confidential-notes/create`">
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Crear Primera Nota
            </NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </div>

    <div v-else class="space-y-4">
      <Card
        v-for="(note, index) in sortedNotes"
        :key="note.id"
        class="border-amber-200 bg-gradient-to-br from-amber-50/30 to-background"
      >
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <CardTitle class="text-base flex items-center gap-2 text-amber-900">
                <Icon name="lucide:lock" class="h-4 w-4" />
                Nota Confidencial #{{ sortedNotes.length - index }}
              </CardTitle>
              <div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Icon name="lucide:calendar" class="h-3 w-3" />
                  {{ formatDateTime(note.created_at) }}
                </div>
                  <div class="flex items-center gap-1">
                    <Icon name="lucide:user" class="h-3 w-3" />
                    {{ note.author?.first_name }} {{ note.author?.last_name }}
                      <span class="text-xs">
                        ({{ note.author?.license_number }})
                      </span>
                  </div>
              </div>
            </div>
            <Badge variant="secondary" class="bg-amber-100 text-amber-800 border-amber-300">
              <Icon name="lucide:shield-check" class="h-3 w-3 mr-1" />
              Confidencial
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="bg-white/80 border border-amber-100 rounded-md p-4">
            <p class="text-sm whitespace-pre-wrap leading-relaxed">
              {{ note.content }}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { getConfidentialNotes, type ConfidentialNoteResponse } from "~/lib/api/confidential-notes";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Icon } from "#components";
import { NuxtLink } from "#components";

const route = useRoute();
const clinicalRecordId = computed(() => Number(route.params.id));

const {
  data: notes,
  pending,
  error,
  refresh: refreshNotes,
} = await useAsyncData<ConfidentialNoteResponse[]>(
  `confidential-notes-${clinicalRecordId.value}`,
  () => getConfidentialNotes(clinicalRecordId.value),
);

const sortedNotes = computed(() => {
  if (!notes.value) return [];
  // Ordenar por fecha de creación, más reciente primero
  return [...notes.value].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  });
}
</script>
