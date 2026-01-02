export type ProductCategory = 'consoles' | 'games' | 'accounts' | 'controllers' | 'services'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  items: OrderItem[]
  customerName: string
  phone: string
  email?: string
  address?: string
  notes?: string
  total: number
  createdAt: string
}
