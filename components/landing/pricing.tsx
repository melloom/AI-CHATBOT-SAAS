"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { chathubPlans, personalAIAgentPlans } from "@/lib/pricing-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, User } from "lucide-react"

export function Pricing() {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your AI Solution</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Whether you need a personal AI assistant or business chatbots, we have the perfect solution for you.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personal AI</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>Company AI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal AI Assistants</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your personal AI assistant for daily tasks, productivity, and professional growth
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {personalAIAgentPlans.map((plan, index) => (
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
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="company" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Business Chatbots</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Intelligent AI chatbots for customer support, lead generation, and business automation
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {chathubPlans.map((plan, index) => (
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
                        {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            All plans include our core features and 24/7 availability
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need a custom solution?{" "}
            <Link href="/personal-ai-agents" className="text-primary hover:underline">
              Check out our professional services
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
