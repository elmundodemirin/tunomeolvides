'use client'

import dynamic from 'next/dynamic'
import type { Locality } from '@/lib/types'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

type Props = {
  localities: Locality[]
}

export default function MapWrapper({ localities }: Props) {
  return <Map localities={localities} />
}
