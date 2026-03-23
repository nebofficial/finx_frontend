'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import { tenantNotificationApi } from '@/services/api/tenantNotificationApi'
import { toast } from 'sonner'

const ANNOUNCEMENT_TYPES = new Set(['announcement', 'maintenance', 'billing', 'system'])

type Row = {
  id: string
  title: string
  message: string
  type?: string
  channel?: string[]
  createdAt?: string
  status?: string
}

export default function AnnouncementsList() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tenantNotificationApi.list({ limit: 200 })
      const list = (res.data?.data?.notifications || []) as Row[]
      const filtered = list.filter((n) => ANNOUNCEMENT_TYPES.has(String(n.type || '')))
      setRows(filtered)
    } catch {
      toast.error('Failed to load notifications.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <Card className="p-8 flex items-center gap-2 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading…
      </Card>
    )
  }

  if (rows.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-600 text-sm">
        No announcement-style notifications in this tenant yet. Use Send to create campaigns (API: POST /notifications/send).
      </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-700 font-semibold">Title</TableHead>
            <TableHead className="text-gray-700 font-semibold">Type</TableHead>
            <TableHead className="text-gray-700 font-semibold">Channels</TableHead>
            <TableHead className="text-gray-700 font-semibold">Preview</TableHead>
            <TableHead className="text-gray-700 font-semibold">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((n) => (
            <TableRow key={n.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">{n.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                  {n.type || '—'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {(n.channel || []).map((ch) => (
                    <Badge key={ch} variant="outline" className="text-xs">
                      {ch}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-gray-600 text-sm max-w-xs truncate">{n.message}</TableCell>
              <TableCell className="text-gray-600 text-sm">
                {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
