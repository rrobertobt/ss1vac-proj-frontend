<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Mi perfil</h1>
        <p class="text-sm text-muted-foreground">
          Información de tu cuenta y preferencias.
        </p>
      </div>

      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <NuxtLink to="/app/dashboard">Volver al dashboard</NuxtLink>
        </Button>
        <Button variant="destructive" @click="sessionStore.logOut()">
          Cerrar sesión
        </Button>
      </div>
    </div>

    <!-- Estado: no autenticado -->
    <Card v-if="!user">
      <CardHeader>
        <CardTitle>Sesión no encontrada</CardTitle>
      </CardHeader>
      <CardContent class="text-sm text-muted-foreground space-y-3">
        <p>No hay información de sesión cargada. Inicia sesión nuevamente.</p>
        <Button as-child>
          <NuxtLink to="/login">Ir a login</NuxtLink>
        </Button>
      </CardContent>
    </Card>

    <template v-else>
      <!-- Resumen (top card) -->
      <Card>
        <CardHeader class="pb-3">
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div class="flex items-start gap-3">
              <!-- Avatar simple -->
              <div
                class="size-12 rounded-xl border bg-muted/40 flex items-center justify-center"
              >
                <span class="text-sm font-semibold text-muted-foreground">
                  {{ initials }}
                </span>
              </div>

              <div class="space-y-1">
                <CardTitle class="text-lg">
                  {{ displayName }}
                </CardTitle>
                <div
                  class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
                >
                  <span>{{ user.email }}</span>
                  <span class="hidden sm:inline">•</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full border bg-muted/40 text-foreground"
                  >
                    {{ roleLabelText }}
                  </span>
                </div>

                <div
                  class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
                >
                  <span>ID: {{ user.id }}</span>
                  <span>•</span>
                  <span>Usuario: {{ user.username }}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-4">
          <Separator />

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-xs font-medium text-muted-foreground"
                >Correo</label
              >
              <Input :model-value="user.email" disabled />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-medium text-muted-foreground"
                >Nombre de usuario</label
              >
              <Input :model-value="user.username" disabled />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-medium text-muted-foreground"
                >Rol</label
              >
              <Input :model-value="roleNameText" disabled />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-medium text-muted-foreground"
                >2FA</label
              >
              <div
                class="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div class="space-y-0.5">
                  <p class="text-sm font-medium">Autenticación de 2 factores</p>
                  <p class="text-xs text-muted-foreground">
                    Estado de seguridad de tu cuenta.
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-muted-foreground">
                    {{ user.twoFaEnabled ? "Activado" : "Desactivado" }}
                  </span>
                  <!-- Si tienes Switch de shadcn-vue, úsalo; si no, quita este componente -->
                  <!-- <Switch :checked="!!user.twoFaEnabled" disabled /> -->
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Tabs: detalles por tipo -->
      <Tabs default-value="details" class="w-full">
        <TabsList class="w-full max-w-xl">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <!-- Detalles -->
        <TabsContent value="details" class="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-base">Información del usuario</CardTitle>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground space-y-4">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <p class="text-xs text-muted-foreground">Rol asignado</p>
                  <p class="font-medium text-foreground">
                    {{ user.roleLabel ?? "—" }}
                  </p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <p class="text-xs text-muted-foreground">2FA</p>
                  <p class="font-medium text-foreground">
                    {{ user.twoFaEnabled ? "Activado" : "Desactivado" }}
                  </p>
                </div>
              </div>

              <!-- Si el backend manda patient/employee en sessionUser -->
              <Separator />

              <div class="grid gap-4 md:grid-cols-2">
                <Card class="border-border/60">
                  <CardHeader class="pb-2">
                    <CardTitle class="text-sm">Paciente</CardTitle>
                  </CardHeader>
                  <CardContent class="text-xs text-muted-foreground space-y-2">
                    <template v-if="user.patient">
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <p class="text-muted-foreground">Nombre</p>
                          <p class="font-medium text-foreground">
                            {{ user.patient.firstName }}
                            {{ user.patient.lastName }}
                          </p>
                        </div>
                        <div>
                          <p class="text-muted-foreground">Estado</p>
                          <p class="font-medium text-foreground">
                            {{ user.patient.status }}
                          </p>
                        </div>
                        <div>
                          <p class="text-muted-foreground">Teléfono</p>
                          <p class="font-medium text-foreground">
                            {{ user.patient.phone ?? "—" }}
                          </p>
                        </div>
                        <div>
                          <p class="text-muted-foreground">Fecha nacimiento</p>
                          <p class="font-medium text-foreground">
                            {{ patient.dob ?? "—" }}
                          </p>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <p>No aplica / no disponible en sesión.</p>
                    </template>
                  </CardContent>
                </Card>

                <Card class="border-border/60">
                  <CardHeader class="pb-2">
                    <CardTitle class="text-sm">Empleado</CardTitle>
                  </CardHeader>
                  <CardContent class="text-xs text-muted-foreground space-y-2">
                    <template v-if="user.employee">
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <p class="text-muted-foreground">Nombre</p>
                          <p class="font-medium text-foreground">
                            {{ user.employee.firstName }}
                            {{ user.employee.lastName }}
                          </p>
                        </div>
                        <div>
                          <p class="text-muted-foreground">Tipo</p>
                          <p class="font-medium text-foreground">
                            {{ user.employee.employeeType }}
                          </p>
                        </div>
                        <div>
                          <p class="text-muted-foreground">Estado</p>
                          <p class="font-medium text-foreground">
                            {{ user.employee.status }}
                          </p>
                        </div>
                        <div>
                          <p class="text-muted-foreground">ID empleado</p>
                          <p class="font-medium text-foreground">
                            {{ user.employee.id }}
                          </p>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <p>No aplica / no disponible en sesión.</p>
                    </template>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Seguridad -->
        <TabsContent value="security" class="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-base">Seguridad</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4 text-sm text-muted-foreground">
              <div class="rounded-lg border bg-muted/30 p-4 space-y-2">
                <p class="font-medium text-foreground">Cambiar contraseña</p>
                <p class="text-xs text-muted-foreground">
                  Ingresa tu contraseña actual y la nueva contraseña.
                </p>

                <form @submit.prevent="handleChangePassword" class="space-y-3">
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="space-y-2">
                      <label class="text-xs font-medium text-muted-foreground"
                        >Contraseña actual *</label
                      >
                      <Input
                        v-model="passwordForm.currentPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        :disabled="isChangingPassword"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-medium text-muted-foreground"
                        >Nueva contraseña *</label
                      >
                      <Input
                        v-model="passwordForm.newPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        minlength="8"
                        :disabled="isChangingPassword"
                      />
                      <p class="text-xs text-muted-foreground">
                        Mínimo 8 caracteres
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      @click="resetPasswordForm"
                      :disabled="isChangingPassword"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      :disabled="
                        isChangingPassword ||
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword
                      "
                    >
                      {{
                        isChangingPassword
                          ? "Actualizando..."
                          : "Actualizar contraseña"
                      }}
                    </Button>
                  </div>
                </form>
              </div>

              <div class="rounded-lg border bg-muted/30 p-4 space-y-2">
                <p class="font-medium text-foreground">
                  Autenticación de dos factores (2FA)
                </p>
                <p class="text-xs text-muted-foreground">
                  Tu cuenta actualmente tiene 2FA:
                  <span class="font-medium text-foreground">{{
                    user.twoFaEnabled ? "activado" : "desactivado"
                  }}</span
                  >.
                </p>

                <!-- Formulario de verificación 2FA -->
                <div
                  v-if="twoFaState.challengeId"
                  class="mt-3 space-y-3 rounded-lg border bg-card p-3"
                >
                  <p class="text-sm font-medium">
                    Ingresa el código de verificación
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Se ha enviado un código de 6 dígitos a tu correo
                    electrónico.
                  </p>

                  <form @submit.prevent="handleConfirm2fa" class="space-y-3">
                    <div class="space-y-2">
                      <label class="text-xs font-medium text-muted-foreground"
                        >Código de verificación *</label
                      >
                      <Input
                        v-model="twoFaState.code"
                        type="text"
                        required
                        maxlength="6"
                        pattern="[0-9]{6}"
                        :disabled="confirm2faMutation.isLoading.value"
                      />
                    </div>

                    <div class="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        @click="cancel2faFlow"
                        :disabled="confirm2faMutation.isLoading.value"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        :disabled="
                          confirm2faMutation.isLoading.value ||
                          twoFaState.code.length !== 6
                        "
                      >
                        {{
                          confirm2faMutation.isLoading.value
                            ? "Verificando..."
                            : "Verificar código"
                        }}
                      </Button>
                    </div>
                  </form>
                </div>

                <!-- Botones de acción -->
                <div v-else class="flex gap-2 pt-2">
                  <Button
                    v-if="!user.twoFaEnabled"
                    variant="default"
                    @click="handleEnable2fa"
                    :disabled="request2faMutation.isLoading.value"
                  >
                    {{
                      request2faMutation.isLoading.value
                        ? "Enviando código..."
                        : "Activar 2FA"
                    }}
                  </Button>
                  <Button
                    v-else
                    variant="outline"
                    @click="handleDisable2fa"
                    :disabled="request2faMutation.isLoading.value"
                  >
                    {{
                      request2faMutation.isLoading.value
                        ? "Enviando código..."
                        : "Desactivar 2FA"
                    }}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    // Asegura que use tu layout autenticado
    layout: "default",
  });

  import { computed, ref, reactive } from "vue";
  import { useSessionStore } from "@/stores/session"; // ajusta path si tu store está en otro lugar

  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { toast } from "vue-sonner";
  import { useMutation } from "@pinia/colada";
  import { profileApi } from "~/lib/api/profile";

  const sessionStore = useSessionStore();
  const user = computed(() => sessionStore.sessionUser);

  const displayName = computed(() => {
    return user.value?.patient
      ? user.value?.patient.first_name + " " + user.value?.patient.last_name
      : user.value?.employee
      ? user.value?.employee.first_name + " " + user.value?.employee.last_name
      : "Usuario";
  });

  const initials = computed(() => {
    const base = (user.value?.username || user.value?.email || "U").trim();
    const parts = base.split(/[.\s_-]+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  });

  const roleNameText = computed(() => user.value?.roleName ?? "—");
  const roleLabelText = computed(
    () => user.value?.roleLabel ?? user.value?.roleName ?? "Usuario",
  );

  function pretty(val: unknown) {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }

  // Estado para cambio de contraseña
  const passwordForm = reactive({
    currentPassword: "",
    newPassword: "",
  });

  const isChangingPassword = ref(false);

  function resetPasswordForm() {
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
  }

  async function handleChangePassword() {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    isChangingPassword.value = true;
    try {
      await profileApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Contraseña actualizada exitosamente");
      resetPasswordForm();
    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Error al cambiar la contraseña";
      toast.error(errorMessage);
    } finally {
      isChangingPassword.value = false;
    }
  }

  // =============================
  // 2FA Management
  // =============================
  const twoFaState = reactive({
    action: "" as "enable" | "disable" | "",
    challengeId: "",
    code: "",
  });

  // Mutation para solicitar código (enable o disable)
  const request2faMutation = useMutation({
    mutation: async (action: "enable" | "disable") => {
      if (action === "enable") {
        return await profileApi.requestEnable2fa();
      } else {
        return await profileApi.requestDisable2fa();
      }
    },
    onSuccess: (data, variables) => {
      twoFaState.action = variables;
      twoFaState.challengeId = data.challengeId;
      twoFaState.code = "";
      toast.success("Código de verificación enviado a tu correo electrónico");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || "Error al enviar código";
      toast.error(errorMessage);
    },
  });

  // Mutation para confirmar código (enable o disable)
  const confirm2faMutation = useMutation({
    mutation: async () => {
      if (twoFaState.action === "enable") {
        return await profileApi.confirmEnable2fa({
          challengeId: twoFaState.challengeId,
          code: twoFaState.code,
        });
      } else {
        return await profileApi.confirmDisable2fa({
          challengeId: twoFaState.challengeId,
          code: twoFaState.code,
        });
      }
    },
    onSuccess: async () => {
      const actionText =
        twoFaState.action === "enable" ? "activado" : "desactivado";
      toast.success(`2FA ${actionText} exitosamente`);

      // Recargar datos del usuario
      await sessionStore.recoverSession();

      // Limpiar estado
      cancel2faFlow();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || "Error al verificar código";
      toast.error(errorMessage);
    },
  });

  function handleEnable2fa() {
    request2faMutation.mutate("enable");
  }

  function handleDisable2fa() {
    request2faMutation.mutate("disable");
  }

  function handleConfirm2fa() {
    if (twoFaState.code.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }
    confirm2faMutation.mutate();
  }

  function cancel2faFlow() {
    try {
      twoFaState.action = "";
      twoFaState.challengeId = "";
      twoFaState.code = "";
    } finally {
      isChangingPassword.value = false;
    }
  }
</script>
