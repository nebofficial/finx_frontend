'use client'

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function TicketDetails({ ticket }: { ticket: any }) {
  return (
    <div className="space-y-4">
      {ticket.messages.map((message: any) => (
        <Card key={message.id} className={`p-6 ${message.type === 'support' ? 'bg-blue-50 border-blue-100' : ''}`}>
          <div className="flex gap-4">
            <Avatar>
              <AvatarFallback className={message.type === 'support' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-900'}>
                {message.author.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{message.author}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  message.type === 'support' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                }`}>
                  {message.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleString()}</p>
              <p className="text-gray-900 mt-3 leading-relaxed">{message.content}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
