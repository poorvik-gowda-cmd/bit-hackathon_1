"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface TransactionsClientProps {
  transactions: any[]
}

export default function TransactionsClient({ transactions }: TransactionsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipient_upi_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || tx.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Transactions</h1>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All your UPI transactions and transfers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Search by name, UPI, or reference ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions List */}
            {filtered.length > 0 ? (
              <div className="space-y-2">
                {filtered.map((tx) => (
                  <Link key={tx.id} href={`/transactions/${tx.id}`} className="block">
                    <div className="p-4 border border-border rounded-lg hover:bg-muted transition cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{tx.recipient_name}</p>
                          <p className="text-sm text-muted-foreground">{tx.recipient_upi_id}</p>
                          <p className="text-xs text-muted-foreground mt-1">{tx.reference_id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            -₹
                            {tx.amount.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <p
                            className={`text-xs font-medium capitalize ${
                              tx.status === "completed"
                                ? "text-green-600"
                                : tx.status === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {tx.status}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {transactions.length === 0 ? "No transactions yet" : "No transactions match your filters"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
