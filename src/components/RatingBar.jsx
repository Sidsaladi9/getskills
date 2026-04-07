export default function RatingBar({ distribution = [0, 0, 0, 0, 0] }) {
  const max = Math.max(...distribution, 1)

  return (
    <div className="flex flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star - 1] || 0
        const pct = (count / max) * 100
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-8 text-right text-surface-500 font-medium">
              {star} <span className="text-amber-400">&#9733;</span>
            </span>
            <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: '#FF6B6B',
                }}
              />
            </div>
            <span className="w-8 text-surface-400 text-xs">{count}</span>
          </div>
        )
      })}
    </div>
  )
}
