<template>
  <div class="min-h-screen grid place-items-center bg-cover bg-center">
    <Card class="w-full max-w-md bg-white/90 backdrop-blur-md">
      <CardHeader>
        <div class="text-center flex flex-col gap-3">
          <Icon name="lucide:lock-keyhole" class="mx-auto" size="32" />
          <CardTitle class="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription v-if="!requires2FA">
            Ingresa tus credenciales para continuar
          </CardDescription>
          <CardDescription v-else class="space-y-1">
            <p>Hemos enviado un código de verificación a tu correo</p>
            <p class="text-sm">
              Revisa tu bandeja de entrada e ingresa el código
            </p>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <!-- Formulario de 2FA -->
        <form
          v-if="requires2FA"
          @submit.prevent="handleVerify2FA"
          class="space-y-4"
        >
          <div class="space-y-2">
            <label for="code" class="text-sm font-medium"
              >Código de verificación</label
            >
            <Input
              id="code"
              v-model="code2FA"
              type="text"
              placeholder="Ingresa el código de 6 dígitos"
              maxlength="6"
              class="text-center text-lg tracking-widest font-mono"
              :disabled="loading2fa"
            />
          </div>
          <Button
            type="submit"
            class="w-full"
            :disabled="loading2fa || code2FA.length !== 6"
          >
            <Icon
              v-if="loading2fa"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ loading2fa ? "Verificando..." : "Verificar código" }}
          </Button>
        </form>

        <!-- Formulario de login -->
        <form v-else @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label for="emailOrUsername" class="text-sm font-medium">
              Email o Usuario
            </label>
            <Input
              id="emailOrUsername"
              v-model="credentials.emailOrUsername"
              type="text"
              placeholder="tu@email.com o usuario"
              required
              :disabled="loadingLogin"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Contraseña</label>
            <Input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="loadingLogin"
            />
          </div>

          <Button type="submit" class="w-full" :disabled="loadingLogin">
            <Icon
              v-if="loadingLogin"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <Icon v-else name="lucide:arrow-right" class="mr-2 h-4 w-4" />
            {{ loadingLogin ? "Iniciando sesión..." : "Continuar" }}
          </Button>

          <div class="text-center">
            <NuxtLink
              to="/forgot-password"
              class="text-sm text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import { useSessionStore } from "~/stores/session";
  import { storeToRefs } from "pinia";
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

  const sessionStore = useSessionStore();
  const { loadingLogin, loading2fa } = storeToRefs(sessionStore);
  const { login, verify2FA } = sessionStore;

  const credentials = reactive({
    emailOrUsername: "",
    password: "",
  });

  const code2FA = ref("");
  const requires2FA = ref(false);

  async function handleLogin() {
    if (!credentials.emailOrUsername || !credentials.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const loginResult = await login(credentials);

    if (loginResult.error) {
      toast.error(loginResult.message || "Error al iniciar sesión");
      return;
    }

    if (loginResult.twoFaRequired) {
      requires2FA.value = true;
      toast.success("Código enviado. Revisa tu correo electrónico");
    } else {
      toast.success("Has iniciado sesión correctamente");
    }
  }

  async function handleVerify2FA() {
    if (code2FA.value.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    const verifyResult = await verify2FA(code2FA.value);

    if (verifyResult.error) {
      toast.error(verifyResult.message || "Error al verificar el código");
      return;
    }

    toast.success("Has iniciado sesión correctamente");
  }

  definePageMeta({
    layout: "empty",
  });
</script>

<style scoped>
  @reference '~/assets/css/tailwind.css';
</style>
