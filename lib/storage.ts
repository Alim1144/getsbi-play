import { Product } from './types'

const STORAGE_KEY = 'getsbi-products'
const CART_KEY = 'getsbi-cart'
const API_BASE = '/api/products'

// Асинхронные функции для работы с товарами (через API/MongoDB)
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_BASE, {
      cache: 'no-store',
    })
    
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Error fetching products from API:', error)
  }
  
  // Fallback на localStorage
  return getProductsFromLocalStorage()
}

export async function saveProduct(product: Product): Promise<void> {
  try {
    const productToSave = {
      ...product,
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString(),
    }

    const isNew = !product.id || product.id === ''
    const response = await fetch(API_BASE, {
      method: isNew ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productToSave),
    })

    if (response.ok) {
      return // Успешно сохранено в БД
    }

    console.warn('Save product via API failed, fallback to localStorage', response.status)
  } catch (error) {
    console.error('Error saving product to API:', error)
  }
  
  // Fallback на localStorage
  saveProductToLocalStorage(product)
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}?id=${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      return // Успешно удалено из БД
    }

    console.warn('Delete product via API failed, fallback to localStorage', response.status)
  } catch (error) {
    console.error('Error deleting product from API:', error)
  }
  
  // Fallback на localStorage
  deleteProductFromLocalStorage(productId)
}

// Функции для работы с localStorage (fallback)
function getProductsFromLocalStorage(): Product[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveProductToLocalStorage(product: Product): void {
  if (typeof window === 'undefined') return
  
  const products = getProductsFromLocalStorage()
  const existingIndex = products.findIndex((p) => p.id === product.id)
  
  if (existingIndex >= 0) {
    products[existingIndex] = product
  } else {
    products.push(product)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function deleteProductFromLocalStorage(productId: string): void {
  if (typeof window === 'undefined') return
  
  const products = getProductsFromLocalStorage().filter((p) => p.id !== productId)
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
