import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">PayFlow</h1>
          <p className="text-lg text-muted-foreground">
            Send money instantly with UPI. Track expenses with AI-powered insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Login
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-2">Instant Transfers</h3>
            <p className="text-sm text-muted-foreground">Send and receive money instantly via UPI</p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-2">Smart Analytics</h3>
            <p className="text-sm text-muted-foreground">AI-powered expense categorization and insights</p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-2">Secure & Safe</h3>
            <p className="text-sm text-muted-foreground">Bank-level security with encryption</p>
          </div>
        </div>
      </div>
    </div>
  )
}
