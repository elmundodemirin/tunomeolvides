import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const NOTIFICATION_RECIPIENT = 'info@tunomeolvides.es'
const NOTIFICATION_SENDER = 'Tú no me olvides <notificaciones@send.tunomeolvides.es>'

// Aviso por email a la promotora de que ha llegado un mensaje nuevo. El
// mensaje en sí ya queda guardado en contact_messages (fuente de verdad,
// visible en /admin/mensajes) antes de llamar a esta función, así que un
// fallo aquí nunca debe romper el envío del formulario para el visitante.
async function notifyNewContactMessage(name: string, email: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY no configurada: no se envía email de aviso.')
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: NOTIFICATION_SENDER,
        to: NOTIFICATION_RECIPIENT,
        reply_to: email,
        subject: `Nuevo mensaje de contacto de ${name}`,
        text:
          `Nombre: ${name}\n` +
          `Email: ${email}\n\n` +
          `Mensaje:\n${message}\n\n` +
          `— Gestiona este mensaje en https://tunomeolvides.es/admin/mensajes`,
      }),
    })

    if (!res.ok) {
      console.error('[contact] Error enviando email de aviso:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[contact] Excepción enviando email de aviso:', err)
  }
}

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

  await notifyNewContactMessage(name, email, message)

  return NextResponse.json({ success: true }, { status: 201 })
}
