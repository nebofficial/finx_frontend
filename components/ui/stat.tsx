'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function Stat({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1', className)} {...props} />
}

function StatLabel({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm font-medium leading-none text-muted-foreground', className)}
      {...props}
    />
  )
}

function StatNumber({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-2xl font-semibold tabular-nums', className)} {...props} />
}

export { Stat, StatLabel, StatNumber }
