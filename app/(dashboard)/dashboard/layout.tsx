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
    setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) router.push('/auth/login')
      })
    }, 3000)
  }, [router])

  return <>{children}</>
}
