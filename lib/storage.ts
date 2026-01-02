import { Product } from './types'

const STORAGE_KEY = 'getsbi-products'
const CART_KEY = 'getsbi-cart'

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveProduct(product: Product): void {
  if (typeof window === 'undefined') return
  
  const products = getProducts()
  const existingIndex = products.findIndex((p) => p.id === product.id)
  
  if (existingIndex >= 0) {
    products[existingIndex] = product
  } else {
    products.push(product)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function deleteProduct(productId: string): void {
  if (typeof window === 'undefined') return
  
  const products = getProducts().filter((p) => p.id !== productId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function getCart(): Array<{ productId: string; quantity: number }> {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveCart(cart: Array<{ productId: string; quantity: number }>): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(CART_KEY)
}
