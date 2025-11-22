"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function RequestMoneyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [upiId, setUpiId] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      if (!upiId || !amount) {
        throw new Error("Please fill in all required fields")
      }

      await supabase.from("payment_requests").insert({
        requester_id: user?.id,
        recipient_upi_id: upiId,
        amount: Number.parseFloat(amount),
        reason: reason || null,
        status: "pending",
      })

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create request")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-2xl">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Request Money</CardTitle>
            <CardDescription>Create a payment request for someone to pay you</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="upi">Recipient UPI ID</Label>
                <Input
                  id="upi"
                  placeholder="user@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Dinner"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating Request..." : "Request Money"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
