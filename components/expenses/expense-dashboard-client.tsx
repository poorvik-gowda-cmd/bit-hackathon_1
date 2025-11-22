"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getCategoryEmoji, getCategoryColor } from "@/lib/ai/expense-categorizer"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface ExpenseDashboardClientProps {
  expenses: any[]
  userId: string
}

export default function ExpenseDashboardClient({ expenses, userId }: ExpenseDashboardClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("month")

  // Calculate statistics
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const byCategory = expenses.reduce(
      (acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const topCategory = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0]

    const average = expenses.length > 0 ? total / expenses.length : 0

    return {
      total,
      count: expenses.length,
      average,
      byCategory,
      topCategory,
    }
  }, [expenses])

  // Prepare chart data
  const categoryChartData = Object.entries(stats.byCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B88B",
    "#82E0AA",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Expenses</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₹
                {stats.total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.count}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₹
                {stats.average.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {stats.topCategory ? `${stats.topCategory[0].split("")[0]}...` : "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${value.toLocaleString("en-IN")}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.byCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount], index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryEmoji(category)}</span>
                        <span className="font-medium">{category}</span>
                      </div>
                      <span className="font-semibold">
                        ₹
                        {amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>{expenses.length} expenses this month</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-2 rounded-lg ${getCategoryColor(expense.category)}`}>
                        <span className="text-lg">{getCategoryEmoji(expense.category)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{expense.merchant_name || expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {expense.category}
                          {expense.ai_categorized && (
                            <span className="ml-1">
                              (Confidence: {((expense.confidence_score || 0) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹
                        {expense.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No expenses yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
