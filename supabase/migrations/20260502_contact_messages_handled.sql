-- Migration: campos de gestión en contact_messages + auditoría en localities
-- Ejecutada manualmente en Supabase SQL Editor: 2026-05-02
-- Autor: Aitor Soto Rubio

-- ─────────────────────────────────────────────
-- Auditoría en localities
-- ─────────────────────────────────────────────
ALTER TABLE localities
  ADD COLUMN IF NOT EXISTS created_by  UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS modified_by UUID REFERENCES auth.users(id);

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

-- ─────────────────────────────────────────────
-- Campos de gestión para mensajes de contacto
-- ─────────────────────────────────────────────
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS handled     BOOLEAN     DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS handled_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS handled_by  UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL;

CREATE OR REPLACE TRIGGER trg_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- RLS: UPDATE y DELETE para admin en contact_messages
-- ─────────────────────────────────────────────
CREATE POLICY "admin_update" ON contact_messages
  FOR UPDATE USING ((select auth.role()) = 'authenticated');

CREATE POLICY "admin_delete" ON contact_messages
  FOR DELETE USING ((select auth.role()) = 'authenticated');
