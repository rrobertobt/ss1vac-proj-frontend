<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Mis Tareas</h1>
      <p class="text-muted-foreground mt-1">
        Revisa y gestiona las tareas asignadas por tu profesional
      </p>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <Card>
        <CardContent class="pt-6">
          <Icon
            name="lucide:alert-circle"
            class="h-12 w-12 text-red-500 mx-auto mb-4"
          />
          <p class="text-red-500">Error al cargar tus tareas</p>
          <p class="text-sm text-muted-foreground mt-2">{{ error.message }}</p>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="tasks && tasks.length === 0" class="text-center py-12">
      <Card>
        <CardContent class="pt-6">
          <Icon
            name="lucide:clipboard-check"
            class="h-16 w-16 text-muted-foreground mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold mb-2">No tienes tareas asignadas</h3>
          <p class="text-muted-foreground">
            Cuando tu profesional te asigne tareas, aparecerán aquí
          </p>
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
          <TaskCard v-for="task in sortedTasks" :key="task.id" :task="task" />
        </TabsContent>

        <TabsContent value="pending" class="space-y-3 mt-4">
          <TaskCard
            v-for="task in tasksByStatus.PENDING"
            :key="task.id"
            :task="task"
          />
          <div
            v-if="tasksByStatus.PENDING.length === 0"
            class="text-center py-8 text-muted-foreground"
          >
            No hay tareas pendientes
          </div>
        </TabsContent>

        <TabsContent value="in_progress" class="space-y-3 mt-4">
          <TaskCard
            v-for="task in tasksByStatus.IN_PROGRESS"
            :key="task.id"
            :task="task"
          />
          <div
            v-if="tasksByStatus.IN_PROGRESS.length === 0"
            class="text-center py-8 text-muted-foreground"
          >
            No hay tareas en progreso
          </div>
        </TabsContent>

        <TabsContent value="completed" class="space-y-3 mt-4">
          <TaskCard
            v-for="task in tasksByStatus.COMPLETED"
            :key="task.id"
            :task="task"
          />
          <div
            v-if="tasksByStatus.COMPLETED.length === 0"
            class="text-center py-8 text-muted-foreground"
          >
            No hay tareas completadas
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="tsx">
  import {
    getMyTasks,
    updatePatientTask,
    type PatientTaskResponse,
  } from "~/lib/api/patient-tasks";
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { Badge } from "~/components/ui/badge";
  import { Label } from "~/components/ui/label";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "~/components/ui/tabs";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "~/components/ui/alert-dialog";
  import { Icon } from "#components";

  import { toast } from "vue-sonner";

  const {
    data: tasks,
    pending,
    error,
    refresh: refreshTasks,
  } = await useAsyncData<PatientTaskResponse[]>("my-tasks", () => getMyTasks());

  const activeTab = ref("all");

  const sortedTasks = computed(() => {
    if (!tasks.value) return [];
    return [...tasks.value].sort((a, b) => {
      // Primero por estado: PENDING > IN_PROGRESS > COMPLETED > CANCELLED
      const statusOrder = {
        PENDING: 0,
        IN_PROGRESS: 1,
        COMPLETED: 2,
        CANCELLED: 3,
      };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Luego por fecha de vencimiento (las más cercanas primero)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;

      // Por último por fecha de creación (más recientes primero)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  });

  const tasksByStatus = computed(() => {
    if (!tasks.value)
      return { PENDING: [], IN_PROGRESS: [], COMPLETED: [], CANCELLED: [] };

    return {
      PENDING: tasks.value.filter((t) => t.status === "PENDING"),
      IN_PROGRESS: tasks.value.filter((t) => t.status === "IN_PROGRESS"),
      COMPLETED: tasks.value.filter((t) => t.status === "COMPLETED"),
      CANCELLED: tasks.value.filter((t) => t.status === "CANCELLED"),
    };
  });


  async function markAsCompleted(taskId: number) {
    try {
      await updatePatientTask(taskId, { status: "COMPLETED" });
      toast({
        title: "¡Felicitaciones!",
        description: "Has completado esta tarea",
      });
      await refreshTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la tarea",
        variant: "destructive",
      });
    }
  }

  // Componente TaskCard
  const TaskCard = defineComponent({
    props: {
      task: { type: Object as PropType<PatientTaskResponse>, required: true },
    },
    setup(props) {
      const getStatusConfig = (status: string) => {
        const configs = {
          PENDING: {
            variant: "secondary" as const,
            label: "Pendiente",
            icon: "lucide:clock",
            color: "text-yellow-600",
          },
          IN_PROGRESS: {
            variant: "default" as const,
            label: "En Progreso",
            icon: "lucide:loader-2",
            color: "text-blue-600",
          },
          COMPLETED: {
            variant: "outline" as const,
            label: "Completada",
            icon: "lucide:check-circle",
            color: "text-green-600",
          },
          CANCELLED: {
            variant: "destructive" as const,
            label: "Cancelada",
            icon: "lucide:x-circle",
            color: "text-red-600",
          },
        };
        return configs[status] || configs.PENDING;
      };

      const isOverdue = computed(() => {
        if (!props.task.due_date || props.task.status === "COMPLETED")
          return false;
        return new Date(props.task.due_date) < new Date();
      });

      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-GT", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      return () => {
        const statusConfig = getStatusConfig(props.task.status);
        const canMarkInProgress = props.task.status === "PENDING";
        const canMarkCompleted =
          props.task.status === "PENDING" ||
          props.task.status === "IN_PROGRESS";

        return (
          <Card class={isOverdue.value ? "border-red-300 bg-red-50/50" : ""}>
            <CardHeader>
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <CardTitle class="text-lg mb-2 flex items-center gap-2">
                    <Icon
                      name={statusConfig.icon}
                      class={`h-5 w-5 ${statusConfig.color}`}
                    />
                    {props.task.title}
                  </CardTitle>
                  {props.task.description && (
                    <p class="text-sm text-muted-foreground whitespace-pre-wrap">
                      {props.task.description}
                    </p>
                  )}
                </div>
                <Badge variant={statusConfig.variant}>
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {props.task.due_date && (
                  <div>
                    <Label class="text-muted-foreground text-xs">
                      Fecha límite
                    </Label>
                    <p
                      class={
                        isOverdue.value
                          ? "text-red-600 font-medium flex items-center gap-1"
                          : ""
                      }
                    >
                      {isOverdue.value && (
                        <Icon name="lucide:alert-triangle" class="h-4 w-4" />
                      )}
                      {formatDate(props.task.due_date)}
                    </p>
                  </div>
                )}
                {props.task.assigned_by && (
                  <div>
                    <Label class="text-muted-foreground text-xs">
                      Asignada por
                    </Label>
                    <p>
                      {props.task.assigned_by.first_name}{" "}
                      {props.task.assigned_by.last_name}
                    </p>
                  </div>
                )}
                {props.task.completed_at && (
                  <div>
                    <Label class="text-muted-foreground text-xs">
                      Completada el
                    </Label>
                    <p>{formatDate(props.task.completed_at)}</p>
                  </div>
                )}
              </div>

              {(canMarkInProgress || canMarkCompleted) && (
                <div class="flex gap-2 pt-2 border-t">
                  {canMarkCompleted && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm">
                          <Icon name="lucide:check" class="mr-2 h-4 w-4" />
                          Marcar como completada
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Completar tarea?</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro que has completado esta tarea? Esta
                            acción le notificará a tu profesional.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => markAsCompleted(props.task.id)}
                          >
                            Sí, completar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      };
    },
  });
</script>
