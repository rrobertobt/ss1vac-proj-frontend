<template>
  <div class="min-h-screen grid place-items-center bg-cover bg-center">
    <Card class="w-full max-w-md bg-white/90 backdrop-blur-md">
      <CardHeader>
        <div class="text-center flex flex-col gap-3">
          <Icon name="lucide:key-round" class="mx-auto" size="32" />
          <CardTitle class="text-2xl">Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos un código de
            recuperación
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
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

          <Button type="submit" class="w-full" :disabled="loading">
            <Icon
              v-if="loading"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <Icon v-else name="lucide:send" class="mr-2 h-4 w-4" />
            {{ loading ? "Enviando..." : "Enviar código" }}
          </Button>

          <div class="text-center">
            <NuxtLink
              to="/login"
              class="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              <Icon name="lucide:arrow-left" class="h-4 w-4" />
              Volver al inicio de sesión
            </NuxtLink>
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

  const email = ref("");
  const loading = ref(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!email.value) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    loading.value = true;

    try {
      const response = await authApi.forgotPassword(email.value);
      toast.success(
        response.message ||
          "Si el correo existe, recibirás un código de recuperación",
      );

      // Redirigir a la página de reset con el email en query
      router.push({
        path: "/reset-password",
        query: { email: email.value },
      });
    } catch (error: any) {
      toast.error(
        error.data?.message ||
          "Error al solicitar recuperación de contraseña",
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
