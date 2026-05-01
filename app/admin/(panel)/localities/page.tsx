import { redirect } from 'next/navigation'

// La gestión de localidades se hace desde el dashboard principal
export default function LocalitiesPage() {
  redirect('/admin/dashboard')
}
