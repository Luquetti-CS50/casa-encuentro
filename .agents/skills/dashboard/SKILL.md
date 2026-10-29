---
name: dashboard
description: >-
  Criterios de diseño, alta densidad informativa, semaforización clara y
  ergonomía operativa para el panel de coordinación (/admin) de Casa Encuentro.
---

# Skill: Dashboard & Dataviz Operativo

Esta skill rige la arquitectura y usabilidad del panel de control `/admin`:

## 1. Principios de Ergonomía para Coordinación
- **Acciones Rápidas en 1 Clic:**
  * Aprobar seña $\rightarrow$ Transición inmediata a `CONFIRMED`.
  * Rechazar / Liberar turno $\rightarrow$ Transición inmediata a `AVAILABLE`.
  * Ingreso rápido de reserva manual o bloqueo administrativo.
- **Reducción de Carga Cognitiva:**
  * Vista de agenda diaria con filtros instantáneos por especialista y fecha.
  * Resumen métrico clave al tope: Turnos hoy, Esperando Seña, Confirmados, Horarios Disponibles.
  * Semaforización discreta y no estridente de los estados.

## 2. Hoja de Ruta Diaria (Daily Run-Sheet)
- Módulo de exportación y copiado directo en un clic para enviar al WhatsApp del profesional.
- Estructura cronológica nítida:
  ```text
  🌿 Casa Encuentro — Hoja de Ruta del Especialista
  Profesional: [Nombre]
  Fecha: [Día y Fecha]
  -----------------------------------------------
  • 09:00 - 10:00 | [Paciente] ([Servicio]) | Tel: [Teléfono]
  • 10:15 - 11:15 | [Paciente] ([Servicio]) | Tel: [Teléfono]
  -----------------------------------------------
  Total de pacientes: [Cantidad]
  ```

## 3. Disparador de Recordatorio al Paciente
- Botón directo que abre WhatsApp Web o App con mensaje pre-armado y personalizado para recordar el turno 24hs antes.
