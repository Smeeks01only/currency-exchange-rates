import { useState } from 'react'
import TickerBoard from './components/TickerBoard.jsx'
import ConverterCard from './components/ConverterCard.jsx'
import TrendChart from './components/TrendChart.jsx'
import { useCurrencyList, useLatestRate, useHistory } from './hooks/useFrankfurter.js'

export default function App() {
  const { currencies, error: currenciesError } = useCurrencyList()
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('ZAR')
  const [amount, setAmount] = useState('100')

  const { rate, date, loading: rateLoading, error: rateError } = useLatestRate(from, to)
  const { history, loading: historyLoading, error: historyError } = useHistory(from, to, 30)

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="page">
      <TickerBoard />

      <main className="page__main">
        <header className="page__header">
          <p className="page__eyebrow">Reference rates · European Central Bank via Frankfurter</p>
          <h1 className="page__title">Exchange Board</h1>
          <p className="page__subtitle">
            Live mid-market rates, no markup, updated once daily. Built for quick cross-border quotes.
          </p>
        </header>

        {currenciesError && (
          <p className="page__error">Couldn't load the currency list. Refresh to try again.</p>
        )}

        <ConverterCard
          currencies={currencies}
          from={from}
          to={to}
          amount={amount}
          onFromChange={setFrom}
          onToChange={setTo}
          onAmountChange={setAmount}
          onSwap={handleSwap}
          rate={rate}
          date={date}
          loading={rateLoading}
          error={rateError}
        />

        <TrendChart history={history} from={from} to={to} loading={historyLoading} error={historyError} />

        <footer className="page__footer">
          <p>
            Data from <a href="https://frankfurter.dev" target="_blank" rel="noreferrer">Frankfurter</a>,
            sourced from European Central Bank reference rates. Rates update once per working day around 16:00 CET
            and are mid-market — actual bank or transfer rates will include a spread.
          </p>
        </footer>
      </main>
    </div>
  )
}