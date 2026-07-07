import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="trend-chart__tooltip">
      <div className="trend-chart__tooltip-date">{label}</div>
      <div className="trend-chart__tooltip-rate">{payload[0].value.toFixed(4)}</div>
    </div>
  )
}

export default function TrendChart({ history, from, to, loading, error }) {
  if (error) {
    return <p className="trend-chart__error">History unavailable right now.</p>
  }

  if (loading || history.length === 0) {
    return <p className="trend-chart__loading">{loading ? 'Loading 30-day trend…' : 'No history for this pair.'}</p>
  }

  const first = history[0].rate
  const last = history[history.length - 1].rate
  const changePct = (((last - first) / first) * 100).toFixed(2)
  const isUp = last >= first

  return (
    <div className="trend-chart">
      <div className="trend-chart__header">
        <span className="trend-chart__title">
          30-day trend · {from}/{to}
        </span>
        <span className={`trend-chart__change ${isUp ? 'is-up' : 'is-down'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(changePct)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={history} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <XAxis dataKey="date" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={isUp ? 'var(--rate-up)' : 'var(--rate-down)'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}