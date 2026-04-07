export default function Sparkline({ data = [], color = '#FF6B6B', height = 32 }) {
  if (!data.length) return null
  const max = Math.max(...data)

  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm min-w-[3px]"
          style={{
            height: `${max > 0 ? (value / max) * 100 : 0}%`,
            backgroundColor: color,
            opacity: 0.4 + (value / max) * 0.6,
          }}
        />
      ))}
    </div>
  )
}
