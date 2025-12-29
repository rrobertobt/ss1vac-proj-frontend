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
          <h1 class="text-3xl font-bold">Sesiones de Atención</h1>
          <p class="text-muted-foreground mt-1">
            Historia Clínica #{{ clinicalRecordId }}
          </p>
        </div>
        <Button as-child>
          <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/sessions/create`">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Nueva Sesión
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
          <p class="text-red-500">Error al cargar las sesiones</p>
          <p class="text-sm text-muted-foreground mt-2">{{ error.message }}</p>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="sessions && sessions.length === 0" class="text-center py-12">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:calendar-x" class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">No hay sesiones registradas</h3>
          <p class="text-muted-foreground mb-6">
            Comienza agregando la primera sesión de atención
          </p>
          <Button as-child>
            <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/sessions/create`">
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Crear Primera Sesión
            </NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </div>

    <div v-else class="space-y-4">
      <Card v-for="session in sortedSessions" :key="session.id" class="hover:shadow-md transition">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <CardTitle class="flex items-center gap-3">
                <span class="text-2xl font-bold text-muted-foreground">
                  #{{ session.session_number || session.id }}
                </span>
                <Separator orientation="vertical" class="h-6" />
                <div>
                  <div class="text-lg">
                    {{ formatSessionDateTime(session.session_datetime) }}
                  </div>
                  <div class="text-sm font-normal text-muted-foreground mt-1">
                    {{ formatSessionTime(session.session_datetime) }}
                  </div>
                </div>
              </CardTitle>
            </div>
            <div class="flex items-center gap-2">
              <Badge :variant="session.attended ? 'default' : session.attended === false ? 'destructive' : 'secondary'">
                {{ session.attended === true ? 'Asistió' : session.attended === false ? 'No asistió' : 'Pendiente' }}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Icon name="lucide:more-vertical" class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="toggleExpanded(session.id)">
                    <Icon :name="expandedSessions.has(session.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="mr-2 h-4 w-4" />
                    {{ expandedSessions.has(session.id) ? 'Contraer' : 'Ver detalles' }}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NuxtLink :to="`/app/clinical-records/${clinicalRecordId}/sessions/${session.id}/edit`">
                      <Icon name="lucide:edit" class="mr-2 h-4 w-4" />
                      Editar
                    </NuxtLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <!-- Vista expandida -->
        <CardContent v-if="expandedSessions.has(session.id)" class="space-y-4 pt-0">
          <!-- Profesional -->
          <div v-if="session.professional">
            <Label class="text-muted-foreground">Profesional</Label>
            <p class="text-base">
              {{ session.professional.first_name }} {{ session.professional.last_name }}
              <span v-if="session.professional.license_number" class="text-sm text-muted-foreground ml-2">
                ({{ session.professional.license_number }})
              </span>
            </p>
          </div>

          <!-- Asistencia -->
          <div v-if="session.attended === false && session.absence_reason">
            <Label class="text-muted-foreground">Motivo de inasistencia</Label>
            <p class="text-base">{{ session.absence_reason }}</p>
          </div>

          <Separator />

          <!-- Temas tratados -->
          <div v-if="session.topics">
            <Label class="text-muted-foreground">Temas tratados</Label>
            <p class="text-base whitespace-pre-wrap">{{ session.topics }}</p>
          </div>

          <!-- Intervenciones -->
          <div v-if="session.interventions">
            <Label class="text-muted-foreground">Intervenciones realizadas</Label>
            <p class="text-base whitespace-pre-wrap">{{ session.interventions }}</p>
          </div>

          <!-- Respuesta del paciente -->
          <div v-if="session.patient_response">
            <Label class="text-muted-foreground">Respuesta del paciente</Label>
            <p class="text-base whitespace-pre-wrap">{{ session.patient_response }}</p>
          </div>

          <!-- Tareas asignadas -->
          <div v-if="session.assigned_tasks">
            <Label class="text-muted-foreground">Tareas asignadas</Label>
            <p class="text-base whitespace-pre-wrap">{{ session.assigned_tasks }}</p>
          </div>

          <!-- Observaciones -->
          <div v-if="session.observations">
            <Label class="text-muted-foreground">Observaciones</Label>
            <p class="text-base whitespace-pre-wrap">{{ session.observations }}</p>
          </div>

          <!-- Próxima cita -->
          <div v-if="session.next_appointment_datetime">
            <Label class="text-muted-foreground">Próxima cita programada</Label>
            <p class="text-base">
              {{ formatSessionDateTime(session.next_appointment_datetime) }} a las {{ formatSessionTime(session.next_appointment_datetime) }}
            </p>
          </div>

          <Separator />

          <div class="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span class="font-medium">Creado:</span> {{ formatDateTime(session.created_at) }}
            </div>
            <div>
              <span class="font-medium">Actualizado:</span> {{ formatDateTime(session.updated_at) }}
            </div>
          </div>
        </CardContent>

        <!-- Vista colapsada (preview) -->
        <CardContent v-else class="pt-0">
          <div class="space-y-2">
            <div v-if="session.topics" class="text-sm text-muted-foreground line-clamp-2">
              <span class="font-medium">Temas:</span> {{ session.topics }}
            </div>
            <Button variant="ghost" size="sm" @click="toggleExpanded(session.id)" class="mt-2">
              <Icon name="lucide:chevron-down" class="mr-2 h-4 w-4" />
              Ver más detalles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSessionsByClinicalRecord, type SessionResponse } from "~/lib/api/sessions";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icon } from "#components";
import { NuxtLink } from "#components";

const route = useRoute();
const clinicalRecordId = computed(() => Number(route.params.id));

const {
  data: sessions,
  pending,
  error,
  refresh: refreshSessions,
} = await useAsyncData<SessionResponse[]>(
  `sessions-${clinicalRecordId.value}`,
  () => getSessionsByClinicalRecord(clinicalRecordId.value),
);

const expandedSessions = ref(new Set<number>());

const sortedSessions = computed(() => {
  if (!sessions.value) return [];
  return [...sessions.value].sort((a, b) => {
    // Ordenar por fecha de sesión, más reciente primero
    const dateA = new Date(a.session_datetime).getTime();
    const dateB = new Date(b.session_datetime).getTime();
    return dateB - dateA;
  });
});

function toggleExpanded(sessionId: number) {
  if (expandedSessions.value.has(sessionId)) {
    expandedSessions.value.delete(sessionId);
  } else {
    expandedSessions.value.add(sessionId);
  }
}

function formatSessionDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-GT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatSessionTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("es-GT", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
