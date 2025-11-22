import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BalanceCardProps {
  balance: number
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-sm font-medium opacity-90">Total Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-4xl font-bold">
            ₹
            {balance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-sm opacity-80">Available for transactions</p>
        </div>
      </CardContent>
    </Card>
  )
}
