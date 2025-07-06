"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ExternalLink, Calendar, DollarSign } from "lucide-react"
import { useSubscription } from "@/hooks/use-subscription"
import { useToast } from "@/hooks/use-toast"

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "month",
    features: ["Up to 3 chatbots", "1,000 conversations/month", "Basic analytics", "Email support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "month",
    features: [
      "Up to 10 chatbots",
      "10,000 conversations/month",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Unlimited chatbots",
      "Unlimited conversations",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
    ],
    current: false,
  },
]

export default function BillingPage() {
  const { subscription } = useSubscription()
  const { toast } = useToast()

  const handleUpgrade = (planName: string) => {
    // TODO: Integrate with Stripe Checkout
    toast({
      title: "Redirecting to checkout...",
      description: `Upgrading to ${planName} plan.`,
    })
  }

  const handleManageBilling = () => {
    // TODO: Open Stripe Customer Portal
    toast({
      title: "Opening billing portal...",
      description: "Redirecting to Stripe billing management.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="text-lg px-3 py-1">
                  {subscription?.plan || "Pro Plan"}
                </Badge>
                <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
                  {subscription?.status || "Active"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{subscription?.price || "$79/month"}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Next billing date</span>
              </div>
              <p className="text-sm font-medium">{subscription?.nextBillingDate || "January 15, 2024"}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Payment method</span>
              </div>
              <p className="text-sm font-medium">**** **** **** {subscription?.lastFour || "4242"}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleManageBilling} variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Track your current usage against plan limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Active Chatbots</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">3 of 10 used</p>
            </div>
            <div>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-sm text-muted-foreground">Conversations</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "28%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">2,847 of 10,000 used</p>
            </div>
            <div>
              <div className="text-2xl font-bold">18</div>
              <p className="text-sm text-muted-foreground">Days Remaining</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Until next billing cycle</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.current && <Badge>Current</Badge>}
                </div>
                <div className="text-3xl font-bold">
                  {plan.price}
                  {plan.period && <span className="text-lg font-normal">/{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                {!plan.current && (
                  <Button
                    className="w-full"
                    variant={plan.name === "Enterprise" ? "outline" : "default"}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Dec 15, 2023", amount: "$79.00", status: "Paid", invoice: "INV-001" },
              { date: "Nov 15, 2023", amount: "$79.00", status: "Paid", invoice: "INV-002" },
              { date: "Oct 15, 2023", amount: "$79.00", status: "Paid", invoice: "INV-003" },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{payment.invoice}</p>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <Badge variant="outline" className="text-xs">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
