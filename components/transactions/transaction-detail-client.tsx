"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

interface TransactionDetailClientProps {
  transaction: any
}

export default function TransactionDetailClient({ transaction }: TransactionDetailClientProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <CardTitle>Payment Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-3 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Amount Sent</p>
              <p className="text-2xl font-bold">
                ₹
                {transaction.amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-semibold">{transaction.recipient_name}</p>
              <p className="text-sm text-muted-foreground">{transaction.recipient_upi_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reference ID</p>
              <p className="font-mono text-sm">{transaction.reference_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="text-sm">{new Date(transaction.created_at).toLocaleString()}</p>
            </div>
          </div>

          <Link href="/dashboard" className="block">
            <Button className="w-full">Back to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
