import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "month",
    description: "Perfect for small businesses getting started",
    features: [
      "Up to 3 chatbots",
      "1,000 conversations/month",
      "Basic analytics",
      "Email support",
      "Standard templates",
      "Mobile responsive",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "month",
    description: "Best for growing businesses",
    features: [
      "Up to 10 chatbots",
      "10,000 conversations/month",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
      "Team collaboration",
      "Multi-language support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "month",
    description: "For large organizations",
    features: [
      "Unlimited chatbots",
      "Unlimited conversations",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
      "On-premise deployment",
    ],
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans include a 14-day free trial. 
            Need hosting or web development? <Link href="/web-building" className="text-primary hover:underline">Check out our professional services</Link>.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative glass-card ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl dark:text-white">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-primary">
                  {plan.price}
                  {plan.period && <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/{plan.period}</span>}
                </div>
                <CardDescription className="dark:text-gray-300">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">All plans include our core features and 24/7 chatbot availability</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need a custom solution?{" "}
            <Link href="/web-building" className="text-primary hover:underline">
              Check out our professional services
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
