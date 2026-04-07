import Sparkline from './Sparkline'

export default function StatCard({ label, value, change, sparkData }) {
  const isPositive = change && change.startsWith('+')

  return (
    <div className="bg-white rounded-xl border border-surface-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-surface-900 font-heading">{value}</p>
        </div>
        {change && (
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              isPositive
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-red-600 bg-red-50'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      {sparkData && sparkData.length > 0 && (
        <Sparkline data={sparkData} />
      )}
    </div>
  )
}
