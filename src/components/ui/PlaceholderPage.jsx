/**
 * PLACEHOLDER PAGE TEMPLATE
 * -------------------------
 * Reusable coming-soon page for sections under construction.
 */

import clsx from 'clsx'
import { Construction } from 'lucide-react'

export default function PlaceholderPage({ title, description, icon: Icon = Construction, badge }) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center">
          <Icon size={18} className="text-brand-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {badge && <span className="badge-brand mt-0.5">{badge}</span>}
        </div>
      </div>

      {/* Content card */}
      <div className="card p-10 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-surface-900 border border-surface-700 flex items-center justify-center">
          <Icon size={28} className="text-surface-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-surface-400 text-sm mt-1 max-w-md">{description}</p>
        </div>
        <div className="flex gap-3 mt-2">
          <span className="badge bg-surface-800 border border-surface-700 text-surface-400">
            En desarrollo
          </span>
          <span className="badge bg-surface-800 border border-surface-700 text-surface-400">
            Próximamente
          </span>
        </div>
      </div>

      {/* Skeleton rows */}
      <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-4/6 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-3 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
