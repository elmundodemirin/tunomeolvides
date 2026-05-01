import type { ReactNode } from 'react'

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1
        className="text-3xl font-bold mb-8 text-[#8E4226]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {title}
      </h1>
      <div className="prose-legal">
        {children}
      </div>
    </div>
  )
}
