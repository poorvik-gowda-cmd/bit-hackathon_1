"use client"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import BalanceCard from "./balance-card"
import QuickActions from "./quick-actions"
import RecentTransactions from "./recent-transactions"
import TopNavigation from "./top-navigation"

interface DashboardClientProps {
  user: User
  userProfile: any
  recentTransactions: any[]
}

export default function DashboardClient({ user, userProfile, recentTransactions }: DashboardClientProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation user={user} userProfile={userProfile} />

      <main className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="text-muted-foreground">{userProfile?.upi_id || "Complete your profile"}</p>
            </div>
          </div>

          {/* Balance Card */}
          <BalanceCard balance={userProfile?.balance || 0} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Transactions */}
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </main>
    </div>
  )
}
