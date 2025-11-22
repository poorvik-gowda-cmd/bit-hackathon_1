import { createClient } from "@/lib/supabase/server"
import { paymentRateLimiter } from "@/lib/security/rate-limiter"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get user IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Check rate limit
    const { success, pending, limit, reset, remaining } = await paymentRateLimiter.limit(ip)

    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetTime: new Date(reset),
        },
        { status: 429 },
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipient_upi_id, amount, description } = await request.json()

    // Validate inputs
    if (!recipient_upi_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    // Prevent self-transfers
    const { data: senderProfile } = await supabase.from("users").select("upi_id").eq("id", user.id).single()

    if (senderProfile?.upi_id === recipient_upi_id) {
      return NextResponse.json({ error: "Cannot send money to yourself" }, { status: 400 })
    }

    // Check balance
    const { data: userBalance } = await supabase
      .from("users")
      .select("balance, daily_spent, daily_limit")
      .eq("id", user.id)
      .single()

    if (!userBalance || userBalance.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Check daily limit
    if (userBalance.daily_spent + amount > userBalance.daily_limit) {
      return NextResponse.json(
        {
          error: "Daily limit exceeded",
          remaining: userBalance.daily_limit - userBalance.daily_spent,
        },
        { status: 400 },
      )
    }

    // Create transaction
    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert({
        sender_id: user.id,
        recipient_upi_id,
        recipient_name: recipient_upi_id.split("@")[0], // Extract name from UPI
        amount,
        transaction_type: "sent",
        status: "completed",
        description,
        reference_id: `TXN-${Date.now()}`,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update balance
    await supabase
      .from("users")
      .update({
        balance: userBalance.balance - amount,
        daily_spent: userBalance.daily_spent + amount,
      })
      .eq("id", user.id)

    return NextResponse.json({
      success: true,
      transaction,
      remaining,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}
