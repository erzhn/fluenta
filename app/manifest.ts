import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fluenta English',
    short_name: 'Fluenta',
    description: 'AI English Learning Platform',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0f0f1a',
    theme_color: '#6366f1',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
