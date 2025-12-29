<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Mis Historias Clínicas</h1>
      <p class="text-muted-foreground mt-1">
        Visualiza tus registros médicos y seguimiento clínico
      </p>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:alert-circle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-500">Error al cargar tus historias clínicas</p>
          <p class="text-sm text-muted-foreground mt-2">{{ error.message }}</p>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="clinicalRecords && clinicalRecords.length === 0" class="text-center py-12">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:folder-open" class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">No tienes historias clínicas</h3>
          <p class="text-muted-foreground">
            Cuando se abra una historia clínica para ti, aparecerá aquí
          </p>
        </CardContent>
      </Card>
    </div>

    <div v-else class="space-y-4">
      <Card v-for="record in sortedRecords" :key="record.id" class="hover:shadow-md transition">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <CardTitle class="text-xl flex items-center gap-2">
                <Icon name="lucide:file-text" class="h-5 w-5" />
                {{ record.record_number || `Historia Clínica #${record.id}` }}
              </CardTitle>
              <p v-if="record.service" class="text-sm text-muted-foreground mt-1">
                {{ record.service }}
              </p>
            </div>
            <Badge :variant="record.status === 'ACTIVE' ? 'default' : 'secondary'">
              {{ record.status === "ACTIVE" ? "Activa" : "Cerrada" }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div v-if="record.institution_name">
              <Label class="text-muted-foreground text-xs">Institución</Label>
              <p class="font-medium">{{ record.institution_name }}</p>
            </div>
            <div v-if="record.opening_date">
              <Label class="text-muted-foreground text-xs">Fecha de Apertura</Label>
              <p>{{ formatDate(record.opening_date) }}</p>
            </div>
            <div v-if="record.responsible_employee">
              <Label class="text-muted-foreground text-xs">Profesional Responsable</Label>
              <p>
                {{ record.responsible_employee.first_name }}
                {{ record.responsible_employee.last_name }}
                <span
                  v-if="record.responsible_employee.license_number"
                  class="text-xs text-muted-foreground ml-1"
                >
                  ({{ record.responsible_employee.license_number }})
                </span>
              </p>
            </div>
            <div v-if="record.referral_source">
              <Label class="text-muted-foreground text-xs">Fuente de Referencia</Label>
              <p>{{ record.referral_source }}</p>
            </div>
          </div>

          <div v-if="record.chief_complaint" class="pt-4 border-t">
            <Label class="text-muted-foreground text-xs">Motivo de Consulta</Label>
            <p class="text-sm whitespace-pre-wrap mt-1">{{ record.chief_complaint }}</p>
          </div>

          <div class="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Creada el {{formatDateTime(record.created_at)}}</span>
            <span v-if="record.updated_at !== record.created_at">
              Actualizada el {{ formatDateTime(record.updated_at) }}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { getMyClinicalRecords, type ClinicalRecordResponse } from "~/lib/api/clinical-records";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Icon } from "#components";

const {
  data: clinicalRecords,
  pending,
  error,
} = await useAsyncData<ClinicalRecordResponse[]>(
  "my-clinical-records",
  () => getMyClinicalRecords(),
);

const sortedRecords = computed(() => {
  if (!clinicalRecords.value) return [];
  return [...clinicalRecords.value].sort((a, b) => {
    // Activas primero
    if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
    if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;
    // Luego por fecha de apertura, más reciente primero
    if (a.opening_date && b.opening_date) {
      return new Date(b.opening_date).getTime() - new Date(a.opening_date).getTime();
    }
    // Por último por fecha de creación
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

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
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
