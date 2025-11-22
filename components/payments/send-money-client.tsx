"use client"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SendMoneyClientProps {
  user: User
  userProfile: any
  savedRecipients: any[]
}

export default function SendMoneyClient({ user, userProfile, savedRecipients }: SendMoneyClientProps) {
  const router = useRouter()
  const [step, setStep] = useState<"recipient" | "amount" | "confirm">("recipient")
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null)
  const [recipientUPI, setRecipientUPI] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectRecipient = (recipient: any) => {
    setSelectedRecipient(recipient)
    setRecipientUPI(recipient.recipient_upi_id)
    setRecipientName(recipient.recipient_name)
    setStep("amount")
  }

  const handleNewRecipient = () => {
    setSelectedRecipient(null)
    setRecipientUPI("")
    setRecipientName("")
    setStep("recipient")
  }

  const handleProceedToAmount = async () => {
    if (!recipientUPI || !recipientName) {
      setError("Please enter recipient details")
      return
    }

    if (!recipientUPI.match(/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/)) {
      setError("Invalid UPI ID format")
      return
    }

    setError(null)
    setStep("amount")
  }

  const handleProceedToConfirm = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    const amountNum = Number.parseFloat(amount)
    const dailySpent = userProfile?.daily_spent || 0
    const dailyLimit = userProfile?.daily_limit || 100000

    if (dailySpent + amountNum > dailyLimit) {
      setError(`Daily limit exceeded. Available: ₹${(dailyLimit - dailySpent).toLocaleString("en-IN")}`)
      return
    }

    setError(null)
    setStep("confirm")
  }

  const handleSendMoney = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const amountNum = Number.parseFloat(amount)
      const newBalance = (userProfile?.balance || 0) - amountNum

      if (newBalance < 0) {
        throw new Error("Insufficient balance")
      }

      // Create transaction
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert({
          sender_id: user.id,
          recipient_upi_id: recipientUPI,
          recipient_name: recipientName,
          amount: amountNum,
          transaction_type: "sent",
          status: "completed",
          description: description || null,
          reference_id: `TXN-${Date.now()}`,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (txError) throw txError

      // Update user balance and spent amount
      const { error: updateError } = await supabase
        .from("users")
        .update({
          balance: newBalance,
          daily_spent: (userProfile?.daily_spent || 0) + amountNum,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Save recipient if new
      if (!selectedRecipient) {
        await supabase.from("recipients").insert({
          user_id: user.id,
          recipient_upi_id: recipientUPI,
          recipient_name: recipientName,
        })
      }

      router.push(`/transactions/${transaction.id}?success=true`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send money")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-2xl">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Send Money</CardTitle>
            <CardDescription>Transfer money via UPI to anyone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === "recipient" && (
              <div className="space-y-4">
                {savedRecipients.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Saved Recipients</Label>
                    <div className="grid gap-2 mb-4">
                      {savedRecipients.map((recipient) => (
                        <button
                          key={recipient.id}
                          onClick={() => handleSelectRecipient(recipient)}
                          className="p-3 border border-border rounded-lg hover:bg-muted text-left transition"
                        >
                          <p className="font-medium">{recipient.recipient_name}</p>
                          <p className="text-sm text-muted-foreground">{recipient.recipient_upi_id}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Label className="text-base font-semibold mb-3 block">New Recipient</Label>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="recipient-upi">Recipient UPI ID</Label>
                      <Input
                        id="recipient-upi"
                        placeholder="user@upi"
                        value={recipientUPI}
                        onChange={(e) => setRecipientUPI(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="recipient-name">Recipient Name</Label>
                      <Input
                        id="recipient-name"
                        placeholder="John Doe"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button onClick={handleProceedToAmount} disabled={isLoading} className="w-full">
                  Next
                </Button>
              </div>
            )}

            {step === "amount" && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-semibold text-lg">{recipientName}</p>
                  <p className="text-sm text-muted-foreground">{recipientUPI}</p>
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
                    max={userProfile?.balance || 0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available Balance: ₹
                    {(userProfile?.balance || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Lunch money"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleNewRecipient} className="flex-1 bg-transparent">
                    Back
                  </Button>
                  <Button onClick={handleProceedToConfirm} disabled={isLoading} className="flex-1">
                    Review
                  </Button>
                </div>
              </div>
            )}

            {step === "confirm" && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">{recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold text-lg">
                      ₹
                      {Number.parseFloat(amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Description</span>
                      <span className="font-medium">{description}</span>
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("amount")} className="flex-1" disabled={isLoading}>
                    Back
                  </Button>
                  <Button onClick={handleSendMoney} disabled={isLoading} className="flex-1">
                    {isLoading ? "Sending..." : "Send Money"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
