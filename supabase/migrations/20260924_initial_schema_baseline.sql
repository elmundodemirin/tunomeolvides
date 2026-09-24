-- Baseline del esquema completo del proyecto.
-- Hasta ahora la estructura base (tablas, RLS, bucket de audios) se creó a
-- mano en el SQL Editor de Supabase en B2 y nunca quedó versionada — solo
-- 20260502_contact_messages_handled.sql (aditiva) estaba guardada como
-- migración. Este archivo consolida esa base (documentada en CLAUDE.md §
-- Modelo de datos) + esa migración posterior, para que el esquema completo
-- viva en el código y cualquier proyecto Supabase nuevo pueda recrearse
-- ejecutando un único script. Ejecutado por primera vez el 2026-09-24 al
-- migrar de la organización de Supabase de Aitor Soto Rubio a la propia
-- de la promotora.

BEGIN;

-- ─────────────────────────────────────────────
-- Tablas
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS localities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  audio_url_es TEXT,
  audio_url_en TEXT,
  external_url TEXT,
  cover_image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by  UUID REFERENCES auth.users(id),
  modified_by UUID REFERENCES auth.users(id)
);

-- Usado por supabase/seed_test_localities.sql (ON CONFLICT (name, province))
CREATE UNIQUE INDEX IF NOT EXISTS localities_name_province_unique
  ON localities (name, province);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  handled     BOOLEAN     DEFAULT false NOT NULL,
  handled_at  TIMESTAMPTZ,
  handled_by  UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ─────────────────────────────────────────────
-- Trigger reusable de updated_at
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_localities_updated_at
  BEFORE UPDATE ON localities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON localities
  FOR SELECT USING (active = true);

CREATE POLICY "admin_write" ON localities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "public_insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_read" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_update" ON contact_messages
  FOR UPDATE USING ((select auth.role()) = 'authenticated');

CREATE POLICY "admin_delete" ON contact_messages
  FOR DELETE USING ((select auth.role()) = 'authenticated');

-- ─────────────────────────────────────────────
-- Storage: bucket de audios
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('audios', 'audios', true, 10485760, ARRAY['audio/mpeg'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "audios_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'audios');

CREATE POLICY "audios_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'audios' AND auth.role() = 'authenticated');

CREATE POLICY "audios_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'audios' AND auth.role() = 'authenticated');

CREATE POLICY "audios_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'audios' AND auth.role() = 'authenticated');

COMMIT;
