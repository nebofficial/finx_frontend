import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface AuditLog {
  id: string
  action: string
  actor: string
  resource: string
  status: 'success' | 'failure'
  timestamp: string
}

const auditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'User Created',
    actor: 'admin@example.com',
    resource: 'john@example.com',
    status: 'success',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    action: 'API Key Generated',
    actor: 'admin@example.com',
    resource: 'sk_live_123456',
    status: 'success',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    action: 'Webhook Updated',
    actor: 'manager@example.com',
    resource: 'wh_payment',
    status: 'success',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    action: 'Settings Changed',
    actor: 'admin@example.com',
    resource: 'system.timezone',
    status: 'success',
    timestamp: '1 day ago',
  },
  {
    id: '5',
    action: 'Failed Login Attempt',
    actor: 'unknown@example.com',
    resource: 'login',
    status: 'failure',
    timestamp: '2 days ago',
  },
]

const statusColors = {
  success: 'bg-green-100 text-green-800',
  failure: 'bg-red-100 text-red-800',
}

export default function AuditLogs() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Audit Logs</CardTitle>
        <CardDescription className="text-muted-foreground">
          System activity and security audit trail
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted">
                <TableHead className="text-card-foreground">Action</TableHead>
                <TableHead className="text-card-foreground">Actor</TableHead>
                <TableHead className="text-card-foreground">Resource</TableHead>
                <TableHead className="text-card-foreground">Status</TableHead>
                <TableHead className="text-card-foreground">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-card-foreground">{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.actor}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {log.resource}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[log.status]}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
