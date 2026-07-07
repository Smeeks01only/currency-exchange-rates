import { useEffect, useState } from 'react'

const BASE_URL = 'https://api.frankfurter.dev/v1'
const WATCHLIST = ['EUR', 'GBP', 'ZAR', 'JPY', 'CNY', 'INR', 'CHF', 'AUD']

export default function TickerBoard() {
  const [rates, setRates] = useState(null)
  const [date, setDate] = useState(null)

  useEffect(() => {
    fetch(`${BASE_URL}/latest?base=USD&symbols=${WATCHLIST.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        setRates(data.rates)
        setDate(data.date)
      })
      .catch(() => {
        setRates(null)
      })
  }, [])

  const entries = rates ? Object.entries(rates) : []
  // Duplicate the row so the CSS marquee can loop seamlessly.
  const strip = [...entries, ...entries]

  return (
    <div className="ticker-board" aria-label="Live exchange rate board">
      <div className="ticker-board__label">
        <span>USD BASE</span>
        <span className="ticker-board__date">{date ?? '—'}</span>
      </div>
      <div className="ticker-board__track">
        <div className="ticker-board__strip">
          {strip.length === 0 && <span className="ticker-board__loading">Loading rates…</span>}
          {strip.map(([code, value], i) => (
            <span className="ticker-board__item" key={`${code}-${i}`}>
              <span className="ticker-board__code">USD/{code}</span>
              <span className="ticker-board__value">{value.toFixed(4)}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}