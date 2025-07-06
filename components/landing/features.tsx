import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Brain, Code } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "24/7 AI Chat Support",
    description: "Your AI chatbots are always available to answer customer questions, even when your team is offline.",
  },
  {
    icon: Brain,
    title: "Company-Specific Training",
    description: "Train your bots with your documentation, FAQs, and knowledge base for accurate, relevant responses.",
  },
  {
    icon: Code,
    title: "No Code Setup",
    description: "Easy configuration through our intuitive interface. No technical skills or coding required.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need for AI customer support
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to help you provide exceptional customer service with AI
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow glass-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base dark:text-gray-300">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
