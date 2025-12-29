<template>
  <div>
    <div class="mb-6">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink :to="`/app/patients/${patientId}`">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Volver al Paciente
        </NuxtLink>
      </Button>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Tareas del Paciente</h1>
          <p class="text-muted-foreground mt-1">
            Paciente ID #{{ patientId }}
          </p>
        </div>
        <Button as-child>
          <NuxtLink :to="`/app/patients/${patientId}/tasks/create`">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Nueva Tarea
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
          <p class="text-red-500">Error al cargar las tareas</p>
          <p class="text-sm text-muted-foreground mt-2">{{ error.message }}</p>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="tasks && tasks.length === 0" class="text-center py-12">
      <Card>
        <CardContent class="pt-6">
          <Icon name="lucide:clipboard-list" class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">No hay tareas asignadas</h3>
          <p class="text-muted-foreground mb-6">
            Comienza asignando la primera tarea al paciente
          </p>
          <Button as-child>
            <NuxtLink :to="`/app/patients/${patientId}/tasks/create`">
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Crear Primera Tarea
            </NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </div>

    <div v-else class="space-y-4">
      <!-- Tabs por estado -->
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Todas ({{ tasks?.length || 0 }})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendientes ({{ tasksByStatus.PENDING.length }})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            En Progreso ({{ tasksByStatus.IN_PROGRESS.length }})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas ({{ tasksByStatus.COMPLETED.length }})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" class="space-y-3 mt-4">
          <TaskCard
            v-for="task in sortedTasks"
            :key="task.id"
            :task="task"
            :patient-id="patientId"
          />
        </TabsContent>

        <TabsContent value="pending" class="space-y-3 mt-4">
          <TaskCard
            v-for="task in tasksByStatus.PENDING"
            :key="task.id"
            :task="task"
            :patient-id="patientId"
          />
          <div v-if="tasksByStatus.PENDING.length === 0" class="text-center py-8 text-muted-foreground">
            No hay tareas pendientes
          </div>
        </TabsContent>

        <TabsContent value="in_progress" class="space-y-3 mt-4">
          <TaskCard
            v-for="task in tasksByStatus.IN_PROGRESS"
            :key="task.id"
            :task="task"
            :patient-id="patientId"
          />
          <div v-if="tasksByStatus.IN_PROGRESS.length === 0" class="text-center py-8 text-muted-foreground">
            No hay tareas en progreso
          </div>
        </TabsContent>

        <TabsContent value="completed" class="space-y-3 mt-4">
          <TaskCard
            v-for="task in tasksByStatus.COMPLETED"
            :key="task.id"
            :task="task"
            :patient-id="patientId"
          />
          <div v-if="tasksByStatus.COMPLETED.length === 0" class="text-center py-8 text-muted-foreground">
            No hay tareas completadas
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { getPatientTasks, type PatientTaskResponse } from "~/lib/api/patient-tasks";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icon } from "#components";
import { NuxtLink } from "#components";

const route = useRoute();
const patientId = computed(() => Number(route.params.id));

const {
  data: tasks,
  pending,
  error,
  refresh: refreshTasks,
} = await useAsyncData<PatientTaskResponse[]>(
  `patient-tasks-${patientId.value}`,
  () => getPatientTasks(patientId.value),
);

const activeTab = ref("all");

const sortedTasks = computed(() => {
  if (!tasks.value) return [];
  return [...tasks.value].sort((a, b) => {
    // Primero por estado: PENDING > IN_PROGRESS > COMPLETED > CANCELLED
    const statusOrder = { PENDING: 0, IN_PROGRESS: 1, COMPLETED: 2, CANCELLED: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Luego por fecha de vencimiento (las más cercanas primero)
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    
    // Por último por fecha de creación (más recientes primero)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

const tasksByStatus = computed(() => {
  if (!tasks.value) return { PENDING: [], IN_PROGRESS: [], COMPLETED: [], CANCELLED: [] };
  
  return {
    PENDING: tasks.value.filter(t => t.status === "PENDING"),
    IN_PROGRESS: tasks.value.filter(t => t.status === "IN_PROGRESS"),
    COMPLETED: tasks.value.filter(t => t.status === "COMPLETED"),
    CANCELLED: tasks.value.filter(t => t.status === "CANCELLED"),
  };
});

// Componente TaskCard
const TaskCard = defineComponent({
  props: {
    task: { type: Object as PropType<PatientTaskResponse>, required: true },
    patientId: { type: Number, required: true },
  },
  setup(props) {
    const getStatusConfig = (status: string) => {
      const configs = {
        PENDING: { variant: "secondary" as const, label: "Pendiente", icon: "lucide:clock" },
        IN_PROGRESS: { variant: "default" as const, label: "En Progreso", icon: "lucide:loader-2" },
        COMPLETED: { variant: "outline" as const, label: "Completada", icon: "lucide:check-circle" },
        CANCELLED: { variant: "destructive" as const, label: "Cancelada", icon: "lucide:x-circle" },
      };
      return configs[status] || configs.PENDING;
    };

    const isOverdue = computed(() => {
      if (!props.task.due_date || props.task.status === "COMPLETED") return false;
      return new Date(props.task.due_date) < new Date();
    });

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("es-GT", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return () => {
      const statusConfig = getStatusConfig(props.task.status);
      
      return (
        <Card class={isOverdue.value ? "border-red-300 bg-red-50/50" : ""}>
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <CardTitle class="text-lg mb-2 flex items-center gap-2">
                  <Icon name={statusConfig.icon} class="h-5 w-5" />
                  {props.task.title}
                </CardTitle>
                {props.task.description && (
                  <p class="text-sm text-muted-foreground whitespace-pre-wrap">
                    {props.task.description}
                  </p>
                )}
              </div>
              <div class="flex items-center gap-2 ml-4">
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon name="lucide:more-vertical" class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <NuxtLink to={`/app/patients/${props.patientId}/tasks/${props.task.id}/edit`}>
                        <Icon name="lucide:edit" class="mr-2 h-4 w-4" />
                        Editar
                      </NuxtLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent class="pt-0">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {props.task.due_date && (
                <div>
                  <Label class="text-muted-foreground text-xs">Fecha de vencimiento</Label>
                  <p class={isOverdue.value ? "text-red-600 font-medium" : ""}>
                    {formatDate(props.task.due_date)}
                    {isOverdue.value && " ⚠️"}
                  </p>
                </div>
              )}
              {props.task.assigned_by && (
                <div>
                  <Label class="text-muted-foreground text-xs">Asignada por</Label>
                  <p>{props.task.assigned_by.first_name} {props.task.assigned_by.last_name}</p>
                </div>
              )}
              {props.task.clinical_record && (
                <div>
                  <Label class="text-muted-foreground text-xs">Historia Clínica</Label>
                  <p class="font-mono text-xs">{props.task.clinical_record.record_number || `#${props.task.clinical_record.id}`}</p>
                </div>
              )}
              {props.task.completed_at && (
                <div>
                  <Label class="text-muted-foreground text-xs">Completada el</Label>
                  <p>{formatDate(props.task.completed_at)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    };
  },
});
</script>
