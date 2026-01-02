export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(price)
}

export function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    consoles: 'Приставки',
    games: 'Игры',
    accounts: 'Аккаунты',
    controllers: 'Джойстики',
    services: 'Услуги',
  }
  return names[category] || category
}

export function calculateDiscountedPrice(price: number, discount?: number): number {
  if (!discount || discount <= 0) return price
  return price * (1 - discount / 100)
}

export function formatDiscountedPrice(price: number, discount?: number): string {
  const discountedPrice = calculateDiscountedPrice(price, discount)
  return formatPrice(discountedPrice)
}
