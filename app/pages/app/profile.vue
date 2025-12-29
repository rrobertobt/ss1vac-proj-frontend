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
                    {{ user.two_fa_enabled ? "Activado" : "Desactivado" }}
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
          <TabsTrigger v-if="isPatient" value="edit">Editar perfil</TabsTrigger>
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
                    {{ user.role_label ?? "—" }}
                  </p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <p class="text-xs text-muted-foreground">2FA</p>
                  <p class="font-medium text-foreground">
                    {{ user.two_fa_enabled ? "Activado" : "Desactivado" }}
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
                            {{ user.patient.dob ?? "—" }}
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
                            {{ user.employee.first_name }}
                            {{ user.employee.last_name }}
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

        <!-- Editar perfil (solo pacientes) -->
        <TabsContent v-if="isPatient" value="edit" class="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-base">Editar mi perfil</CardTitle>
              <p class="text-sm text-muted-foreground">
                Actualiza tu información personal. Los campos de nombre no se pueden modificar.
              </p>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                <!-- Información básica -->
                <div class="space-y-4">
                  <h3 class="text-sm font-semibold">Información básica</h3>
                  
                  <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="edit-username">Nombre de usuario</Label>
                      <Input
                        id="edit-username"
                        v-model="profileForm.username"
                        type="text"
                        minlength="3"
                        maxlength="100"
                        :disabled="isUpdatingProfile"
                      />
                    </div>

                    <div class="space-y-2">
                      <Label for="edit-phone">Teléfono</Label>
                      <Input
                        id="edit-phone"
                        v-model="profileForm.phone"
                        type="text"
                        placeholder="+502 1234-5678"
                        :disabled="isUpdatingProfile"
                      />
                    </div>

                    <div class="space-y-2">
                      <Label for="edit-email">Email personal</Label>
                      <Input
                        id="edit-email"
                        v-model="profileForm.email"
                        type="email"
                        placeholder="tu@email.com"
                        :disabled="isUpdatingProfile"
                      />
                    </div>

                    <div class="space-y-2">
                      <Label for="edit-gender">Género</Label>
                      <Select
                        v-model="profileForm.gender"
                        :disabled="isUpdatingProfile"
                      >
                        <SelectTrigger id="edit-gender">
                          <SelectValue placeholder="Selecciona género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="O">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="edit-address">Dirección</Label>
                    <Textarea
                      id="edit-address"
                      v-model="profileForm.address"
                      placeholder="Tu dirección completa"
                      :disabled="isUpdatingProfile"
                      rows="2"
                    />
                  </div>
                </div>

                <Separator />

                <!-- Información adicional -->
                <div class="space-y-4">
                  <h3 class="text-sm font-semibold">Información adicional</h3>
                  
                  <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="edit-marital">Estado civil</Label>
                      <Select
                        v-model="profileForm.marital_status"
                        :disabled="isUpdatingProfile"
                      >
                        <SelectTrigger id="edit-marital">
                          <SelectValue placeholder="Selecciona estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE">Soltero/a</SelectItem>
                          <SelectItem value="MARRIED">Casado/a</SelectItem>
                          <SelectItem value="DIVORCED">Divorciado/a</SelectItem>
                          <SelectItem value="WIDOWED">Viudo/a</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div class="space-y-2">
                      <Label for="edit-occupation">Ocupación</Label>
                      <Input
                        id="edit-occupation"
                        v-model="profileForm.occupation"
                        type="text"
                        placeholder="Ej: Ingeniero, Estudiante"
                        :disabled="isUpdatingProfile"
                      />
                    </div>

                    <div class="space-y-2">
                      <Label for="edit-education">Nivel de educación</Label>
                      <Select
                        v-model="profileForm.education_level"
                        :disabled="isUpdatingProfile"
                      >
                        <SelectTrigger id="edit-education">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIMARY">Primaria</SelectItem>
                          <SelectItem value="SECONDARY">Secundaria</SelectItem>
                          <SelectItem value="HIGH_SCHOOL">Bachillerato</SelectItem>
                          <SelectItem value="UNIVERSITY">Universidad</SelectItem>
                          <SelectItem value="POSTGRADUATE">Posgrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <!-- Contacto de emergencia -->
                <div class="space-y-4">
                  <h3 class="text-sm font-semibold">Contacto de emergencia</h3>
                  
                  <div class="grid gap-4 md:grid-cols-3">
                    <div class="space-y-2">
                      <Label for="edit-emergency-name">Nombre completo</Label>
                      <Input
                        id="edit-emergency-name"
                        v-model="profileForm.emergency_contact_name"
                        type="text"
                        placeholder="Nombre del contacto"
                        :disabled="isUpdatingProfile"
                      />
                    </div>

                    <div class="space-y-2">
                      <Label for="edit-emergency-relationship">Relación</Label>
                      <Input
                        id="edit-emergency-relationship"
                        v-model="profileForm.emergency_contact_relationship"
                        type="text"
                        placeholder="Ej: Madre, Esposo/a"
                        :disabled="isUpdatingProfile"
                      />
                    </div>

                    <div class="space-y-2">
                      <Label for="edit-emergency-phone">Teléfono</Label>
                      <Input
                        id="edit-emergency-phone"
                        v-model="profileForm.emergency_contact_phone"
                        type="text"
                        placeholder="+502 9876-5432"
                        :disabled="isUpdatingProfile"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <!-- Botones de acción -->
                <div class="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    @click="resetProfileForm"
                    :disabled="isUpdatingProfile"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    :disabled="isUpdatingProfile"
                  >
                    {{ isUpdatingProfile ? 'Actualizando...' : 'Guardar cambios' }}
                  </Button>
                </div>
              </form>
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
                    user.two_fa_enabled ? "activado" : "desactivado"
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
                    v-if="!user.two_fa_enabled"
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

  import { computed, ref, reactive, watchEffect } from "vue";
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
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
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

  const roleNameText = computed(() => user.value?.role_label ?? "—");
  const roleLabelText = computed(
    () => user.value?.role_label ?? user.value?.role_name ?? "Usuario",
  );

  const isPatient = computed(() => user.value?.role_name === 'PATIENT');

  // Estado para edición de perfil (pacientes)
  const profileForm = reactive({
    username: '',
    phone: '',
    email: '',
    address: '',
    gender: '',
    marital_status: '',
    occupation: '',
    education_level: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
  });

  const isUpdatingProfile = ref(false);

  function initializeProfileForm() {
    if (!user.value?.patient) return;
    
    profileForm.username = user.value.username || '';
    profileForm.phone = user.value.patient.phone || '';
    profileForm.email = user.value.patient.email || '';
    profileForm.address = user.value.patient.address || '';
    profileForm.gender = user.value.patient.gender || '';
    profileForm.marital_status = user.value.patient.marital_status || '';
    profileForm.occupation = user.value.patient.occupation || '';
    profileForm.education_level = user.value.patient.education_level || '';
    profileForm.emergency_contact_name = user.value.patient.emergency_contact_name || '';
    profileForm.emergency_contact_relationship = user.value.patient.emergency_contact_relationship || '';
    profileForm.emergency_contact_phone = user.value.patient.emergency_contact_phone || '';
  }

  function resetProfileForm() {
    initializeProfileForm();
  }

  async function handleUpdateProfile() {
    if (!user.value?.patient) {
      toast.error('Solo los pacientes pueden actualizar su perfil');
      return;
    }

    isUpdatingProfile.value = true;
    try {
      // Solo enviar campos que no estén vacíos
      const payload: any = {};
      
      if (profileForm.username !== user.value.username) {
        payload.username = profileForm.username;
      }
      if (profileForm.phone) payload.phone = profileForm.phone;
      if (profileForm.email) payload.email = profileForm.email;
      if (profileForm.address) payload.address = profileForm.address;
      if (profileForm.gender) payload.gender = profileForm.gender;
      if (profileForm.marital_status) payload.marital_status = profileForm.marital_status;
      if (profileForm.occupation) payload.occupation = profileForm.occupation;
      if (profileForm.education_level) payload.education_level = profileForm.education_level;
      if (profileForm.emergency_contact_name) payload.emergency_contact_name = profileForm.emergency_contact_name;
      if (profileForm.emergency_contact_relationship) payload.emergency_contact_relationship = profileForm.emergency_contact_relationship;
      if (profileForm.emergency_contact_phone) payload.emergency_contact_phone = profileForm.emergency_contact_phone;

      await profileApi.updateProfile(payload);

      toast.success('Perfil actualizado exitosamente');
      
      // Recargar datos del usuario
      await sessionStore.recoverSession();
      
      // Re-inicializar el formulario con los nuevos datos
      initializeProfileForm();
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      isUpdatingProfile.value = false;
    }
  }

  // Inicializar el formulario cuando se carga el componente
  watchEffect(() => {
    if (user.value?.patient) {
      initializeProfileForm();
    }
  });

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
