import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check database connection
    const { error } = await supabase.from("users").select("count()", {
      count: "exact",
      head: true,
    })

    if (error) {
      return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 503 })
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Health check failed" }, { status: 503 })
  }
}
