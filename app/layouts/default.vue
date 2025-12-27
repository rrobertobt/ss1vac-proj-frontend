<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Topbar -->
    <header
      class="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur"
    >
      <div class="h-14 px-4 lg:px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Mobile: botón sidebar -->
          <button
            class="lg:hidden p-2 rounded-md border border-border hover:bg-muted/40 transition"
            type="button"
            @click="mobileOpen = !mobileOpen"
            aria-label="Abrir menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <NuxtLink
            to="/app/dashboard"
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

          <Separator orientation="vertical" class="h-6 hidden sm:block" />

          <p class="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            {{ pageTitle }}
          </p>
        </div>

        <!-- Sesión -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col items-end leading-tight">
            <p class="text-sm font-medium">
              {{ sessionUser?.patient
                ? sessionUser?.patient.first_name + " " + sessionUser?.patient.last_name
                : sessionUser?.employee
                ? sessionUser?.employee.first_name + " " + sessionUser?.employee.last_name
                : "Usuario" }}
            </p>
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground">
                {{ sessionUser?.email ?? "" }}
              </span>
              <span
                class="text-[0.7rem] px-2 py-0.5 rounded-full border bg-muted/40"
              >
                {{ sessionUser?.role_label }}
              </span>
            </div>
          </div>

          <!-- Botón de cuenta (simple) -->
          <Button variant="outline" size="sm" as-child>
            <NuxtLink to="/app/profile"> Perfil </NuxtLink>
          </Button>

          <Button variant="destructive" size="sm" type="button" @click="sessionStore.logOut()">
            Salir
          </Button>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar desktop -->
      <aside
        class="hidden lg:flex w-64 border-r border-border/60 min-h-[calc(100vh-3.5rem)]"
      >
        <div class="w-full p-3 space-y-2">
          <p
            class="px-2 pt-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
          >
            Navegación
          </p>

          <nav class="space-y-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center justify-between rounded-md px-3 py-2 text-sm transition"
              :class="
                isActive(item.to)
                  ? 'bg-muted/60 font-medium'
                  : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'
              "
            >
              <span>{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="text-[0.7rem] px-2 py-0.5 rounded-full border bg-background"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </nav>

        </div>
      </aside>

      <!-- Sidebar mobile (overlay) -->
      <div v-if="mobileOpen" class="lg:hidden fixed inset-0 z-40">
        <div class="absolute inset-0 bg-black/40" @click="mobileOpen = false" />
        <div
          class="absolute left-0 top-0 h-full w-72 bg-background border-r border-border/60 p-4"
        >
          <div class="flex items-center justify-between">
            <p class="font-semibold">Menú</p>
            <button
              class="p-2 rounded-md border border-border hover:bg-muted/40 transition"
              type="button"
              @click="mobileOpen = false"
              aria-label="Cerrar menú"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="mt-4 space-y-2">
            <div class="rounded-lg border bg-muted/30 p-3">
              <p class="text-sm font-medium">
                {{ sessionUser?.name ?? "Usuario" }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ sessionUser?.email ?? "" }}
              </p>
              <p
                class="mt-2 text-[0.7rem] inline-flex px-2 py-0.5 rounded-full border bg-background"
              >
                {{ sessionUser?.roleLabel }}
              </p>
            </div>

            <nav class="space-y-1">
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="block rounded-md px-3 py-2 text-sm transition"
                :class="
                  isActive(item.to)
                    ? 'bg-muted/60 font-medium'
                    : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                "
                @click="mobileOpen = false"
              >
                {{ item.label }}
              </NuxtLink>
            </nav>

            <Separator class="my-3" />

            <div class="flex gap-2">
              <Button class="flex-1" variant="outline" as-child>
                <NuxtLink to="/app/profile" @click="mobileOpen = false">
                  Perfil
                </NuxtLink>
              </Button>
              <Button
                class="flex-1"
                variant="destructive"
                type="button"
                @click="sessionStore.logOut()"
              >
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <main class="flex-1 min-h-[calc(100vh-3.5rem)]">
        <div class="p-4 lg:p-6 container mx-auto">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import { Separator } from "@/components/ui/separator";
  import { useSessionStore } from "@/stores/session";

  type NavItem = {
    label: string;
    to: string;
    badge?: string;
  };

  const route = useRoute();
  const router = useRouter();
  const mobileOpen = ref(false);

  const sessionStore = useSessionStore();
  const sessionUser = computed(() => sessionStore.sessionUser);

  const role = computed(() => sessionUser.value?.role_name as string | undefined);


  const navItems = computed<NavItem[]>(() => {
    const r = role.value;

    // Base para todos
    const base: NavItem[] = [{ label: "Dashboard", to: "/app/dashboard" }];

    if (r === "PATIENT") {
      return [
        ...base,
        { label: "Mis citas", to: "/app/appointments" },
        { label: "Mis facturas", to: "/app/billing/invoices" },
        // opcional:
        // { label: 'Mis tareas', to: '/app/tasks' },
      ];
    }

    if (r === "PSYCHOLOGIST" || r === "PSYCHIATRIST") {
      return [
        ...base,
        { label: "Mis citas", to: "/app/appointments" },
        { label: "Pacientes", to: "/app/patients" },
        // opcional:
        // { label: 'Reportes', to: '/app/reports' },
      ];
    }

    if (r === "TECHNICIAN" || r === "MAINTENANCE") {
      return [
        ...base,
        { label: "Inventario", to: "/app/inventory/items" },
        { label: "Movimientos", to: "/app/inventory/movements" },
        // opcional:
        // { label: 'Alertas', to: '/app/inventory/alerts', badge: '5' },
      ];
    }

    // ADMIN / ADMINISTRATIVE (administración)
    return [
      ...base,
      { label: "Pacientes", to: "/app/patients" },
      { label: "Citas", to: "/app/appointments" },
      { label: "Facturación", to: "/app/billing/invoices" },
      { label: "Inventario", to: "/app/inventory/items" },
      // opcional para ADMIN:
      ...(r === 'SUPER_ADMIN' ? [{ label: 'Usuarios', to: '/app/admin/users' }, { label: 'Áreas y especialidades', to: '/app/admin/areas-specialties' }] : []),
      // { label: 'Reportes', to: '/app/reports' },
    ];
  });

  const pageTitle = computed(() => {
    // Título simple basado en ruta; puedes mejorar con un mapa
    if (route.path.startsWith("/app/dashboard")) return "Dashboard";
    if (route.path.startsWith("/app/patients")) return "Pacientes";
    if (route.path.startsWith("/app/appointments")) return "Citas";
    if (route.path.startsWith("/app/billing")) return "Facturación";
    if (route.path.startsWith("/app/inventory")) return "Inventario";
    if (route.path.startsWith("/app/profile")) return "Perfil";
    return "Panel";
  });

  function isActive(pathPrefix: string) {
    return route.path === pathPrefix || route.path.startsWith(pathPrefix + "/");
  }

  async function logout() {
    // Ajusta a tu implementación real:
    // - limpiar tokens
    // - reset store
    // - llamar endpoint logout si aplica
    try {
      if (typeof sessionStore.logout === "function") {
        await sessionStore.logout();
      } else {
        // fallback simple: limpia referencia
        // @ts-ignore
        sessionStore.sessionUser = null;
      }
    } finally {
      await router.push("/login");
    }
  }
</script>
