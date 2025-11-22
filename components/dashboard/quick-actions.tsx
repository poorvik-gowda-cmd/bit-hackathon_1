import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function QuickActions() {
  return (
    <Card>
      <div className="p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/send-money">
            <Button variant="outline" className="w-full bg-transparent">
              Send Money
            </Button>
          </Link>
          <Link href="/request-money">
            <Button variant="outline" className="w-full bg-transparent">
              Request Money
            </Button>
          </Link>
          <Link href="/add-money">
            <Button variant="outline" className="w-full bg-transparent">
              Add Money
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full bg-transparent">
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
