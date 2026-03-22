'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TicketResponseForm({ ticketId }: { ticketId: string }) {
  const [response, setResponse] = useState('')
  const [template, setTemplate] = useState('')
  const [isSending, setIsSending] = useState(false)

  const templates = [
    { value: 'investigation', label: 'I am investigating this issue' },
    { value: 'resolved', label: 'This issue has been resolved' },
    { value: 'more-info', label: 'I need more information to resolve this' },
    { value: 'escalate', label: 'I am escalating this to our development team' },
  ]

  const handleApplyTemplate = (templateValue: string) => {
    const selectedTemplate = templates.find(t => t.value === templateValue)
    if (selectedTemplate) {
      setResponse(selectedTemplate.label)
      setTemplate(templateValue)
    }
  }

  const handleSend = async () => {
    if (!response.trim()) return
    setIsSending(true)
    // Simulate API call
    setTimeout(() => {
      setIsSending(false)
      setResponse('')
      setTemplate('')
    }, 1000)
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Add Response</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Quick Templates</label>
          <Select value={template} onValueChange={handleApplyTemplate}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Select a template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Your Response</label>
          <Textarea
            placeholder="Type your response here..."
            rows={6}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="border-gray-300 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline">Save Draft</Button>
          <Button 
            onClick={handleSend}
            disabled={isSending || !response.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {isSending ? 'Sending...' : 'Send Response'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
