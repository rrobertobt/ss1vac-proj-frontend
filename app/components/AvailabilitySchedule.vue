<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Disponibilidad</h3>
      <Button
        type="button"
        variant="outline"
        size="sm"
        @click="addAvailabilitySlot"
      >
        <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
        Agregar horario
      </Button>
    </div>

    <div v-if="modelValue.length === 0" class="text-sm text-muted-foreground">
      No hay horarios configurados. Haz clic en "Agregar horario" para añadir
      uno.
    </div>

    <div
      v-for="(slot, index) in modelValue"
      :key="index"
      class="p-4 border rounded-lg space-y-4 relative"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="absolute top-2 right-2 h-8 w-8"
        @click="removeAvailabilitySlot(index)"
      >
        <Icon name="lucide:x" class="h-4 w-4" />
      </Button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Día de la semana -->
        <div class="space-y-2">
          <Label :for="`day-${index}`">Día de la semana</Label>
          <Select
            :model-value="slot.day_of_week?.toString()"
            @update:model-value="
              (value) => updateSlot(index, 'day_of_week', Number(value))
            "
          >
            <SelectTrigger :id="`day-${index}`">
              <SelectValue placeholder="Selecciona un día" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Domingo</SelectItem>
              <SelectItem value="1">Lunes</SelectItem>
              <SelectItem value="2">Martes</SelectItem>
              <SelectItem value="3">Miércoles</SelectItem>
              <SelectItem value="4">Jueves</SelectItem>
              <SelectItem value="5">Viernes</SelectItem>
              <SelectItem value="6">Sábado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Especialidad (opcional) -->
        <div class="space-y-2" v-if="specialties && specialties.length > 0">
          <Label :for="`specialty-${index}`">Especialidad</Label>
          <Select
            :model-value="slot.specialty_id?.toString() || ''"
            @update:model-value="
              (value) =>
                updateSlot(index, 'specialty_id', value ? Number(value) : undefined)
            "
          >
            <SelectTrigger :id="`specialty-${index}`">
              <SelectValue placeholder="Selecciona especialidad" />
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
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Hora de inicio -->
        <div class="space-y-2">
          <Label :for="`start-${index}`">Hora de inicio</Label>
          <Input
            :id="`start-${index}`"
            type="time"
            :model-value="slot.start_time"
            @update:model-value="
              (value) => updateSlot(index, 'start_time', value)
            "
          />
        </div>

        <!-- Hora de fin -->
        <div class="space-y-2">
          <Label :for="`end-${index}`">Hora de fin</Label>
          <Input
            :id="`end-${index}`"
            type="time"
            :model-value="slot.end_time"
            @update:model-value="(value) => updateSlot(index, 'end_time', value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import { Input } from "~/components/ui/input";
  import { Label } from "~/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
  import type { EmployeeAvailability } from "~/lib/api/employees";

  interface Specialty {
    id: number;
    name: string;
    description?: string;
  }

  interface Props {
    modelValue: EmployeeAvailability[];
    specialties?: Specialty[];
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    "update:modelValue": [value: EmployeeAvailability[]];
  }>();

  function addAvailabilitySlot() {
    const newSlots = [
      ...props.modelValue,
      {
        day_of_week: 1,
        start_time: "09:00",
        end_time: "17:00",
      } as EmployeeAvailability,
    ];
    emit("update:modelValue", newSlots);
  }

  function removeAvailabilitySlot(index: number) {
    const newSlots = props.modelValue.filter((_, i) => i !== index);
    emit("update:modelValue", newSlots);
  }

  function updateSlot(
    index: number,
    field: keyof EmployeeAvailability,
    value: any,
  ) {
    const newSlots = [...props.modelValue];
    newSlots[index] = {
      ...newSlots[index],
      [field]: value,
    };
    emit("update:modelValue", newSlots);
  }
</script>
