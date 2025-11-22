import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface ExpenseData {
  description: string
  amount: number
  recipientName: string
}

interface CategorizationResult {
  category: string
  confidence: number
  subcategory?: string
}

export async function categorizeExpense(expense: ExpenseData): Promise<CategorizationResult> {
  try {
    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: `Analyze this transaction and categorize it.

Transaction:
- Description: ${expense.description}
- Amount: ₹${expense.amount}
- Recipient/Merchant: ${expense.recipientName}

Categories available:
1. Food & Dining (restaurants, food delivery, cafes)
2. Transportation (taxi, bus, fuel, parking)
3. Shopping (retail, online shopping)
4. Entertainment (movies, games, hobbies)
5. Utilities (electricity, water, gas)
6. Healthcare (doctors, medicines, hospitals)
7. Education (courses, books, tuition)
8. Travel (flights, hotels, tours)
9. Groceries (supermarket, food stores)
10. Subscription (apps, services)
11. Personal Care (salon, gym, spa)
12. Savings (investments, transfers)
13. Salary (income)
14. Other

Respond in this exact format:
CATEGORY: [main category]
SUBCATEGORY: [specific type if applicable]
CONFIDENCE: [0.0 to 1.0]

Be concise.`,
      temperature: 0.2,
    })

    const lines = text.split("\n").map((l) => l.trim())

    const categoryMatch =
      lines
        .find((l) => l.startsWith("CATEGORY:"))
        ?.split(":")[1]
        ?.trim() || "Other"

    const subcategoryMatch = lines
      .find((l) => l.startsWith("SUBCATEGORY:"))
      ?.split(":")[1]
      ?.trim()

    const confidenceMatch = lines
      .find((l) => l.startsWith("CONFIDENCE:"))
      ?.split(":")[1]
      ?.trim()

    const confidence = confidenceMatch ? Math.min(Math.max(Number.parseFloat(confidenceMatch), 0), 1) : 0.5

    return {
      category: categoryMatch,
      confidence,
      subcategory: subcategoryMatch,
    }
  } catch (error) {
    console.error("Error categorizing expense:", error)
    return {
      category: "Other",
      confidence: 0,
      subcategory: undefined,
    }
  }
}

export function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    "Food & Dining": "🍔",
    Transportation: "🚕",
    Shopping: "🛍️",
    Entertainment: "🎬",
    Utilities: "💡",
    Healthcare: "⚕️",
    Education: "📚",
    Travel: "✈️",
    Groceries: "🛒",
    Subscription: "📱",
    "Personal Care": "💅",
    Savings: "💰",
    Salary: "💵",
    Other: "📌",
  }
  return emojiMap[category] || "📌"
}

export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    "Food & Dining": "bg-orange-100 text-orange-800",
    Transportation: "bg-blue-100 text-blue-800",
    Shopping: "bg-pink-100 text-pink-800",
    Entertainment: "bg-purple-100 text-purple-800",
    Utilities: "bg-yellow-100 text-yellow-800",
    Healthcare: "bg-red-100 text-red-800",
    Education: "bg-indigo-100 text-indigo-800",
    Travel: "bg-teal-100 text-teal-800",
    Groceries: "bg-green-100 text-green-800",
    Subscription: "bg-violet-100 text-violet-800",
    "Personal Care": "bg-rose-100 text-rose-800",
    Savings: "bg-emerald-100 text-emerald-800",
    Salary: "bg-lime-100 text-lime-800",
    Other: "bg-gray-100 text-gray-800",
  }
  return colorMap[category] || "bg-gray-100 text-gray-800"
}
