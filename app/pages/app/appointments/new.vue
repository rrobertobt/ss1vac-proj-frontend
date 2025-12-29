<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">Nueva Cita</h1>
        <p class="text-muted-foreground">Agende una nueva cita para un paciente</p>
      </div>
      <Button variant="outline" as-child>
        <NuxtLink to="/app/appointments">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver
        </NuxtLink>
      </Button>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Información del Paciente -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="patient_id" class="text-base">
                Paciente <span class="text-red-500">*</span>
              </Label>
              <Popover v-model:open="patientPopoverOpen">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    role="combobox"
                    :aria-expanded="patientPopoverOpen"
                    class="w-full justify-between"
                  >
                    <span class="truncate">
                      {{ selectedPatientLabel || "Buscar paciente..." }}
                    </span>
                    <Icon name="lucide:chevrons-up-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Buscar paciente..."
                      v-model="patientSearchQuery"
                      @update:model-value="debouncedSearchPatients"
                    />
                    <CommandEmpty>
                      {{ searchingPatients ? "Buscando..." : "No se encontraron pacientes" }}
                    </CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          v-for="patient in searchedPatients"
                          :key="patient.id"
                          :value="patient.id.toString()"
                          @select="selectPatient(patient)"
                        >
                          <Icon
                            name="lucide:check"
                            :class="[
                              'mr-2 h-4 w-4',
                              form.patient_id === patient.id ? 'opacity-100' : 'opacity-0'
                            ]"
                          />
                          {{ patient.first_name }} {{ patient.last_name }}
                          <span v-if="patient.email" class="ml-2 text-sm text-muted-foreground">
                            ({{ patient.email }})
                          </span>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Verificación de Disponibilidad -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Consultar Disponibilidad</CardTitle>
          <CardDescription>Busque horarios disponibles antes de agendar</CardDescription>
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
                  :name="loadingAvailability ? 'lucide:loader-2' : 'lucide:search'"
                  :class="{ 'animate-spin': loadingAvailability }"
                  class="mr-2 h-4 w-4"
                />
                Buscar
              </Button>
            </div>
          </div>

          <!-- Resultados de Disponibilidad -->
          <div v-if="availability && availability.length > 0" class="space-y-4">
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
                    ({{ prof.specialty_name || "Sin especialidad" }})
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
          <div v-else-if="availability && availability.length === 0" class="text-center text-muted-foreground py-4">
            No hay horarios disponibles para la fecha seleccionada
          </div>
        </CardContent>
      </Card>

      <!-- Resumen de la Cita Seleccionada -->
      <Card v-if="selectedSlot && form.professional_id" class="mb-6 border-primary/50">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon name="lucide:check-circle" class="h-5 w-5 text-primary" />
            Cita Seleccionada
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
            :name="submitting ? 'lucide:loader-2' : 'lucide:calendar-check'"
            :class="{ 'animate-spin': submitting }"
            class="mr-2 h-4 w-4"
          />
          Crear Cita
        </Button>
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/app/appointments">Cancelar</NuxtLink>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { Icon, NuxtLink } from "#components";
import { toast } from "vue-sonner";
import { useDebounceFn } from "@vueuse/core";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  appointmentsApi,
  type CreateAppointmentRequest,
  type ProfessionalAvailability,
  type TimeSlot,
} from "~/lib/api/appointments";
import { employeesApi } from "~/lib/api/employees";
import { patientsApi, type PatientResponse } from "~/lib/api/patients";
import { specialtiesApi } from "~/lib/api/specialties";

  const router = useRouter();

  const form = reactive<CreateAppointmentRequest>({
    patient_id: 0,
    professional_id: undefined,
    specialty_id: undefined,
    start_datetime: "",
    end_datetime: "",
    appointment_type: "",
    notes: "",
  });

  const availabilitySearch = reactive({
    date: "",
    specialtyId: "",
  });

  const availability = ref<ProfessionalAvailability[]>([]);
  const selectedSlot = ref<TimeSlot | null>(null);
  const loadingAvailability = ref(false);
  const submitting = ref(false);

  // Patient search state
  const patientPopoverOpen = ref(false);
  const patientSearchQuery = ref("");
  const searchedPatients = ref<PatientResponse[]>([]);
  const searchingPatients = ref(false);
  const selectedPatientLabel = ref("");

  // Search patients function
  async function searchPatients(query: string) {
    searchingPatients.value = true;
    try {
      const result = await patientsApi.list({
        page: 1,
        limit: 20,
        search: query || undefined,
        status: "ACTIVE",
      });
      searchedPatients.value = result.data;
    } catch (error) {
      console.error("Error searching patients:", error);
      searchedPatients.value = [];
    } finally {
      searchingPatients.value = false;
    }
  }

  // Debounced search
  const debouncedSearchPatients = useDebounceFn((query: string) => {
    searchPatients(query);
  }, 300);

  // Select patient
  function selectPatient(patient: PatientResponse) {
    form.patient_id = patient.id;
    selectedPatientLabel.value = `${patient.first_name} ${patient.last_name}`;
    patientPopoverOpen.value = false;
  }

  // Load initial patients on mount
  onMounted(() => {
    searchPatients("");
  });

  const { data: specialties } = await useAsyncData("specialties-for-appointment", () => specialtiesApi.list());

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
    if (!form.patient_id) {
      toast.error("Debe seleccionar un paciente");
      return;
    }
    if (!selectedSlot.value || !form.professional_id) {
      toast.error("Debe seleccionar un horario disponible");
      return;
    }
    if (!form.start_datetime || !form.end_datetime) {
      toast.error("Error: No se pudo determinar la fecha y hora de la cita");
      return;
    }

    submitting.value = true;
    try {
      await appointmentsApi.create(form);
      toast.success("Cita creada exitosamente");
      router.push("/app/appointments");
    } catch (error: any) {
      toast.error(error.data?.message || "Error al crear la cita");
    } finally {
      submitting.value = false;
    }
  }
</script>

<style scoped></style>
