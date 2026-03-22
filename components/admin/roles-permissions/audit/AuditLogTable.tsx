import { AuditLogItem } from '../types'
import { AuditRow } from './AuditRow'

export function AuditLogTable({ logs }: { logs: AuditLogItem[] }) {
  return (
    <div className="rounded-lg border border-rose-500/30 p-3 bg-black/20">
      <div className="grid grid-cols-4 gap-3 text-xs uppercase text-rose-200 pb-2 border-b border-rose-500/20">
        <p>Actor</p>
        <p>Action</p>
        <p>Resource</p>
        <p>Timestamp</p>
      </div>
      <div>
        {logs.map((log) => <AuditRow key={log.id} log={log} />)}
      </div>
    </div>
  )
}
