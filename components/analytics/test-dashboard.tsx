"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TestDashboard() {
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Test Analytics Dashboard</h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Card 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a test card to check layout</p>
            <Button className="mt-2">Test Button</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Card 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Another test card</p>
            <Button className="mt-2">Another Button</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Card 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Third test card</p>
            <Button className="mt-2">Third Button</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Card 4</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Fourth test card</p>
            <Button className="mt-2">Fourth Button</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>Window Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}</div>
              <div>Window Height: {typeof window !== 'undefined' ? window.innerHeight : 'N/A'}</div>
              <div>Document Width: {typeof document !== 'undefined' ? document.documentElement.clientWidth : 'N/A'}</div>
              <div>Document Height: {typeof document !== 'undefined' ? document.documentElement.clientHeight : 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 