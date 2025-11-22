"use client"

import { useState } from "react"

interface CategorizationResult {
  category: string
  confidence: number
}

export function useExpenseCategorizer() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categorize = async (
    description: string,
    amount: number,
    recipientName: string,
    userId: string,
  ): Promise<CategorizationResult | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/categorize-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          amount,
          recipient_name: recipientName,
          user_id: userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to categorize expense")
      }

      const data = await response.json()
      return {
        category: data.category,
        confidence: data.confidence,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { categorize, isLoading, error }
}
