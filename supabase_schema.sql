-- ==============================================================================
-- CASA ENCUENTRO — SUPABASE SCHEMA IDEMPOTENTE & POLÍTICAS RLS
-- Generado para el sistema de turnos y coordinación holística
-- ==============================================================================

-- 1. Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumeración para Estados de Turnos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'slot_status') THEN
        CREATE TYPE slot_status AS ENUM ('AVAILABLE', 'PENDING_DEPOSIT', 'CONFIRMED', 'BLOCKED');
    END IF;
END$$;

-- 3. Tabla: Especialistas (Profesionales)
CREATE TABLE IF NOT EXISTS specialists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla: Servicios (Prácticas y Terapias)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specialist_id UUID REFERENCES specialists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    deposit_type VARCHAR(20) NOT NULL DEFAULT 'percentage' CHECK (deposit_type IN ('percentage', 'fixed')),
    deposit_value NUMERIC(12, 2) NOT NULL DEFAULT 30 CHECK (deposit_value >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabla: Jornadas de Atención (ScheduleDay)
CREATE TABLE IF NOT EXISTS schedule_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL CHECK (end_time > start_time),
    slot_interval_minutes INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_specialist_date UNIQUE (specialist_id, date)
);

-- 6. Tabla: Bloques Horarios (TimeSlot)
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_day_id UUID REFERENCES schedule_days(id) ON DELETE CASCADE,
    specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status slot_status NOT NULL DEFAULT 'AVAILABLE',
    locked_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Restricción estricta de no superposición por especialista en misma fecha y horario
    CONSTRAINT unique_specialist_slot UNIQUE (specialist_id, date, start_time)
);

-- 7. Tabla: Reservas (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE RESTRICT,
    specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    patient_email VARCHAR(255),
    patient_notes TEXT,
    deposit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    deposit_verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabla: Configuración Operativa Global (SiteSettings)
CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
    business_name VARCHAR(255) NOT NULL DEFAULT 'Casa Encuentro',
    tagline TEXT NOT NULL DEFAULT 'En calma se ven los colores con mayor intensidad',
    address TEXT NOT NULL DEFAULT 'General Las Heras, Provincia de Buenos Aires',
    contact_phone VARCHAR(50) NOT NULL DEFAULT '+54 9 11 5666-0016',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '5491156660016',
    bank_alias VARCHAR(100) NOT NULL DEFAULT 'CASA.ENCUENTRO.HERAS',
    bank_cbu VARCHAR(100) NOT NULL DEFAULT '0000003100012345678901',
    bank_name VARCHAR(100) NOT NULL DEFAULT 'Banco Santander',
    bank_holder VARCHAR(255) NOT NULL DEFAULT 'Felicia Torres',
    default_deposit_percent NUMERIC(5, 2) NOT NULL DEFAULT 30.00,
    whatsapp_template TEXT NOT NULL DEFAULT '¡Hola Casa Encuentro! ✨ Quiero coordinar mi turno:%0A• Paciente: {patient_name}%0A• Especialista: {specialist_name}%0A• Práctica: {service_title}%0A• Fecha: {date}%0A• Horario: {time}%0A• Seña a abonar: ${deposit_amount}%0A%0AAdjunto el comprobante de transferencia bancaria.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserción inicial garantizada de SiteSettings
INSERT INTO site_settings (id, business_name, tagline, address, contact_phone, whatsapp_number, bank_alias, bank_cbu, bank_name, bank_holder, default_deposit_percent)
VALUES (
    'current',
    'Casa Encuentro',
    'En calma se ven los colores con mayor intensidad. Un espacio para sanar, soltar y volver a tu centro.',
    'General Las Heras, Provincia de Buenos Aires',
    '+54 9 11 5666-0016',
    '5491156660016',
    'CASA.ENCUENTRO.HERAS',
    '0000003100012345678901',
    'Banco Santander',
    'Felicia Torres',
    30.00
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- ==============================================================================
-- 9. ÍNDICES DE RENDIMIENTO Y PREVENCIÓN DE COLISIÓN
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_time_slots_lookup 
ON time_slots (specialist_id, date, status);

CREATE INDEX IF NOT EXISTS idx_time_slots_date_status 
ON time_slots (date, status);

CREATE INDEX IF NOT EXISTS idx_bookings_time_slot 
ON bookings (time_slot_id);

CREATE INDEX IF NOT EXISTS idx_schedule_days_specialist 
ON schedule_days (specialist_id, date);

-- ==============================================================================
-- 10. SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Regla 1: Especialistas activos y servicios activos son de lectura pública
DROP POLICY IF EXISTS "Lectura pública especialistas activos" ON specialists;
CREATE POLICY "Lectura pública especialistas activos"
ON specialists FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Lectura pública servicios activos" ON services;
CREATE POLICY "Lectura pública servicios activos"
ON services FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

-- Regla 2: Configuración del sitio es de lectura pública, edición solo autenticado
DROP POLICY IF EXISTS "Lectura pública site_settings" ON site_settings;
CREATE POLICY "Lectura pública site_settings"
ON site_settings FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Modificación site_settings solo admin" ON site_settings;
CREATE POLICY "Modificación site_settings solo admin"
ON site_settings FOR ALL
USING (auth.role() = 'authenticated');

-- Regla 3: Disponibilidad horaria pública
DROP POLICY IF EXISTS "Lectura pública turnos disponibles y estados" ON time_slots;
CREATE POLICY "Lectura pública turnos disponibles y estados"
ON time_slots FOR SELECT
USING (true);

-- Regla 4: Inserción de reservas pública (paciente crea su solicitud)
DROP POLICY IF EXISTS "Pacientes pueden solicitar reserva" ON bookings;
CREATE POLICY "Pacientes pueden solicitar reserva"
ON bookings FOR INSERT
WITH CHECK (true);

-- Regla 5: Acceso y modificación a datos de contacto de pacientes solo coordinador autenticado
DROP POLICY IF EXISTS "Lectura de reservas solo admin" ON bookings;
CREATE POLICY "Lectura de reservas solo admin"
ON bookings FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Modificación de reservas solo admin" ON bookings;
CREATE POLICY "Modificación de reservas solo admin"
ON bookings FOR UPDATE
USING (auth.role() = 'authenticated');

-- Regla 6: Modificación de slots y jornadas solo coordinador autenticado
DROP POLICY IF EXISTS "Administración de time_slots solo admin" ON time_slots;
CREATE POLICY "Administración de time_slots solo admin"
ON time_slots FOR ALL
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Administración de schedule_days solo admin" ON schedule_days;
CREATE POLICY "Administración de schedule_days solo admin"
ON schedule_days FOR ALL
USING (auth.role() = 'authenticated');
