import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const { name, email, message, consent_given } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
  }

  // El consentimiento es obligatorio por RGPD
  if (!consent_given) {
    return NextResponse.json({ error: 'El consentimiento es obligatorio.' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    message,
    consent_given: true,
    consent_timestamp: new Date().toISOString(),
  })

  if (error) {
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
