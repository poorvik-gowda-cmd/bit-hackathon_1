import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TransactionDetailClient from "@/components/transactions/transaction-detail-client"

export default async function TransactionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: transaction } = await supabase.from("transactions").select("*").eq("id", params.id).single()

  if (!transaction) {
    redirect("/dashboard")
  }

  return <TransactionDetailClient transaction={transaction} />
}
