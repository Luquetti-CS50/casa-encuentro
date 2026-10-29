# Craft & Micro-Interacciones — Casa Encuentro

## 1. Ergonomía Táctil y Accesibilidad Universal
- **Zonas Táctiles Seguras:** Cualquier botón o selector interactivo cumple estrictamente con el mínimo de $48 \times 48\text{ px}$.
- **Prevención de Fatiga Visual:** Evitar saltos bruscos de color. Transiciones suaves en `duration-200 ease-out`.
- **Focus Rings Accesibles:** Enlaces y botones incluyen foco accesible por teclado sin romper la estética: `focus-visible:ring-2 focus-visible:ring-emerald-800/40 focus-visible:outline-none`.

## 2. Manejo de Copiado Rápido de Alias / CBU
- Interacción nativa con `navigator.clipboard.writeText`.
- Estado de confirmación visual inmediata: cambio de ícono/texto a "¡Copiado con éxito!" durante 2.5 segundos con confirmación por voz para lectores de pantalla (`aria-live="polite"`).

## 3. Mensajes Dinámicos de WhatsApp
- Codificación impecable con `encodeURIComponent`.
- Estructura sin ambigüedades:
  ```text
  ¡Hola Casa Encuentro! ✨
  Quiero coordinar la reserva de un turno:
  - Paciente: [Nombre]
  - Profesional: [Profesional]
  - Práctica: [Servicio]
  - Fecha: [Fecha]
  - Horario: [Hora de inicio]
  - Seña a transferir: $[Monto]
  Adjunto el comprobante de transferencia bancaria. ¡Muchas gracias!
  ```
