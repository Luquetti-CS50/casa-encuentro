---
name: playwright
description: >-
  Herramientas y procedimientos para inspección visual y testing end-to-end (E2E),
  permitiendo verificar el renderizado real de la interfaz, accesibilidad y flujos de usuario.
---

# Skill: Playwright Visual & E2E Verification

Inspirado en el video "Comentá CLAUDE" (Plugin 1: Playwright):
"Le da ojos al asistente para que pueda ver la pantalla real y certificar lo que está haciendo".

## Procedimientos
1. **Inspección de Flujos Críticos:**
   - Flujo de reserva de turnos: navegación por profesional o por fecha.
   - Selección de bloque horario y apertura del modal de solicitud.
   - Verificación del copiado de Alias/CBU y apertura del enlace de WhatsApp.
   - Panel de administración: cambio de estado en 1 clic de `PENDING_DEPOSIT` a `CONFIRMED`.
2. **Chequeo Visual de Responsividad:**
   - Verificación de viewport móvil (390px) y desktop (1280px).
   - Comprobación de que no existan desbordes horizontales (`overflow-x`) y que las zonas táctiles mantengan $\ge 48\text{ px}$.
