export const PACKS = [
  {
    id: 'arcana',
    set: 'ARCANA',
    name: 'Edición Arcana',
    price: 4990,
    description: '15 cartas · 1 rara o superior garantizada',
    cardsPerPack: 15,
    accent: '#edc653',
    state: 'available',
  },
  {
    id: 'bosque',
    set: 'BOSQUE ETERNO',
    name: 'Bosque Eterno',
    price: 3990,
    description: '15 cartas con temática verde',
    cardsPerPack: 15,
    accent: '#22c55e',
    state: 'available',
  },
  {
    id: 'llamas',
    set: 'LLAMAS DE RATH',
    name: 'Llamas de Rath',
    price: 4490,
    description: '15 cartas con temática roja',
    cardsPerPack: 15,
    accent: '#ef4444',
    state: 'available',
  },
  {
    id: 'torre',
    set: 'TORRE AZUL',
    name: 'Torre Azul',
    price: 5990,
    description: '15 cartas con temática azul',
    cardsPerPack: 15,
    accent: '#0ea5e9',
    state: 'soldOut',
  },
]

const CARD_POOL = [
  { name: 'Dragón Ancestral', type: 'CRIATURA — DRAGÓN', cost: ['R','R','R'], power: 7, toughness: 7, rulesText: 'Volar, prisa. Al entrar al campo, inflige 3 de daño a cualquier objetivo.', art: '🐉', marketPrice: 10500 },
  { name: 'Fénix Eterno', type: 'CRIATURA — FÉNIX', cost: ['R','R','R'], power: 5, toughness: 4, rulesText: 'Volar. Cuando muere, regresa al campo al comienzo de tu siguiente turno.', art: '🔥', marketPrice: 9800 },
  { name: 'Dios del Abismo', type: 'CRIATURA — DIOS', cost: ['B','B','B','B'], power: 8, toughness: 8, rulesText: 'Indestructible. Las criaturas oponentes entran indefensas.', art: '👁', marketPrice: 12300 },
  { name: 'Hechicero de Jhess', type: 'CRIATURA — HECHICERO', cost: ['U','U'], power: 2, toughness: 3, rulesText: 'Al entrar, roba una carta.', art: '🧙', marketPrice: 2100 },
  { name: 'Guardián Sacro', type: 'CRIATURA — ÁNGEL', cost: ['W','W','W'], power: 4, toughness: 4, rulesText: 'Volar, vínculo vital.', art: '😇', marketPrice: 1800 },
  { name: 'Druida del Bosque', type: 'CRIATURA — DRUIDA', cost: ['G','G'], power: 2, toughness: 2, rulesText: 'Toca: añade GG a tu reserva de maná.', art: '🌿', marketPrice: 1500 },
  { name: 'Aniquilación', type: 'HECHIZO — INSTANTÁNEO', cost: ['B','B','B'], rulesText: 'Destruye una criatura objetivo. No puede ser regenerada.', art: '💀', marketPrice: 2400 },
  { name: 'Relámpago Divino', type: 'HECHIZO — CONJURO', cost: ['R','R'], rulesText: 'Inflige 4 puntos de daño repartidos como quieras.', art: '⚡', marketPrice: 1900 },
  { name: 'Caballero Resoluto', type: 'CRIATURA — CABALLERO', cost: ['W','W'], power: 2, toughness: 2, rulesText: 'Doble ataque.', art: '⚔️', marketPrice: 450 },
  { name: 'Contrahechizo', type: 'HECHIZO — INSTANTÁNEO', cost: ['U','U'], rulesText: 'Contrarresta un hechizo objetivo.', art: '🌀', marketPrice: 380 },
  { name: 'Goblin Incendiario', type: 'CRIATURA — GOBLIN', cost: ['R'], power: 1, toughness: 1, rulesText: 'Al morir, inflige 1 a cada criatura.', art: '👹', marketPrice: 320 },
  { name: 'Elfa de Llanowar', type: 'CRIATURA — ELFO', cost: ['G'], power: 1, toughness: 1, rulesText: 'Toca: añade G.', art: '🧝', marketPrice: 290 },
  { name: 'Soldado Humano', type: 'CRIATURA — HUMANO', cost: ['W'], power: 1, toughness: 2, rulesText: '', art: '💂', marketPrice: 80 },
  { name: 'Rata Callejera', type: 'CRIATURA — RATA', cost: ['B'], power: 1, toughness: 1, rulesText: '', art: '🐀', marketPrice: 60 },
  { name: 'Osito Valiente', type: 'CRIATURA — OSO', cost: ['G','G'], power: 2, toughness: 2, rulesText: '', art: '🐻', marketPrice: 75 },
  { name: 'Pez Tritón', type: 'CRIATURA — TRITÓN', cost: ['U'], power: 1, toughness: 3, rulesText: 'No puede bloquear.', art: '🐟', marketPrice: 65 },
  { name: 'Aprendiz Rojo', type: 'CRIATURA — HECHICERO', cost: ['R'], power: 1, toughness: 2, rulesText: '', art: '🧑', marketPrice: 70 },
  { name: 'Pajarillo', type: 'CRIATURA — AVE', cost: ['W'], power: 1, toughness: 1, rulesText: 'Volar.', art: '🐦', marketPrice: 90 },
  { name: 'Serpiente del Mar', type: 'CRIATURA — SERPIENTE', cost: ['U','U'], power: 3, toughness: 2, rulesText: '', art: '🐍', marketPrice: 85 },
]

function rarityFromPrice(price) {
  if (price >= 7000) return 'mythic'
  if (price >= 1000) return 'rare'
  if (price >= 200) return 'uncommon'
  return 'common'
}

const POOL_WITH_RARITY = CARD_POOL.map((c) => ({ ...c, rarity: rarityFromPrice(c.marketPrice) }))

const byRarity = {
  mythic: POOL_WITH_RARITY.filter((c) => c.rarity === 'mythic'),
  rare: POOL_WITH_RARITY.filter((c) => c.rarity === 'rare'),
  uncommon: POOL_WITH_RARITY.filter((c) => c.rarity === 'uncommon'),
  common: POOL_WITH_RARITY.filter((c) => c.rarity === 'common'),
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generatePackContents() {
  const cards = []
  for (let i = 0; i < 10; i++) {
    cards.push({ ...pickRandom(byRarity.common), instanceId: crypto.randomUUID() })
  }
  for (let i = 0; i < 4; i++) {
    cards.push({ ...pickRandom(byRarity.uncommon), instanceId: crypto.randomUUID() })
  }
  const isMythic = Math.random() < 0.05
  cards.push({
    ...pickRandom(isMythic ? byRarity.mythic : byRarity.rare),
    instanceId: crypto.randomUUID(),
  })
  return cards
}