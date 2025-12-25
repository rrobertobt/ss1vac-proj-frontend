<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Hero -->
    <main class="max-w-6xl mx-auto px-4 lg:px-0 py-12 lg:py-20 space-y-20">
      <!-- HERO -->
      <section class="grid gap-10 lg:grid-cols-2 items-center">
        <div class="space-y-6">
          <p
            class="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground"
          >
            Plataforma para clínicas de salud mental
          </p>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Organiza tu clínica de salud mental
            <span class="block text-primary">en un solo lugar.</span>
          </h1>

          <p class="text-base sm:text-lg text-muted-foreground max-w-xl">
            PsiFirm te ayuda a gestionar pacientes, citas, facturación e
            inventario con una interfaz pensada para equipos de psicología y
            psiquiatría.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <Button as-child>
              <NuxtLink to="/login"> Ir al panel </NuxtLink>
            </Button>

            <Button variant="outline" as-child>
              <NuxtLink to="#demo"> Ver demo </NuxtLink>
            </Button>

            <p class="text-xs text-muted-foreground">
              Sin configurar backend todavía: datos de ejemplo para la demo.
            </p>
          </div>
        </div>

        <!-- Fake dashboard preview -->
        <div class="relative">
          <Card class="shadow-xl border-border/60">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <CardTitle class="text-base font-semibold">
                  Panel general · PsiFirm
                </CardTitle>
                <div class="flex gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span class="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div class="rounded-lg border bg-muted/40 px-3 py-3 space-y-1">
                  <p class="text-muted-foreground">Citas hoy</p>
                  <p class="text-xl font-semibold">12</p>
                  <p class="text-[0.7rem] text-emerald-500">+3 vs ayer</p>
                </div>
                <div class="rounded-lg border bg-muted/40 px-3 py-3 space-y-1">
                  <p class="text-muted-foreground">Pacientes activos</p>
                  <p class="text-xl font-semibold">87</p>
                  <p class="text-[0.7rem] text-muted-foreground">
                    últimos 30 días
                  </p>
                </div>
                <div class="rounded-lg border bg-muted/40 px-3 py-3 space-y-1">
                  <p class="text-muted-foreground">Ingresos del mes</p>
                  <p class="text-xl font-semibold">Q 32k</p>
                  <p class="text-[0.7rem] text-emerald-500">+15% este mes</p>
                </div>
                <div class="rounded-lg border bg-muted/40 px-3 py-3 space-y-1">
                  <p class="text-muted-foreground">Alertas inventario</p>
                  <p class="text-xl font-semibold">5</p>
                  <p class="text-[0.7rem] text-amber-500">requieren atención</p>
                </div>
              </div>

              <div class="space-y-2 text-xs">
                <p class="font-medium text-muted-foreground">Próximas citas</p>
                <div
                  class="rounded-lg border divide-y text-[0.7rem] bg-background/80"
                >
                  <div class="flex items-center justify-between px-3 py-2">
                    <div>
                      <p class="font-medium">09:00 · Terapia individual</p>
                      <p class="text-muted-foreground">
                        Juan Pérez · Dra. Gómez
                      </p>
                    </div>
                    <span
                      class="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[0.65rem]"
                    >
                      Confirmada
                    </span>
                  </div>
                  <div class="flex items-center justify-between px-3 py-2">
                    <div>
                      <p class="font-medium">11:30 · Evaluación inicial</p>
                      <p class="text-muted-foreground">
                        María López · Dr. Ruiz
                      </p>
                    </div>
                    <span
                      class="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[0.65rem]"
                    >
                      Pendiente
                    </span>
                  </div>
                  <div class="flex items-center justify-between px-3 py-2">
                    <div>
                      <p class="font-medium">15:00 · Seguimiento</p>
                      <p class="text-muted-foreground">
                        Carlos Díaz · Licda. Morales
                      </p>
                    </div>
                    <span
                      class="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[0.65rem]"
                    >
                      Programada
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Glow decorativo -->
          <div
            class="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-linear-to-br from-primary/10 via-purple-500/5 to-blue-500/10 blur-3xl"
          />
        </div>
      </section>

      <Separator />

      <!-- Beneficios / Features principales -->
      <section class="space-y-8" id="features">
        <header class="space-y-2 text-center max-w-2xl mx-auto">
          <h2 class="text-2xl sm:text-3xl font-semibold">
            Todo lo que necesitas para administrar tu clínica
          </h2>
          <p class="text-sm sm:text-base text-muted-foreground">
            Desde el primer contacto con el paciente hasta el cierre de
            facturación, PsiFirm centraliza tu operación en un panel sencillo de
            usar.
          </p>
        </header>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card class="h-full">
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Gestión de pacientes</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm text-muted-foreground">
              <p>
                Historial clínico organizado, tareas y seguimiento en un solo
                lugar.
              </p>
              <ul class="space-y-1 text-xs">
                <li>• Fichas completas de pacientes</li>
                <li>• Notas por sesión</li>
                <li>• Asignación de profesional</li>
              </ul>
            </CardContent>
          </Card>

          <Card class="h-full">
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Citas y agenda</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm text-muted-foreground">
              <p>
                Programa y visualiza las citas de tu equipo sin perder el
                control.
              </p>
              <ul class="space-y-1 text-xs">
                <li>• Agenda por profesional</li>
                <li>• Estados de cita</li>
                <li>• Resumen diario</li>
              </ul>
            </CardContent>
          </Card>

          <Card class="h-full">
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Facturación y pagos</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm text-muted-foreground">
              <p>
                Genera comprobantes y controla cuentas por cobrar desde el
                panel.
              </p>
              <ul class="space-y-1 text-xs">
                <li>• Facturas por servicio</li>
                <li>• Estado de pago</li>
                <li>• Resumen financiero básico</li>
              </ul>
            </CardContent>
          </Card>

          <Card class="h-full">
            <CardHeader class="pb-2">
              <CardTitle class="text-base">Inventario clínico</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm text-muted-foreground">
              <p>
                Monitorea medicamentos y materiales para no quedarte sin stock.
              </p>
              <ul class="space-y-1 text-xs">
                <li>• Items por categoría</li>
                <li>• Alertas de mínimos</li>
                <li>• Historial de movimientos</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <!-- Módulos en detalle (Tabs) -->
      <section class="space-y-6" id="demo">
        <header class="space-y-2 text-center max-w-2xl mx-auto">
          <h2 class="text-2xl sm:text-3xl font-semibold">
            Descubre los módulos principales
          </h2>
          <p class="text-sm sm:text-base text-muted-foreground">
            Esta demo se centra en los módulos clave para el día a día:
            pacientes, citas y facturación.
          </p>
        </header>

        <Tabs default-value="patients" class="w-full max-w-4xl mx-auto">
          <TabsList class="grid grid-cols-3">
            <TabsTrigger value="patients" class="text-xs sm:text-sm">
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="appointments" class="text-xs sm:text-sm">
              Citas
            </TabsTrigger>
            <TabsTrigger value="billing" class="text-xs sm:text-sm">
              Facturación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" class="mt-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-base sm:text-lg">
                  Módulo de pacientes
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4 text-sm text-muted-foreground">
                <p>
                  Lista de pacientes con búsqueda, y un detalle que organiza el
                  historial clínico, sesiones y tareas.
                </p>
                <div class="grid md:grid-cols-2 gap-4 text-xs">
                  <div class="rounded-lg border bg-muted/40 p-3 space-y-2">
                    <p class="font-medium text-foreground">Vista de listado</p>
                    <p>
                      Tabla con nombre, contacto, profesional asignado y estado.
                      Ideal para filtrar rápidamente a quién atender.
                    </p>
                  </div>
                  <div class="rounded-lg border bg-muted/40 p-3 space-y-2">
                    <p class="font-medium text-foreground">
                      Ficha del paciente
                    </p>
                    <p>
                      Tabs para resumen, historial clínico y notas por sesión,
                      pensados para psicólogos y psiquiatras.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" class="mt-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-base sm:text-lg">
                  Módulo de citas
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4 text-sm text-muted-foreground">
                <p>
                  Visualiza las citas del día en una tabla, y crea nuevas
                  asignando paciente, profesional y horario.
                </p>
                <div class="grid md:grid-cols-2 gap-4 text-xs">
                  <div class="rounded-lg border bg-muted/40 p-3 space-y-2">
                    <p class="font-medium text-foreground">Agenda diaria</p>
                    <p>
                      Listado de citas con estado (confirmada, pendiente,
                      cancelada) y acceso rápido al historial del paciente.
                    </p>
                  </div>
                  <div class="rounded-lg border bg-muted/40 p-3 space-y-2">
                    <p class="font-medium text-foreground">Crear cita</p>
                    <p>
                      Formulario sencillo para programar sesiones sin perder de
                      vista la disponibilidad del equipo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" class="mt-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-base sm:text-lg">
                  Módulo de facturación
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4 text-sm text-muted-foreground">
                <p>
                  Genera comprobantes por cita y lleva un control básico de
                  ingresos y cuentas por cobrar.
                </p>
                <div class="grid md:grid-cols-2 gap-4 text-xs">
                  <div class="rounded-lg border bg-muted/40 p-3 space-y-2">
                    <p class="font-medium text-foreground">Lista de facturas</p>
                    <p>
                      Visualiza facturas emitidas, montos y estado de pago,
                      ideal para la parte administrativa.
                    </p>
                  </div>
                  <div class="rounded-lg border bg-muted/40 p-3 space-y-2">
                    <p class="font-medium text-foreground">
                      Detalle imprimible
                    </p>
                    <p>
                      Vista limpia para impresión o exporte, alineada con el
                      flujo de citas y pacientes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      <!-- Para quién está pensado + CTA -->
      <section class="space-y-10">
        <div class="grid lg:grid-cols-[2fr,3fr] gap-10 items-start">
          <div class="space-y-4">
            <h2 class="text-2xl sm:text-3xl font-semibold">
              Pensado para tu contexto real
            </h2>
            <p class="text-sm sm:text-base text-muted-foreground">
              PsiFirm se diseña con el día a día de clínicas y profesionales de
              salud mental en mente: múltiples roles, áreas y necesidades
              administrativas sin perder el foco clínico.
            </p>

            <div class="space-y-3 text-sm">
              <p class="font-medium">Ideal para:</p>
              <ul class="space-y-2 text-muted-foreground">
                <li>• Clínicas de psicología y psiquiatría</li>
                <li>• Profesionales independientes con agenda activa</li>
                <li>• Centros de salud integral con varios especialistas</li>
              </ul>
            </div>
          </div>

          <!-- Formulario de contacto simple -->
          <Card>
            <CardHeader>
              <CardTitle class="text-base sm:text-lg">
                ¿Quieres dejar alguna nota o comentario?
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4 text-sm">
              <div class="space-y-2">
                <label class="block text-xs font-medium text-muted-foreground">
                  Nombre
                </label>
                <Input placeholder="Tu nombre o clínica" />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-medium text-muted-foreground">
                  Correo electrónico
                </label>
                <Input type="email" placeholder="tucorreo@ejemplo.com" />
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-medium text-muted-foreground">
                  Mensaje
                </label>
                <Textarea
                  rows="3"
                  placeholder="Comentarios, ideas o requisitos que quieras considerar en el proyecto..."
                />
              </div>

              <div class="flex justify-end">
                <Button disabled> Enviar (solo mock) </Button>
              </div>

              <p class="text-[0.7rem] text-muted-foreground">
                Este formulario es solo visual para la demo del frontend.
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          class="border rounded-xl px-4 sm:px-8 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-muted/40"
        >
          <div class="space-y-1">
            <p class="text-sm font-semibold">
              ¿Listo para ver el sistema en acción?
            </p>
            <p class="text-xs sm:text-sm text-muted-foreground">
              Entra al panel y explora el flujo completo con datos de ejemplo.
            </p>
          </div>
          <div class="flex gap-3">
            <Button as-child>
              <NuxtLink to="/login"> Ir al panel </NuxtLink>
            </Button>
            <Button variant="outline" as-child>
              <NuxtLink to="#features"> Ver funcionalidades </NuxtLink>
            </Button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
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
  import { Textarea } from "@/components/ui/textarea";
  import { Separator } from "@/components/ui/separator";

  definePageMeta({
    layout: "public",
  });
</script>
<style scoped></style>
