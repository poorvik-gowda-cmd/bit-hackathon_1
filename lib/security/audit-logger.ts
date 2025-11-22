import { createClient } from "@/lib/supabase/server"

export interface AuditLogEntry {
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  status: "success" | "failure"
  details?: Record<string, any>
  ip_address?: string
}

export async function logAuditEvent(entry: AuditLogEntry) {
  try {
    const supabase = await createClient()

    // In production, store audit logs in a dedicated table
    console.log("[AUDIT LOG]", {
      timestamp: new Date().toISOString(),
      ...entry,
    })

    // Optional: Store in database for compliance
    // await supabase.from("audit_logs").insert(entry);
  } catch (error) {
    console.error("Failed to log audit event:", error)
  }
}

export async function logPaymentAttempt(
  userId: string,
  recipientUpi: string,
  amount: number,
  status: "success" | "failure",
  ipAddress?: string,
) {
  await logAuditEvent({
    user_id: userId,
    action: "PAYMENT_SENT",
    resource_type: "transaction",
    status,
    details: {
      recipient: recipientUpi,
      amount,
    },
    ip_address: ipAddress,
  })
}

export async function logLoginAttempt(email: string, status: "success" | "failure", ipAddress?: string) {
  await logAuditEvent({
    user_id: email,
    action: "LOGIN_ATTEMPT",
    resource_type: "auth",
    status,
    ip_address: ipAddress,
  })
}
