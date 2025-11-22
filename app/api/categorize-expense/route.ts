import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { description, amount, recipient_name, user_id } = await request.json()

    if (!description || !amount || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use Groq to categorize the expense
    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: `Categorize this transaction into ONE category from this list: 
      Food & Dining, 
      Transportation, 
      Shopping, 
      Entertainment, 
      Utilities, 
      Healthcare, 
      Education, 
      Travel, 
      Groceries, 
      Subscription, 
      Personal Care, 
      Savings, 
      Salary, 
      Other
      
      Transaction details:
      Description: ${description}
      Amount: ₹${amount}
      Recipient: ${recipient_name}
      
      Respond with ONLY the category name and a confidence score (0-1) in this format:
      CATEGORY: [category name]
      CONFIDENCE: [score]`,
      temperature: 0.3,
    })

    const lines = text.split("\n").filter((l) => l.trim())
    const categoryLine =
      lines
        .find((l) => l.includes("CATEGORY:"))
        ?.split(":")[1]
        ?.trim() || "Other"
    const confidenceStr = lines
      .find((l) => l.includes("CONFIDENCE:"))
      ?.split(":")[1]
      ?.trim()
    const confidence = confidenceStr ? Number.parseFloat(confidenceStr) : 0.5

    const category = categoryLine || "Other"

    // Save to database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id,
        amount: Number.parseFloat(amount),
        category,
        description,
        merchant_name: recipient_name,
        ai_categorized: true,
        confidence_score: Math.min(Math.max(confidence, 0), 1),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save expense" }, { status: 500 })
    }

    return NextResponse.json({
      category,
      confidence,
      expense: data,
    })
  } catch (error) {
    console.error("Categorization error:", error)
    return NextResponse.json({ error: "Failed to categorize expense" }, { status: 500 })
  }
}
