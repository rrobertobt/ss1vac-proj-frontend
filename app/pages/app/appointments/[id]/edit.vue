<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">Editar Cita</h1>
        <p class="text-muted-foreground">Reprograme o modifique la cita</p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink :to="`/app/appointments/${appointmentId}`">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver
        </NuxtLink>
      </Button>
    </div>

    <div v-if="appointment">
      <form @submit.prevent="handleSubmit">
        <!-- Información Actual -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Información Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label class="text-muted-foreground">Paciente</Label>
                <p class="text-base font-medium">
                  {{ appointment.patient?.first_name }}
                  {{ appointment.patient?.last_name }}
                </p>
              </div>
              <div>
                <Label class="text-muted-foreground">Profesional</Label>
                <p class="text-base font-medium">
                  {{ appointment.professional?.first_name }}
                  {{ appointment.professional?.last_name }}
                </p>
              </div>
              <div>
                <Label class="text-muted-foreground">Fecha y Hora Actual</Label>
                <p class="text-base">
                  {{ formatDateTime(appointment.start_datetime) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Verificación de Disponibilidad -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Consultar Nueva Disponibilidad</CardTitle>
            <CardDescription>
              Busque horarios disponibles para reprogramar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="space-y-2">
                <Label for="availabilityDate">Fecha</Label>
                <Input
                  id="availabilityDate"
                  v-model="availabilitySearch.date"
                  type="date"
                />
              </div>
              <div class="space-y-2">
                <Label for="availabilitySpecialty">Especialidad</Label>
                <Select v-model="availabilitySearch.specialtyId">
                  <SelectTrigger id="availabilitySpecialty">
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="specialty in specialties"
                      :key="specialty.id"
                      :value="specialty.id.toString()"
                    >
                      {{ specialty.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  @click="checkAvailability"
                  :disabled="!availabilitySearch.date || loadingAvailability"
                  class="w-full"
                >
                  <Icon
                    :name="
                      loadingAvailability ? 'lucide:loader-2' : 'lucide:search'
                    "
                    :class="{ 'animate-spin': loadingAvailability }"
                    class="mr-2 h-4 w-4"
                  />
                  Buscar
                </Button>
              </div>
            </div>

            <!-- Resultados de Disponibilidad -->
            <div
              v-if="availability && availability.length > 0"
              class="space-y-4"
            >
              <Separator />
              <div class="space-y-3">
                <h3 class="font-semibold">Horarios Disponibles</h3>
                <div
                  v-for="prof in availability"
                  :key="prof.employee_id"
                  class="border rounded-lg p-4"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="lucide:user-round" class="h-4 w-4" />
                    <span class="font-medium">
                      {{ prof.employee_name }}
                    </span>
                    <span class="text-sm text-muted-foreground">
                      ({{
                        prof.specialty_name || "Sin especialidad"
                      }})
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Button
                      v-for="slot in prof.available_slots"
                      :key="`${slot.start}-${slot.end}`"
                      type="button"
                      size="sm"
                      variant="outline"
                      @click="selectTimeSlot(prof.employee_id, slot)"
                      :class="{
                        'border-primary bg-primary/10':
                          selectedSlot?.start === slot.start &&
                          form.professional_id === prof.employee_id,
                      }"
                    >
                      {{ slot.start.slice(11, 16) }} - {{ slot.end.slice(11, 16) }}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else-if="availability && availability.length === 0"
              class="text-center text-muted-foreground py-4"
            >
              No hay horarios disponibles para la fecha seleccionada
            </div>
          </CardContent>
        </Card>

        <!-- Resumen de la Cita Seleccionada -->
        <Card v-if="selectedSlot && form.professional_id" class="mb-6 border-primary/50">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon name="lucide:check-circle" class="h-5 w-5 text-primary" />
              Nueva Cita Seleccionada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label class="text-muted-foreground">Profesional</Label>
                <p class="text-base font-medium">{{ selectedProfessionalName }}</p>
                <p v-if="selectedSpecialtyName" class="text-sm text-muted-foreground">
                  {{ selectedSpecialtyName }}
                </p>
              </div>
              <div>
                <Label class="text-muted-foreground">Fecha</Label>
                <p class="text-base font-medium">{{ formatSelectedDate }}</p>
              </div>
              <div>
                <Label class="text-muted-foreground">Horario</Label>
                <p class="text-base font-medium">
                  {{ selectedSlot.start.slice(11, 16) }} - {{ selectedSlot.end.slice(11, 16) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Detalles Adicionales -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Detalles Adicionales</CardTitle>
            <CardDescription>Información complementaria sobre la cita</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <Label for="appointment_type" class="text-base">
                  Tipo de Cita
                </Label>
                <Input
                  id="appointment_type"
                  v-model="form.appointment_type"
                  placeholder="Ej: Consulta inicial, Terapia, etc."
                />
              </div>

              <div class="space-y-2">
                <Label for="notes" class="text-base">Notas</Label>
                <Textarea
                  id="notes"
                  v-model="form.notes"
                  placeholder="Notas adicionales sobre la cita"
                  rows="3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="flex gap-4">
          <Button type="submit" :disabled="submitting">
            <Icon
              :name="submitting ? 'lucide:loader-2' : 'lucide:save'"
              :class="{ 'animate-spin': submitting }"
              class="mr-2 h-4 w-4"
            />
            Guardar Cambios
          </Button>
          <Button type="button" variant="outline" as-child>
            <NuxtLink :to="`/app/appointments/${appointmentId}`">
              Cancelar
            </NuxtLink>
          </Button>
        </div>
      </form>
    </div>

    <div v-else-if="status === 'pending'" class="flex justify-center py-12">
      <Icon
        name="lucide:loader-2"
        class="h-8 w-8 animate-spin text-muted-foreground"
      />
    </div>

    <div v-else class="text-center py-12">
      <p class="text-muted-foreground">No se encontró la cita</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from "#components";
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { Input } from "~/components/ui/input";
  import { Label } from "~/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
  import { Textarea } from "~/components/ui/textarea";
  import { Separator } from "~/components/ui/separator";
  import { toast } from "vue-sonner";
  import {
    appointmentsApi,
    type AppointmentResponse,
    type UpdateAppointmentRequest,
    type ProfessionalAvailability,
    type TimeSlot,
  } from "~/lib/api/appointments";
  import { specialtiesApi } from "~/lib/api/specialties";

  const route = useRoute();
  const router = useRouter();
  const appointmentId = computed(() => Number(route.params.id));

  const form = reactive<UpdateAppointmentRequest & { specialty_id?: number }>({
    professional_id: undefined,
    specialty_id: undefined,
    start_datetime: undefined,
    end_datetime: undefined,
    appointment_type: undefined,
    notes: undefined,
  });

  const availabilitySearch = reactive({
    date: "",
    specialtyId: "",
  });

  const availability = ref<ProfessionalAvailability[]>([]);
  const selectedSlot = ref<TimeSlot | null>(null);
  const loadingAvailability = ref(false);
  const submitting = ref(false);

  const {
    data: appointment,
    status,
  } = await useAsyncData<AppointmentResponse>(
    `appointment-edit-${appointmentId.value}`,
    () => appointmentsApi.getById(appointmentId.value),
  );

  const { data: specialties } = await useAsyncData("specialties-for-appointment-edit", () =>
    specialtiesApi.list(),
  );

  // Computed properties for selected slot display
  const selectedProfessionalName = computed(() => {
    if (!form.professional_id || !availability.value) return "";
    const prof = availability.value.find(p => p.employee_id === form.professional_id);
    return prof?.employee_name || "";
  });

  const selectedSpecialtyName = computed(() => {
    if (!form.professional_id || !availability.value) return "";
    const prof = availability.value.find(p => p.employee_id === form.professional_id);
    return prof?.specialty_name || "";
  });

  const formatSelectedDate = computed(() => {
    if (!availabilitySearch.date) return "";
    return new Date(availabilitySearch.date).toLocaleDateString("es-GT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      
    });
  });

  // Cargar datos actuales en el formulario
  onMounted(() => {
    if (appointment.value) {
      form.professional_id = appointment.value.professional?.id;
      form.specialty_id = appointment.value.specialty_id;
      form.start_datetime = appointment.value.start_datetime
        ? new Date(appointment.value.start_datetime)
            .toISOString()
            .slice(0, 16)
        : undefined;
      form.end_datetime = appointment.value.end_datetime
        ? new Date(appointment.value.end_datetime).toISOString().slice(0, 16)
        : undefined;
      form.appointment_type = appointment.value.appointment_type;
      form.notes = appointment.value.notes;
    }
  });

  function formatDateTime(datetime: string) {
    return new Date(datetime).toLocaleString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  async function checkAvailability() {
    if (!availabilitySearch.date) {
      toast.error("Debe seleccionar una fecha");
      return;
    }

    loadingAvailability.value = true;
    try {
      const result = await appointmentsApi.checkAvailability({
        date: availabilitySearch.date,
        specialtyId: availabilitySearch.specialtyId
          ? Number(availabilitySearch.specialtyId)
          : undefined,
      });
      availability.value = result.professionals;

      if (result.professionals.length === 0) {
        toast.info("No hay horarios disponibles para la fecha seleccionada");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Error al consultar disponibilidad");
    } finally {
      loadingAvailability.value = false;
    }
  }

  function selectTimeSlot(professionalId: number, slot: TimeSlot) {
    selectedSlot.value = slot;
    form.professional_id = professionalId;

    // Encontrar la especialidad del profesional seleccionado
    const selectedProf = availability.value.find(p => p.employee_id === professionalId);
    if (selectedProf?.specialty_id) {
      form.specialty_id = selectedProf.specialty_id;
    }

    // Construir datetime strings
    const date = availabilitySearch.date;
    form.start_datetime = slot.start.includes("T")
      ? slot.start
      : `${date}T${slot.start}`;
    form.end_datetime = slot.end.includes("T")
      ? slot.end
      : `${date}T${slot.end}`;

    toast.success("Horario seleccionado");
  }

  async function handleSubmit() {
    // Construir el objeto de actualización solo con campos modificados
    const updateData: UpdateAppointmentRequest & { specialty_id?: number } = {};

    if (form.professional_id !== appointment.value?.professional?.id) {
      updateData.professional_id = form.professional_id;
    }
    if (form.specialty_id !== appointment.value?.specialty_id) {
      updateData.specialty_id = form.specialty_id;
    }
    if (
      form.start_datetime &&
      form.start_datetime !==
        new Date(appointment.value?.start_datetime || "")
          .toISOString()
          .slice(0, 16)
    ) {
      updateData.start_datetime = form.start_datetime;
    }
    if (
      form.end_datetime &&
      form.end_datetime !==
        new Date(appointment.value?.end_datetime || "")
          .toISOString()
          .slice(0, 16)
    ) {
      updateData.end_datetime = form.end_datetime;
    }
    if (form.appointment_type !== appointment.value?.appointment_type) {
      updateData.appointment_type = form.appointment_type;
    }
    if (form.notes !== appointment.value?.notes) {
      updateData.notes = form.notes;
    }

    if (Object.keys(updateData).length === 0) {
      toast.info("No hay cambios que guardar");
      return;
    }

    submitting.value = true;
    try {
      await appointmentsApi.update(appointmentId.value, updateData);
      toast.success("Cita actualizada exitosamente");
      router.push(`/app/appointments/${appointmentId.value}`);
    } catch (error: any) {
      toast.error(error.data?.message || "Error al actualizar la cita");
    } finally {
      submitting.value = false;
    }
  }
</script>

<style scoped></style>
