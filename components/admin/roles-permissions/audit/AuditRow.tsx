import { AuditLogItem } from '../types'

export function AuditRow({ log }: { log: AuditLogItem }) {
  return (
    <div className="grid grid-cols-4 gap-3 text-sm border-b border-rose-500/20 py-2">
      <p>{log.actor_email || '-'}</p>
      <p>{log.action}</p>
      <p>{log.resource || '-'}</p>
      <p>{new Date(log.createdAt).toLocaleString()}</p>
    </div>
  )
}
