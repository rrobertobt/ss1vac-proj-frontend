<template>
  <h1 class="text-3xl font-bold mb-6">Gestión de Áreas y Especialidades</h1>

  <div class="mb-6 space-x-3">
    <Dialog v-model:open="dialogs.areaOpen">
      <DialogTrigger as-child>
        <Button>
          Crear Area
          <Icon name="lucide:plus" class="inline" />
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear/Editar Área</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleCreateArea">
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label
                for="name"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Nombre</label
              >
              <Input
                v-model="areaData.name"
                id="name"
                type="text"
                class="bg-background border border-input px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div class="grid gap-2">
              <label
                for="description"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Descripción</label
              >
              <Input
                v-model="areaData.description"
                id="description"
                type="text"
                class="bg-background border border-input px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <Dialog v-model:open="dialogs.specialtyOpen">
      <DialogTrigger as-child>
        <Button>
          Crear Especialidad
          <Icon name="lucide:plus" class="inline" />
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear/Editar Especialidad</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleCreateSpecialty">
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label
                for="name"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Nombre</label
              >
              <Input
                v-model="specialtyData.name"
                id="name"
                type="text"
                class="bg-background border border-input px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div class="grid gap-2">
              <label
                for="description"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Descripción</label
              >
              <Input
                v-model="specialtyData.description"
                id="description"
                type="text"
                class="bg-background border border-input px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>

  <section>
    <h2
      class="font-semibold tracking-wider text-muted-foreground uppercase mb-4"
    >
      Áreas
    </h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class=""> #ID </TableHead>
          <TableHead class="w-[100px]"> Nombre </TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Creación</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="area in areasData" :key="area.id">
          <TableCell>{{ area.id }}</TableCell>
          <TableCell class="font-medium">
            {{ area.name }}
          </TableCell>
          <TableCell>{{ area.description }}</TableCell>
          <TableCell>{{ area.created_at }}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              class="mr-2"
              @click="
                handleOpenEditArea(area);
                dialogs.areaOpen = true;
              "
            >
              Editar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                ><Button variant="destructive" size="sm">
                  Eliminar
                </Button></AlertDialogTrigger
              >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle
                    >¿Estás seguro de eliminar este área?</AlertDialogTitle
                  >
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="handleDeleteArea(area.id)"
                    >Continue</AlertDialogAction
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
        <TableRow v-if="!areasData || areasData.length === 0">
          <TableCell colspan="5" class="text-center py-4">
            No hay áreas disponibles.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </section>
  <section>
    <h2
      class="font-semibold tracking-wider text-muted-foreground uppercase my-4"
    >
      Especialidades
    </h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class=""> #ID </TableHead>
          <TableHead class="w-[100px]"> Nombre </TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Creación</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="specialty in specialtiesData" :key="specialty.id">
          <TableCell>{{ specialty.id }}</TableCell>
          <TableCell class="font-medium">
            {{ specialty.name }}
          </TableCell>
          <TableCell>{{ specialty.description }}</TableCell>
          <TableCell>{{ specialty.created_at }}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              class="mr-2"
              @click="
                handleOpenEditSpecialty(specialty);
                dialogs.specialtyOpen = true;
              "
            >
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                ><Button variant="destructive" size="sm">
                  Eliminar
                </Button></AlertDialogTrigger
              >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle
                    >¿Estás seguro de eliminar esta
                    especialidad?</AlertDialogTitle
                  >
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    @click="handleDeleteSpecialty(specialty.id)"
                    >Continue</AlertDialogAction
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
        <TableRow v-if="!specialtiesData || specialtiesData.length === 0">
          <TableCell colspan="5" class="text-center py-4">
            No hay especialidades disponibles.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </section>
</template>
<script setup lang="tsx">
  import { areasApi } from "~/lib/api/areas";
  import { specialtiesApi } from "~/lib/api/specialties";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
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
  import { Input } from "~/components/ui/input";
  import { toast } from "vue-sonner";

  const {
    data: areasData,
    pending: areasPending,
    refresh: refreshAreas,
  } = useAsyncData<any>(() => areasApi.list(), {
    lazy: true,
  });

  const {
    data: specialtiesData,
    pending: specialtiesPending,
    refresh: refreshSpecialties,
  } = useAsyncData<any>(() => specialtiesApi.list(), {
    lazy: true,
  });

  const dialogs = reactive({
    areaOpen: false,
    specialtyOpen: false,
  });

  const areaData = reactive({
    name: "",
    description: "",
  });

  const specialtyData = reactive({
    name: "",
    description: "",
  });

  const handleCreateArea = async () => {
    try {
      await areasApi.create(areaData);
      await refreshAreas();
      toast.success("Área creada exitosamente.");
      dialogs.areaOpen = false;
    } catch (error) {
      toast.error("Error al crear el área.", {
        description: error.data?.message?.join(", ") || "",
      });
    } finally {
      areaData.name = "";
      areaData.description = "";
    }
  };
  const handleCreateSpecialty = async () => {
    try {
      await specialtiesApi.create(specialtyData);
      await refreshSpecialties();
      toast.success("Especialidad creada exitosamente.");
      dialogs.specialtyOpen = false;
    } catch (error) {
      toast.error("Error al crear la especialidad.", {
        description: error.data?.message?.join(", ") || "",
      });
    } finally {
      specialtyData.name = "";
      specialtyData.description = "";
    }
  };

  const handleDeleteArea = async (id: number) => {
    try {
      await areasApi.delete(id);
      await refreshAreas();
      toast.success("Área eliminada exitosamente.");
    } catch (error) {
      toast.error("Error al eliminar el área.", {
        description: error.data?.message,
      });
    }
  };
  const handleDeleteSpecialty = async (id: number) => {
    try {
      await specialtiesApi.delete(id);
      await refreshSpecialties();
      toast.success("Especialidad eliminada exitosamente.");
    } catch (error) {
      toast.error("Error al eliminar la especialidad.", {
        description: error.data?.message,
      });
    }
  };

  const handleOpenEditArea = (area: any) => {
    areaData.name = area.name;
    areaData.description = area.description;
  };
  const handleOpenEditSpecialty = (specialty: any) => {
    specialtyData.name = specialty.name;
    specialtyData.description = specialty.description;
  };
</script>
<style scoped></style>
