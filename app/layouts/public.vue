<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <!-- Header público -->
    <header
      class="border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:backdrop-blur-md sticky top-0 z-30"
    >
      <div
        class="max-w-6xl mx-auto px-4 lg:px-0 h-16 flex items-center justify-between"
      >
        <!-- LOGO + NOMBRE -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div
            class="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center"
          >
            <span class="text-primary font-bold text-sm">Ψ</span>
          </div>
          <span class="font-semibold text-sm sm:text-base tracking-tight">
            PsiFirm
          </span>
        </NuxtLink>

        <!-- NAV DESKTOP -->
        <nav class="hidden sm:flex items-center gap-6 text-sm">
          <NuxtLink
            to="/"
            class="text-muted-foreground hover:text-foreground transition"
          >
            Inicio
          </NuxtLink>
          <a
            href="#features"
            class="text-muted-foreground hover:text-foreground transition"
          >
            Funcionalidades
          </a>
          <a
            href="#demo"
            class="text-muted-foreground hover:text-foreground transition"
          >
            Demo
          </a>
        </nav>

        <!-- BOTÓN LOGIN -->
        <div class="flex items-center gap-2">
          <Button as-child class="hidden sm:inline-flex">
            <NuxtLink to="/login">Iniciar sesión</NuxtLink>
          </Button>

          <!-- MOBILE MENU BUTTON -->
          <button
            class="sm:hidden p-2 rounded-md border border-border hover:bg-muted/40 transition"
            @click="isOpen = !isOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!isOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- MOBILE NAV DROPDOWN -->
      <div
        v-if="isOpen"
        class="sm:hidden border-t border-border bg-background px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2"
      >
        <NuxtLink
          to="/"
          class="block text-sm text-muted-foreground hover:text-foreground transition"
          @click="closeMenu"
        >
          Inicio
        </NuxtLink>

        <a
          href="#features"
          class="block text-sm text-muted-foreground hover:text-foreground transition"
          @click="closeMenu"
        >
          Funcionalidades
        </a>

        <a
          href="#demo"
          class="block text-sm text-muted-foreground hover:text-foreground transition"
          @click="closeMenu"
        >
          Demo
        </a>

        <Button as-child class="w-full">
          <NuxtLink to="/login" @click="closeMenu"> Iniciar sesión </NuxtLink>
        </Button>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <div class="flex-1">
      <NuxtPage />
    </div>

    <!-- Footer público (puedes quitarlo si usas el de index.vue) -->
    <footer class="border-t border-border/60 mt-10">
      <div
        class="max-w-6xl mx-auto px-4 lg:px-0 py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-muted-foreground"
      >
        <p>© {{ new Date().getFullYear() }} PsiFirm — Proyecto académico.</p>
        <div class="flex gap-4">
          <NuxtLink to="/" class="hover:underline">Inicio</NuxtLink>
          <button type="button" class="hover:underline">Términos</button>
          <button type="button" class="hover:underline">Privacidad</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { Button } from "@/components/ui/button";

  const isOpen = ref(false);
  const closeMenu = () => (isOpen.value = false);
</script>
