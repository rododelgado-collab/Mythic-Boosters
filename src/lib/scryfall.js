const BASE = 'https://api.scryfall.com'
const USD_TO_CLP = 950

const DEFAULT_PRICES = {
  mythic: 8000,
  rare: 1500,
  uncommon: 300,
  common: 100,
}

// Caché a nivel de módulo para no repetir fetches en la misma sesión
const _cache = { sets: null, cards: {} }

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * Retorna los últimos N sets de expansión/core ya lanzados.
 */
export async function getLatestSets(count = 3) {
  if (_cache.sets) return _cache.sets

  const res = await fetch(`${BASE}/sets`)
  if (!res.ok) throw new Error('No se pudieron cargar los sets de Scryfall')
  const data = await res.json()

  const today = new Date().toISOString().split('T')[0]
  const main = data.data
    .filter(
      (s) =>
        ['expansion', 'core'].includes(s.set_type) &&
        s.released_at <= today &&
        s.card_count >= 100
    )
    .sort((a, b) => b.released_at.localeCompare(a.released_at))
    .slice(0, count)

  _cache.sets = main
  return main
}

/**
 * Descarga todas las cartas de un set (maneja paginación de Scryfall).
 */
export async function getSetCards(setCode) {
  if (_cache.cards[setCode]) return _cache.cards[setCode]

  const cards = []
  let url = `${BASE}/cards/search?q=set:${setCode}+game:paper&unique=cards`

  try {
    while (url) {
      await sleep(80) // respetar rate limit de Scryfall
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Scryfall error ${res.status}`)
      const data = await res.json()
      if (data.object === 'error') break
      cards.push(...data.data)
      url = data.has_more ? data.next_page : null
    }
  } catch (e) {
    if (cards.length === 0) throw e // sin cartas → propagar error al caller
  }

  if (cards.length > 0) _cache.cards[setCode] = cards
  return cards
}

/**
 * Convierte una carta raw de Scryfall al formato interno de la app.
 */
export function toAppCard(raw) {
  const usd = parseFloat(raw.prices?.usd ?? raw.prices?.usd_foil ?? '0')
  return {
    scryfallId: raw.id,
    name: raw.name,
    type: raw.type_line ?? '',
    rulesText: raw.oracle_text ?? raw.card_faces?.[0]?.oracle_text ?? '',
    imageUri: raw.image_uris?.normal ?? raw.card_faces?.[0]?.image_uris?.normal ?? null,
    rarity: raw.rarity,
    marketPrice: usd > 0 ? Math.round(usd * USD_TO_CLP) : DEFAULT_PRICES[raw.rarity] ?? 100,
    power: raw.power ?? null,
    toughness: raw.toughness ?? null,
    cost: (raw.mana_cost ?? raw.card_faces?.[0]?.mana_cost ?? '')
      .replace(/[{}]/g, '')
      .match(/[0-9WUBRGCXYZ]+/g) ?? [],
    art: null,
  }
}

/**
 * Genera un sobre de 15 cartas (10C + 4U + 1R/M) a partir del pool raw de Scryfall.
 */
export function generatePack(rawCards) {
  const byRarity = {
    common: rawCards.filter((c) => c.rarity === 'common'),
    uncommon: rawCards.filter((c) => c.rarity === 'uncommon'),
    rare: rawCards.filter((c) => c.rarity === 'rare'),
    mythic: rawCards.filter((c) => c.rarity === 'mythic'),
  }

  const pick = (arr) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null)

  const result = []
  for (let i = 0; i < 10; i++) {
    const c = pick(byRarity.common)
    if (c) result.push(c)
  }
  for (let i = 0; i < 4; i++) {
    const c = pick(byRarity.uncommon)
    if (c) result.push(c)
  }

  const isMythic = Math.random() < 0.125 && byRarity.mythic.length > 0
  const rareCard =
    pick(isMythic ? byRarity.mythic : byRarity.rare) ??
    pick(byRarity.rare) ??
    pick(byRarity.mythic)
  if (rareCard) result.push(rareCard)

  return result.map((raw) => ({ ...toAppCard(raw), instanceId: crypto.randomUUID() }))
}
