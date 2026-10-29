# GEMINI.md — Directrices de Arquitectura, Ingeniería y Buenas Prácticas

## 1. Principios de Entorno y Aislamiento
* **Aislamiento Estricto:** Operar exclusivamente dentro del alcance de este repositorio. No buscar, indexar ni reutilizar configuraciones de proyectos externos en el espacio de trabajo.
* **Prohibición de Valores Fijos (No Hardcoding):** 
  * Ningún dato del negocio (teléfonos, nombres, alias bancarios, tarifas, duraciones, direcciones o mensajes salientes) debe escribirse de forma estática en componentes o páginas.
  * Todo dato operativo debe consumirse de forma dinámica desde una entidad central de configuración (`site_settings` / `business_profile`) o desde las entidades correspondientes (`specialists`, `services`, `schedules`).
* **Calidad de Código y Tipado:**
  * Modo estricto de TypeScript (`strict: true`). Prohibido el uso de `any` o aserciones de tipo ciegas (`as unknown as ...`).
  * Prohibido dejar marcadores de posición (`// TODO`, stubs incompletos o mocks desconectados de la capa de datos). Todo componente implementado debe ser plenamente funcional.
  * Las operaciones asíncronas deben incluir control exhaustivo de estados de carga (`loading`), error (`error`) y estado vacío (`empty states`).

---

## 2. Skills Requeridas y Metodología de Ejecución
El agente debe inicializar y aplicar los criterios técnicos de las siguientes capacidades de desarrollo:
1. **`artifact-design` / `design-system`:** Extracción formal de tokens de diseño mediante inspección de los activos visuales provistos en el repositorio local (paleta cromática armónica, jerarquía tipográfica legible, tratamiento de bordes, sombras y espaciados).
2. **`dashboard` / `dataviz`:** Densidad informacional óptima, alta legibilidad para gestión diaria, semaforización clara y reducción de la carga cognitiva para el usuario administrador.
3. **`code-review` / `verify`:** Verificación transaccional del ciclo de vida de turnos, prevención de condiciones de carrera (*race conditions*) y compilación limpia mediante `tsc --noEmit`.

---

## 3. Arquitectura del Modelo de Dominio y Máquina de Estados

### 3.1. Entidades del Sistema
* **`Specialist` (Profesional):** Datos biográficos, áreas de práctica/servicios que brinda, estado activo/inactivo y orden de visualización.
* **`Service` (Práctica/Terapia):** Título, descripción, duración estimada en minutos, precio de referencia y política de seña aplicable (porcentaje o monto fijo).
* **`ScheduleDay` (Jornada de Atención):** Asignación de un especialista a una fecha específica con ventana horaria de inicio y fin.
* **`TimeSlot` (Bloque Horario):** Fracción horaria discreta generada para una jornada. Estado obligatorio:
  $$\text{SlotStatus} \in \{\text{'AVAILABLE'}, \text{'PENDING\_DEPOSIT'}, \text{'CONFIRMED'}, \text{'BLOCKED'}\}$$
* **`Booking` (Reserva):** Relación entre paciente (nombre, teléfono, notas), especialista, servicio, bloque horario seleccionado y auditoría de seña.
* **`SiteSettings` (Configuración Operativa):** Parámetros editables por el administrador (nombre del espacio, dirección física, número de WhatsApp de contacto, datos de transferencia bancaria y plantilla de mensaje).

### 3.2. Ciclo de Vida y Prevención de Colisiones de Turnos
1. **Bloqueo Preventivo Temporal:** Al momento en que un paciente completa el formulario de solicitud en la interfaz pública, el bloque pasa a estado `PENDING_DEPOSIT`.
   * Esto previene que dos usuarios intenten reservar el mismo horario simultáneamente mientras se realiza la coordinación.
   * La entidad debe registrar una marca temporal (`locked_at`) para permitir liberación manual o automática si la confirmación no prospera.
2. **Confirmación Transaccional:** Solo el administrador puede transicionar el estado a `CONFIRMED` tras verificar el comprobante, o a `AVAILABLE` (liberando el bloque) en caso de cancelación.
3. **Generación Determinística de Grilla:** El sistema debe calcular los bloques horarios a partir de algoritmos basados en franja y duración:
   $$\text{Slots} = \left\lfloor \frac{\text{HoraFin} - \text{HoraInicio}}{\text{DuraciónServicio} + \text{IntervaloEntreTurnos}} \right\rfloor$$
   evitando el solapamiento de horarios entre profesionales en un mismo espacio físico.

---

## 4. Estándares de Diseño UI/UX y Accesibilidad

### 4.1. Accesibilidad Universal (WCAG 2.1 AA/AAA)
* **Objetivo de Audiencia:** El público que solicita servicios de salud y bienestar abarca desde jóvenes hasta adultos mayores. La interfaz debe priorizar la calma, la claridad y la facilidad motriz.
* **Zonas Táctiles Seguras:** Todo botón, selector de fecha o casillero de horario debe poseer un área táctil mínima de **$48 \times 48\text{ px}$** con suficiente espaciado periférico para evitar toques accidentales.
* **Contraste Óptico:** Asegurar un ratio de contraste mínimo de $4.5:1$ en texto general y $7:1$ en elementos críticos y botones principales respecto a su fondo.
* **Tipografía Funcional:** 
  * Fuente de lectura primaria con excelente altura x y formas abiertas.
  * Texto en escalas legibles (mínimo `16px` para cuerpos de texto, evitando fuentes ultracondensadas o ultradelgadas en información sensible como horarios o precios).

### 4.2. Supresión de Patrones Genéricos ("Anti-AI Slop")
* Prohibido el uso de decoraciones sintéticas injustificadas (resplandores difusos, gradientes estridentes no armónicos, efectos de vidrio borroso excesivos o iconografía decorativa redundante).
* La estética debe construirse a partir de la identidad real extraída de los activos locales del proyecto: diseño orgánico, espacios generosos, bordes coherentes y una paleta inspirada en bienestar, salud y encuentro humano.

---

## 5. Experiencia de Coordinación y Buenas Prácticas de Flujo

### 5.1. Copiado Rápido y Derivación a Mensajería
* **Interacción del Portapapeles:** El componente que expone los datos de transferencia bancaria (Alias/CBU) debe contar con un disparador de copiado nativo en un clic (`navigator.clipboard.writeText`) con confirmación visual accesible e inmediata (ej. cambio de etiqueta o micro-banner no intrusivo).
* **Serialización Dinámica para WhatsApp:** La URL saliente (`https://wa.me/...`) debe construirse interpolando variables limpias codificadas mediante `encodeURIComponent()`. La estructura del mensaje debe diseñarse para lectura instantánea del receptor:
  * Emisor / Paciente.
  * Profesional y práctica solicitada.
  * Fecha y franja horaria.
  * Monto de la seña calculada según la política activa.

### 5.2. Ergonomía para el Administrador
* El panel administrativo debe proveer acciones de un solo clic para las operaciones más frecuentes:
  * Cambio rápido de estado de reservas (Aprobar seña / Rechazar / Cancelar).
  * Generación rápida de resúmenes diarios por especialista para reenvío directo.
  * Disparadores de recordatorio para pacientes sin fricción de navegación.

---

## 6. Persistencia y Capa de Datos
* **Abstracción del Acceso a Datos:** Diseñar servicios y hooks modulares que desacoplen la interfaz gráfica de la implementación física del almacenamiento.
* **Idempotencia de Base de Datos:** Todo esquema SQL (`supabase_schema.sql`) debe ser reejecutable sin pérdida de consistencia (`IF NOT EXISTS`, gestión explícita de índices y restricciones `UNIQUE` compuestas para `specialist_id + date + start_time`).
* **Seguridad a Nivel de Fila (RLS):**
  * Políticas de lectura pública limitadas a datos de especialistas activos, servicios y disponibilidad horaria.
  * Políticas de inserción pública restringidas a la creación de solicitudes de reserva.
  * Modificación y acceso a datos de contacto de pacientes restringidos exclusivamente al rol autenticado del administrador.