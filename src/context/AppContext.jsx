import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { getLatestSets, getSetCards } from '../lib/scryfall'

const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(12450)
  const [unopenedPacks, setUnopenedPacks] = useState([])
  const [collection, setCollection] = useState([])
  const [orders, setOrders] = useState([])

  const [addresses, setAddresses] = useState([])
  const [activeAddressId, setActiveAddressId] = useState(null)

  // — Tarjetas de pago —
  const [paymentCards, setPaymentCards] = useState([])
  const [activeCardId, setActiveCardId] = useState(null)

  // — Sets de Scryfall —
  const [sets, setSets] = useState([])
  const [setsLoading, setSetsLoading] = useState(false)
  const [setsError, setSetsError] = useState(null)
  const setsStarted = useRef(false)

  // — Pools de cartas por set_code —
  const [cardPools, setCardPools] = useState({})
  const cardLoadingRef = useRef(new Set())

  const loadSets = useCallback(async () => {
    if (setsStarted.current) return
    setsStarted.current = true
    setSetsLoading(true)
    setSetsError(null)
    try {
      const data = await getLatestSets(3)
      setSets(data)
    } catch (e) {
      setSetsError('No se pudieron cargar los sets. Verifica tu conexión.')
      setsStarted.current = false // permitir reintentar
    } finally {
      setSetsLoading(false)
    }
  }, [])

  const loadSetCards = useCallback(async (setCode) => {
    if (cardPools[setCode]) return cardPools[setCode]
    if (cardLoadingRef.current.has(setCode)) return null
    cardLoadingRef.current.add(setCode)
    try {
      const cards = await getSetCards(setCode)
      setCardPools((prev) => ({ ...prev, [setCode]: cards }))
      return cards
    } catch (e) {
      console.error('Error cargando cartas del set:', setCode, e)
      return null
    } finally {
      cardLoadingRef.current.delete(setCode)
    }
  }, [cardPools])

  // — Auth —
  const login = useCallback((email) => {
    setUser({ email, name: 'Diego Cárdenas', initials: 'DC', memberSince: '3 MESES' })
  }, [])

  const signup = useCallback((email, name) => {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join('')
    setUser({ email, name, initials, memberSince: '0 MESES' })
    setBalance(0)
  }, [])

  const logout = useCallback(() => setUser(null), [])

  // — Balance —
  const addBalance = useCallback((amount) => setBalance((b) => b + amount), [])
  const deductBalance = useCallback((amount) => setBalance((b) => Math.max(0, b - amount)), [])

  // — Sobres —
  const addPack = useCallback((pack) => {
    setUnopenedPacks((p) => [...p, { ...pack, id: crypto.randomUUID() }])
  }, [])

  const removePack = useCallback((packId) => {
    setUnopenedPacks((p) => p.filter((pk) => pk.id !== packId))
  }, [])

  // — Colección —
  const addCards = useCallback((cards) => {
    setCollection((c) => [...c, ...cards])
  }, [])

  const removeCards = useCallback((cardIds) => {
    setCollection((c) => c.filter((card) => !cardIds.includes(card.instanceId)))
  }, [])

  // — Tarjetas de pago —
  const addPaymentCard = useCallback((card) => {
    const newCard = { ...card, id: crypto.randomUUID() }
    setPaymentCards((prev) => [...prev, newCard])
    setActiveCardId((prev) => prev ?? newCard.id)
    return newCard
  }, [])

  const removePaymentCard = useCallback((id) => {
    setPaymentCards((prev) => {
      const remaining = prev.filter((c) => c.id !== id)
      setActiveCardId((cur) => (cur === id ? (remaining[0]?.id ?? null) : cur))
      return remaining
    })
  }, [])

  const selectPaymentCard = useCallback((id) => setActiveCardId(id), [])

  // — Pedidos —
  const addOrder = useCallback((order) => {
    setOrders((prev) => [{ ...order, id: crypto.randomUUID(), date: new Date().toISOString() }, ...prev])
  }, [])

  // — Direcciones —
  const savedAddress = addresses.find((a) => a.id === activeAddressId) ?? { street: '', commune: '', city: '', region: '' }

  const addAddress = useCallback((addr) => {
    const newAddr = { ...addr, id: crypto.randomUUID() }
    setAddresses((prev) => [...prev, newAddr])
    setActiveAddressId((prev) => prev ?? newAddr.id) // primera dirección queda activa automáticamente
    return newAddr
  }, [])

  const removeAddress = useCallback((id) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id)
      setActiveAddressId((cur) => {
        if (cur !== id) return cur
        return remaining[0]?.id ?? null
      })
      return remaining
    })
  }, [])

  const selectAddress = useCallback((id) => setActiveAddressId(id), [])

  // Compatibilidad con Canjear.jsx
  const updateAddress = useCallback((addr) => {
    if (activeAddressId) {
      setAddresses((prev) => prev.map((a) => a.id === activeAddressId ? { ...a, ...addr } : a))
    } else {
      const newAddr = { ...addr, id: crypto.randomUUID() }
      setAddresses((prev) => [...prev, newAddr])
      setActiveAddressId(newAddr.id)
    }
  }, [activeAddressId])

  const value = {
    user,
    balance,
    unopenedPacks,
    collection,
    orders,
    addOrder,
    paymentCards,
    activeCardId,
    addPaymentCard,
    removePaymentCard,
    selectPaymentCard,
    savedAddress,
    addresses,
    activeAddressId,
    addAddress,
    removeAddress,
    selectAddress,
    sets,
    setsLoading,
    setsError,
    cardPools,
    login,
    signup,
    logout,
    addBalance,
    deductBalance,
    addPack,
    removePack,
    addCards,
    removeCards,
    updateAddress,
    loadSets,
    loadSetCards,
    isAuthenticated: Boolean(user),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
