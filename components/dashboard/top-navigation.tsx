"use client"

import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface TopNavigationProps {
  user: User
  userProfile: any
}

export default function TopNavigation({ user, userProfile }: TopNavigationProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 md:px-6 py-4 max-w-6xl flex justify-between items-center">
        <Link href="/dashboard" className="font-bold text-xl">
          PayFlow
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
