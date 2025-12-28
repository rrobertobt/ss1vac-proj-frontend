<template>
  <div class="min-h-screen grid place-items-center bg-cover bg-center">
    <Card class="w-full max-w-md bg-white/90 backdrop-blur-md">
      <CardHeader>
        <div class="text-center flex flex-col gap-3">
          <Icon name="lucide:shield-check" class="mx-auto" size="32" />
          <CardTitle class="text-2xl">Restablecer contraseña</CardTitle>
          <CardDescription class="space-y-1">
            <p>Ingresa el código que enviamos a tu correo</p>
            <p v-if="emailFromQuery" class="text-sm font-medium">
              {{ emailFromQuery }}
            </p>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2" v-if="!emailFromQuery">
            <label for="email" class="text-sm font-medium">
              Correo electrónico
            </label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              required
              :disabled="loading"
            />
          </div>

          <div class="space-y-2">
            <label for="code" class="text-sm font-medium">
              Código de verificación
            </label>
            <Input
              id="code"
              v-model="code"
              type="text"
              placeholder="Ingresa el código de 6 dígitos"
              maxlength="6"
              class="text-center text-lg tracking-widest font-mono"
              required
              :disabled="loading"
            />
          </div>

          <div class="space-y-2">
            <label for="newPassword" class="text-sm font-medium">
              Nueva contraseña
            </label>
            <Input
              id="newPassword"
              v-model="newPassword"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              :disabled="loading"
            />
          </div>

          <div class="space-y-2">
            <label for="confirmPassword" class="text-sm font-medium">
              Confirmar contraseña
            </label>
            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirma tu nueva contraseña"
              required
              :disabled="loading"
            />
          </div>

          <Button
            type="submit"
            class="w-full"
            :disabled="loading || !isFormValid"
          >
            <Icon
              v-if="loading"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <Icon v-else name="lucide:check" class="mr-2 h-4 w-4" />
            {{ loading ? "Restableciendo..." : "Restablecer contraseña" }}
          </Button>

          <div class="text-center space-y-2">
            <div>
              <NuxtLink
                to="/forgot-password"
                class="text-sm text-primary hover:underline"
              >
                ¿No recibiste el código? Reenviar
              </NuxtLink>
            </div>
            <div>
              <NuxtLink
                to="/login"
                class="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                <Icon name="lucide:arrow-left" class="h-4 w-4" />
                Volver al inicio de sesión
              </NuxtLink>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "~/components/ui/card";
  import { Input } from "~/components/ui/input";
  import { Button } from "~/components/ui/button";
  import { toast } from "vue-sonner";
  import { authApi } from "~/lib/api/auth";

  const route = useRoute();
  const router = useRouter();

  const emailFromQuery = ref(route.query.email?.toString() || "");
  const email = ref(emailFromQuery.value);
  const code = ref("");
  const newPassword = ref("");
  const confirmPassword = ref("");
  const loading = ref(false);

  const isFormValid = computed(() => {
    const hasEmail = email.value || emailFromQuery.value;
    const hasCode = code.value.length === 6;
    const hasPassword = newPassword.value.length >= 8;
    const passwordsMatch = newPassword.value === confirmPassword.value;

    return hasEmail && hasCode && hasPassword && passwordsMatch;
  });

  async function handleSubmit() {
    const finalEmail = emailFromQuery.value || email.value;

    if (!finalEmail) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    if (code.value.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    if (newPassword.value.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    loading.value = true;

    try {
      const response = await authApi.resetPassword({
        email: finalEmail,
        code: code.value,
        newPassword: newPassword.value,
      });

      toast.success(
        response.message || "Contraseña restablecida exitosamente",
      );

      // Redirigir al login después de 1.5 segundos
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      toast.error(
        error.data?.message || "Error al restablecer la contraseña",
      );
    } finally {
      loading.value = false;
    }
  }

  definePageMeta({
    layout: "empty",
  });
</script>

<style scoped>
  @reference "~/assets/css/tailwind.css";
</style>
