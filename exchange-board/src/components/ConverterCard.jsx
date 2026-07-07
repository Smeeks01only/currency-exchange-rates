export default function ConverterCard({
  currencies,
  from,
  to,
  amount,
  onFromChange,
  onToChange,
  onAmountChange,
  onSwap,
  rate,
  date,
  loading,
  error,
}) {
  const codes = currencies ? Object.keys(currencies).sort() : []
  const converted = rate != null && amount !== '' ? (Number(amount) * rate).toFixed(2) : null

  return (
    <section className="converter-card">
      <div className="converter-card__row converter-card__row--amount">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>

      <div className="converter-card__row converter-card__row--pair">
        <div className="converter-card__field">
          <label htmlFor="from">From</label>
          <select id="from" value={from} onChange={(e) => onFromChange(e.target.value)}>
            {codes.map((code) => (
              <option key={code} value={code}>
                {code} — {currencies[code]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="converter-card__swap"
          onClick={onSwap}
          aria-label="Swap currencies"
          title="Swap currencies"
        >
          ⇄
        </button>

        <div className="converter-card__field">
          <label htmlFor="to">To</label>
          <select id="to" value={to} onChange={(e) => onToChange(e.target.value)}>
            {codes.map((code) => (
              <option key={code} value={code}>
                {code} — {currencies[code]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="converter-card__result">
        {error && <p className="converter-card__error">Couldn't reach the rate service. Try again shortly.</p>}
        {!error && loading && <p className="converter-card__loading">Fetching rate…</p>}
        {!error && !loading && converted !== null && (
          <>
            <span className="converter-card__figure">
              {converted} <span className="converter-card__code">{to}</span>
            </span>
            <span className="converter-card__meta">
              1 {from} = {rate?.toFixed(6)} {to}
              {date && <> · rates as of {date}</>}
            </span>
          </>
        )}
      </div>
    </section>
  )
}