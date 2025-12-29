<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink to="/app/clinical-records">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver a Historias Clínicas
        </NuxtLink>
      </Button>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Detalle de Historia Clínica</h1>
        <div class="flex gap-2" v-if="record">
          <Button variant="outline" as-child>
            <NuxtLink :to="`/app/clinical-records/${record.id}/sessions`">
              <Icon name="lucide:calendar-days" class="mr-2 h-4 w-4" />
              Sesiones
            </NuxtLink>
          </Button>
          <Button variant="outline" as-child>
            <NuxtLink :to="`/app/clinical-records/${record.id}/confidential-notes`">
              <Icon name="lucide:lock" class="mr-2 h-4 w-4" />
              Notas Confidenciales
            </NuxtLink>
          </Button>
          <Button variant="outline" as-child>
            <NuxtLink :to="`/app/patients/${record.patient_id}/tasks`">
              <Icon name="lucide:list-todo" class="mr-2 h-4 w-4" />
              Tareas del paciente
            </NuxtLink>
          </Button>
          <Button as-child>
            <NuxtLink :to="`/app/clinical-records/edit/${record.id}`">
              <Icon name="lucide:edit" class="mr-2 h-4 w-4" />
              Editar
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:alert-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-500">Error al cargar la historia clínica</p>
          <p class="text-sm text-muted-foreground mt-2">{{ error.message }}</p>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="record" class="space-y-6">
      <!-- Información General -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Icon name="lucide:file-text" class="mr-2 h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label class="text-muted-foreground">Número de Historia</Label>
              <p class="text-lg font-mono">{{ record.record_number || "N/A" }}</p>
            </div>
            <div>
              <Label class="text-muted-foreground">Estado</Label>
              <div class="mt-1">
                <Badge :variant="record.status === 'ACTIVE' ? 'default' : 'secondary'" class="text-sm">
                  {{ record.status === "ACTIVE" ? "Activa" : "Cerrada" }}
                </Badge>
              </div>
            </div>
            <div>
              <Label class="text-muted-foreground">Institución</Label>
              <p class="text-lg">{{ record.institution_name || "N/A" }}</p>
            </div>
            <div>
              <Label class="text-muted-foreground">Servicio</Label>
              <p class="text-lg">{{ record.service || "N/A" }}</p>
            </div>
            <div>
              <Label class="text-muted-foreground">Fecha de Apertura</Label>
              <p class="text-lg">
                {{ record.opening_date ? formatDate(record.opening_date) : "N/A" }}
              </p>
            </div>
            <div>
              <Label class="text-muted-foreground">Licencia del Responsable</Label>
              <p class="text-lg font-mono">{{ record.responsible_license || "N/A" }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información del Paciente -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Icon name="lucide:user" class="mr-2 h-5 w-5" />
            Información del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="record.patient" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label class="text-muted-foreground">Nombre Completo</Label>
              <p class="text-lg font-semibold">
                {{ record.patient.first_name }} {{ record.patient.last_name }}
              </p>
            </div>
            <div>
              <Label class="text-muted-foreground">Estado</Label>
              <div class="mt-1">
                <Badge :variant="record.patient.status === 'ACTIVE' ? 'default' : 'secondary'">
                  {{ record.patient.status === "ACTIVE" ? "Activo" : "Inactivo" }}
                </Badge>
              </div>
            </div>
            <div>
              <Label class="text-muted-foreground">Email</Label>
              <p class="text-lg">{{ record.patient.email || "N/A" }}</p>
            </div>
            <div>
              <Label class="text-muted-foreground">Teléfono</Label>
              <p class="text-lg">{{ record.patient.phone || "N/A" }}</p>
            </div>
          </div>
          <div v-else class="text-muted-foreground">
            No hay información del paciente disponible
          </div>
        </CardContent>
      </Card>

      <!-- Profesional Responsable -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Icon name="lucide:user-check" class="mr-2 h-5 w-5" />
            Profesional Responsable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="record.responsible_employee" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label class="text-muted-foreground">Nombre Completo</Label>
              <p class="text-lg font-semibold">
                {{ record.responsible_employee.first_name }} {{ record.responsible_employee.last_name }}
              </p>
            </div>
            <div>
              <Label class="text-muted-foreground">Número de Licencia</Label>
              <p class="text-lg font-mono">{{ record.responsible_employee.license_number || "N/A" }}</p>
            </div>
            <div>
              <Label class="text-muted-foreground">Estado</Label>
              <div class="mt-1">
                <Badge :variant="record.responsible_employee.status === 'ACTIVE' ? 'default' : 'secondary'">
                  {{ record.responsible_employee.status === "ACTIVE" ? "Activo" : "Inactivo" }}
                </Badge>
              </div>
            </div>
          </div>
          <div v-else class="text-muted-foreground">
            No hay profesional responsable asignado
          </div>
        </CardContent>
      </Card>

      <!-- Motivo de Consulta -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Icon name="lucide:clipboard-list" class="mr-2 h-5 w-5" />
            Información Clínica
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label class="text-muted-foreground">Fuente de Referencia</Label>
            <p class="text-lg">{{ record.referral_source || "N/A" }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Motivo de Consulta</Label>
            <p class="text-lg whitespace-pre-wrap">{{ record.chief_complaint || "N/A" }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Metadatos -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Icon name="lucide:info" class="mr-2 h-5 w-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label class="text-muted-foreground">Fecha de Creación</Label>
              <p class="text-lg">{{ formatDateTime(record.created_at) }}</p>
            </div>
            <div>
              <Label class="text-muted-foreground">Última Actualización</Label>
              <p class="text-lg">{{ formatDateTime(record.updated_at) }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getClinicalRecordById, type ClinicalRecordResponse } from "~/lib/api/clinical-records";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Icon } from "#components";
import { NuxtLink } from "#components";

const route = useRoute();
const recordId = computed(() => Number(route.params.id));

const {
  data: record,
  pending,
  error,
} = await useAsyncData<ClinicalRecordResponse>(
  `clinical-record-${recordId.value}`,
  () => getClinicalRecordById(recordId.value),
);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
