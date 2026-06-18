'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let attempts = 0
    const checkSession = async () => {
      attempts++
      const { data: { session } } = await supabase.auth.getSession()
      if (session) return // Session found, stay on dashboard
      if (attempts < 5) {
        setTimeout(checkSession, 1000) // Retry every 1 second, up to 5 times
      } else {
        router.push('/auth/login') // Give up after 5 seconds
      }
    }

    checkSession()
  }, [router])

  return <>{children}</>
}
