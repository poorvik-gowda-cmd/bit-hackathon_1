import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SendMoneyClient from "@/components/payments/send-money-client"

export default async function SendMoneyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch recipients
  const { data: recipients } = await supabase
    .from("recipients")
    .select("*")
    .eq("user_id", user.id)
    .order("is_favorite", { ascending: false })

  return <SendMoneyClient user={user} userProfile={userProfile} savedRecipients={recipients || []} />
}
