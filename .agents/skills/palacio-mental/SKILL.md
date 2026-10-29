---
name: palacio-mental
description: >-
  Memoria persistente y registro de decisiones de arquitectura, reglas de negocio
  e identidad visual para Casa Encuentro, preservando el contexto continuo del proyecto.
---

# Skill: Palacio Mental (Memoria Permanente del Proyecto)

Inspirado en el video "Comentá CLAUDE" (Plugin 4: Palacio Mental):
"Evita tener que reexplicar los principios en cada chat, manteniendo una memoria permanente del proyecto".

## Registro de Memoria Activa
El archivo de memoria viva del proyecto se aloja en:
- `.agents/memory/project-memory.md`

### Responsabilidades
1. **Preservar el Modelo de Dominio:** Entidades (`Specialist`, `Service`, `ScheduleDay`, `TimeSlot`, `Booking`, `SiteSettings`).
2. **Preservar las Reglas de Negocio:**
   - La reserva inicia en `PENDING_DEPOSIT` y requiere validación de comprobante para `CONFIRMED`.
   - Seña configurable porcentual o fija en `SiteSettings`.
   - Generación determinística de grillas sin solapamientos.
3. **Preservar Identidad Visual:**
   - Paleta cromática natural: verde bosque, oliva, salvia, lino/crema y detalles miel.
   - Slogan y tono comunicacional cálido, pausado y profesional.
