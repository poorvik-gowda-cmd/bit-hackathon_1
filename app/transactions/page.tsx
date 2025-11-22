import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TransactionsClient from "@/components/transactions/transactions-client"

export default async function TransactionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })

  return <TransactionsClient transactions={transactions || []} />
}
