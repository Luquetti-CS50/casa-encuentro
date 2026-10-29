---
name: verify
description: >-
  Protocolos de auditoría de código, verificación de compilación estricta de TypeScript,
  integridad de transiciones de reserva y cumplimiento de directivas arquitectónicas.
---

# Skill: Verification & Code Review

Esta skill establece las comprobaciones mandatorias previas a dar por finalizada cualquier fase:

## 1. Verificación de Compilación y Tipos
- Ejecución de `npx tsc --noEmit` para garantizar `strict: true` sin errores.
- Prohibición explícita de `any`, aserciones ciegas (`as unknown as ...`) o comentarios `// TODO`.

## 2. Integridad de la Máquina de Estados del Turno
- **Disponibilidad:** Solo los bloques con estado `AVAILABLE` pueden ser seleccionados por un paciente.
- **Bloqueo Preventivo:** Al enviar la solicitud, el bloque pasa a `PENDING_DEPOSIT` y registra `locked_at`.
- **Prevención de Condiciones de Carrera:**
  * Si dos usuarios abren el selector al mismo tiempo, el primero en emitir la reserva bloquea el casillero.
  * La restricción de clave única `(specialist_id, date, start_time)` previene duplicaciones físicas.
- **Transición Administrativa:** Solo un administrador puede aprobar (`CONFIRMED`) o liberar (`AVAILABLE`).

## 3. Auditoría de Accesibilidad (WCAG AA/AAA)
- Todo elemento accionable verificado con tamaño $\ge 48\text{ px} \times 48\text{ px}$.
- Textos con contraste verificado sobre fondos cálidos de Casa Encuentro.
