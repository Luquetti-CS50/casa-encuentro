---
name: design-system
description: >-
  Sistema de diseño formal para Casa Encuentro. Define tokens cromáticos,
  escalas tipográficas, reglas de accesibilidad (WCAG AA/AAA) y estándares de craft.
---

# Skill: Design System (Casa Encuentro)

El sistema de diseño consolida los valores visuales reales extraídos de las piezas gráficas de la marca:

- [craft.md](./references/craft.md): Estándares de calidad de acabados, micro-interacciones y accesibilidad táctil.
- [brand-colors.md](./references/brand-colors.md): Paleta cromática oficial, contrastes medidos y tokens semánticos.
- [brand-typography.md](./references/brand-typography.md): Jerarquía tipográfica, pesos y emparejamiento editorial.

## Principios Fundamentales
1. **Accesibilidad Táctil Obligatoria:** Todo botón, selector de turnos o elemento interactivo debe poseer al menos $48 \times 48\text{ px}$ de área táctil (`min-h-[48px] min-w-[48px]`).
2. **Contraste Óptico Riguroso:** Ratios mínimos de 4.5:1 para texto normal y 7:1 para elementos de acción crítica respecto al fondo.
3. **Cohesión de Estado:** Todo elemento interactivo debe contar con estados de hover, focus visible (`ring-2 ring-forest ring-offset-2`), active y disabled nítidamente perceptibles.
