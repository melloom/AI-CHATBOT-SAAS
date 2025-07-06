"use client"

import { Suspense, lazy, ComponentType } from 'react'
import { Skeleton } from './skeleton'

interface LazyLoadProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback || <Skeleton className="w-full h-32" />}>
      {children}
    </Suspense>
  )
}

export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props: any) {
    return (
      <Suspense fallback={fallback || <Skeleton className="w-full h-32" />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
} 