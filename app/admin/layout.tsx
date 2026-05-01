import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel de administración — No Me Olvides',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      {children}
    </div>
  )
}
