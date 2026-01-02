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
