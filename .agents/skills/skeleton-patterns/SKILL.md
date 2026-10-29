---
name: skeleton-patterns
description: >-
  Arquitectura de carga skeleton-first para evitar Cumulative Layout Shift (CLS),
  proporcionar retroalimentación visual progresiva y restringir spinners exclusivamente a micro-acciones.
---

# Skill: Skeleton-First Loading Patterns

Reglas extraídas estrictamente del video instructivo:
*"Deja de usar spinners para cargar tus pantallas. Un spinner solo dice 'espera', no dice qué viene ni cuánto falta."*

## 1. La Regla de Oro: Skeletons vs Spinners
- **Skeletons:** Obligatorios para pantallas completas, vistas de catálogo, tarjetas de profesionales, grillas de turnos y tablas administrativas.
- **Spinners:** Reservados **únicamente** para micro-acciones en botones durante un lapso corto (ej. "Copiando...", "Enviando reserva...", "Aprobando seña...").

## 2. Geometría Exacta (Evitar que la Pantalla Brinque)
- El skeleton **debe medir exactamente lo mismo** que el contenido real que va a ocupar su lugar:
  * Si la tarjeta de profesional mide `h-80 w-full` con bordes redondeados `rounded-3xl`, el skeleton debe tener la misma clase estructural y dimensiones idénticas.
  * Si la grilla de turnos tiene bloques de `min-h-[48px]`, los esqueletos de los casilleros deben tener exactamente `min-h-[48px]`.
  * Esto elimina a 0 el Cumulative Layout Shift (CLS) y produce una transición instantánea donde todo encaja con perfección.

## 3. Brillo y Pulso Suave (Shimmer)
- Animación sutil con `animate-pulse` o gradiente shimmer con tonos crema/oliva claros (`bg-stone-200/60`, `bg-stone-200/80`), comunicando visualmente que el contenido está llegando sin estresar la vista del usuario.

## 4. Carga Progresiva / Staggered
- En paneles con múltiples fuentes de datos (ej. Dashboard `/admin`):
  1. Primero renderizar los números y métricas clave en cuanto estén listos.
  2. Segundo la vista o gráfico de agenda.
  3. Por último el listado detallado de turnos o tabla.
- Los skeletons se van reemplazando paulatinamente por el contenido real a medida que cada sección se resuelve.
