import { useCallback, useEffect, useState } from 'react'

const BASE_URL = 'https://api.frankfurter.dev/v1'

export function useCurrencyList() {
  const [currencies, setCurrencies] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${BASE_URL}/currencies`)
      .then((res) => {
        if (!res.ok) throw new Error(`Currency list request failed (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setCurrencies(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { currencies, error }
}

export function useLatestRate(base, target) {
  const [rate, setRate] = useState(null)
  const [date, setDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(() => {
    if (!base || !target || base === target) {
      setRate(1)
      setDate(null)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`${BASE_URL}/latest?base=${base}&symbols=${target}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Rate request failed (${res.status})`)
        return res.json()
      })
      .then((data) => {
        setRate(data.rates?.[target] ?? null)
        setDate(data.date ?? null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [base, target])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { rate, date, loading, error, refresh }
}

export function useHistory(base, target, days = 30) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!base || !target || base === target) {
      setHistory([])
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    const fmt = (d) => d.toISOString().split('T')[0]

    fetch(`${BASE_URL}/${fmt(start)}..${fmt(end)}?base=${base}&symbols=${target}`)
      .then((res) => {
        if (!res.ok) throw new Error(`History request failed (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        const series = Object.entries(data.rates ?? {})
          .map(([d, vals]) => ({ date: d, rate: vals[target] }))
          .sort((a, b) => (a.date > b.date ? 1 : -1))
        setHistory(series)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [base, target, days])

  return { history, loading, error }
}