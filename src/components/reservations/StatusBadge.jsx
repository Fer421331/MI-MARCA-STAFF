/**
 * StatusBadge — Enterprise status badge component
 */
import clsx from 'clsx'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../mock/reservationsData'

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status]
  if (!cfg) return <span className="badge">{status}</span>
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.bg, cfg.text, cfg.border)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority]
  if (!cfg) return <span className="badge">{priority}</span>
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', cfg.bg, cfg.text, cfg.border)}>
      {priority}
    </span>
  )
}
