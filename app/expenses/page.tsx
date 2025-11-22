import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ExpenseDashboardClient from "@/components/expenses/expense-dashboard-client"

export default async function ExpensesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch expenses for the current month
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", monthStart.toISOString())
    .lte("created_at", monthEnd.toISOString())
    .order("created_at", { ascending: false })

  return <ExpenseDashboardClient expenses={expenses || []} userId={user.id} />
}
