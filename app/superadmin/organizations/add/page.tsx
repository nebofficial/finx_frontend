'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import OrgForm from '@/components/superadmin/organizations/org-form'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
export default function AddOrganizationPage() {
  const router = useRouter()
  const onSuccess = () => {
    toast.success('Organization created successfully')
    router.push('/superadmin/organizations')
  }
  return (
    <OrgForm onSuccess={onSuccess} />
  )
}