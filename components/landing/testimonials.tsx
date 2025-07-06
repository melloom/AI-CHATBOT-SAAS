"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote:
      "ChatBot Pro transformed our customer support. We're now handling 3x more inquiries with the same team size.",
    author: "Sarah Johnson",
    title: "Customer Success Manager",
    company: "TechFlow Inc.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The setup was incredibly easy. We had our first chatbot running in under 10 minutes. The ROI has been fantastic.",
    author: "Michael Chen",
    title: "Operations Director",
    company: "E-commerce Plus",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "Our customers love the instant responses. Support tickets are down 60% and satisfaction scores are at an all-time high.",
    author: "Emily Rodriguez",
    title: "Head of Support",
    company: "SaaS Solutions",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted by growing businesses</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">See what our customers are saying about ChatBot Pro</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Card className="bg-white dark:bg-gray-800/50 shadow-lg glass-card">
              <CardContent className="p-8 text-center">
                <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonials[currentIndex].avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonials[currentIndex].author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonials[currentIndex].author}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{testimonials[currentIndex].title}</div>
                    <div className="text-sm text-primary font-medium">{testimonials[currentIndex].company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button variant="outline" size="icon" onClick={goToPrevious} className="glass-dark">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>

              <Button variant="outline" size="icon" onClick={goToNext} className="glass-dark">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
