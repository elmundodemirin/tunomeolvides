import { LocalityForm } from '@/components/admin/LocalityForm'

export default function NewLocalityPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#8E4226]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Nueva localidad
        </h1>
        <p className="text-sm text-[#a07860] mt-1">
          Rellena los campos y guarda para que aparezca en el mapa.
        </p>
      </div>
      <LocalityForm />
    </div>
  )
}
