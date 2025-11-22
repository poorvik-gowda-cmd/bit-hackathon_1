import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface RecentTransactionsProps {
  transactions: any[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No transactions yet. Start by sending money to someone.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium">{tx.recipient_name}</p>
                <p className="text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₹
                  {tx.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-muted-foreground capitalize">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/transactions" className="text-primary hover:underline text-sm mt-4 block">
          View all transactions →
        </Link>
      </CardContent>
    </Card>
  )
}
