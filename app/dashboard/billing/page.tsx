"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, ExternalLink, Calendar, DollarSign, Plus, Trash2, Shield } from "lucide-react"
import { useSubscription } from "@/hooks/use-subscription"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand?: string
  expiryMonth?: string
  expiryYear?: string
  isDefault: boolean
  createdAt: string
}

export default function BillingPage() {
  const { subscription } = useSubscription()
  const { user } = useAuth()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [cardData, setCardData] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: ''
  })

  const handleManageBilling = () => {
    toast({
      title: "Opening billing portal...",
      description: "Redirecting to Stripe billing management.",
    })
  }

  const handleAddCard = async () => {
    if (!user) return

    try {
      // Validate card data
      if (!cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvc || !cardData.name) {
        toast({
          title: "Validation Error",
          description: "Please fill in all card details.",
          variant: "destructive"
        })
        return
      }

      // Create new payment method
      const newPaymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        last4: cardData.number.slice(-4),
        brand: getCardBrand(cardData.number),
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        isDefault: paymentMethods.length === 0,
        createdAt: new Date().toISOString()
      }

      // Update Firestore
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        paymentMethods: [...paymentMethods, newPaymentMethod],
        updatedAt: new Date().toISOString()
      })

      setPaymentMethods([...paymentMethods, newPaymentMethod])
      setCardData({ number: '', expiryMonth: '', expiryYear: '', cvc: '', name: '' })
      setIsAddingCard(false)

      toast({
        title: "Success",
        description: "Payment method added successfully.",
      })
    } catch (error) {
      console.error('Error adding payment method:', error)
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRemoveCard = async (cardId: string) => {
    if (!user) return

    try {
      const updatedMethods = paymentMethods.filter(method => method.id !== cardId)
      
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        paymentMethods: updatedMethods,
        updatedAt: new Date().toISOString()
      })

      setPaymentMethods(updatedMethods)
      toast({
        title: "Success",
        description: "Payment method removed successfully.",
      })
    } catch (error) {
      console.error('Error removing payment method:', error)
      toast({
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getCardBrand = (number: string): string => {
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5')) return 'Mastercard'
    if (number.startsWith('3')) return 'American Express'
    if (number.startsWith('6')) return 'Discover'
    return 'Unknown'
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
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
          {subscription ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {subscription.plan}
                  </Badge>
                  <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                    {subscription.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{subscription.price}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next billing date</span>
                </div>
                <p className="text-sm font-medium">{subscription.nextBillingDate}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Payment method</span>
                </div>
                <p className="text-sm font-medium">**** **** **** {subscription.lastFour}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No subscription data available.</div>
          )}
          <div className="mt-4">
            <Button onClick={handleManageBilling} variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payment methods securely</CardDescription>
            </div>
            <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card. Your payment information is encrypted and secure.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiryMonth">Expiry Month</Label>
                      <Select value={cardData.expiryMonth} onValueChange={(value) => setCardData({...cardData, expiryMonth: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                            <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expiryYear">Expiry Year</Label>
                      <Select value={cardData.expiryYear} onValueChange={(value) => setCardData({...cardData, expiryYear: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
                        maxLength={4}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingCard(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCard}>
                    Add Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCard(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No payment methods added yet.</p>
              <p className="text-sm">Add a payment method to manage your billing.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
