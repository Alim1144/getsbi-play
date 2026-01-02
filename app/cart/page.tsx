'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product, CartItem } from '@/lib/types'
import { getProducts, getCart, clearCart } from '@/lib/storage'
import { formatPrice, formatDiscountedPrice, calculateDiscountedPrice, getCategoryName } from '@/lib/utils'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    updateCart()
  }, [])

  const updateCart = () => {
    const cart = getCart()
    const products = getProducts()
    
    const items: CartItem[] = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return product ? { product, quantity: item.quantity } : null
      })
      .filter((item): item is CartItem => item !== null)

    setCartItems(items)
    setTotal(items.reduce((sum, item) => {
      const price = calculateDiscountedPrice(item.product.price, item.product.discount)
      return sum + price * item.quantity
    }, 0))
  }

  const removeFromCart = (productId: string) => {
    const cart = getCart().filter((item) => item.productId !== productId)
    localStorage.setItem('getsbi-cart', JSON.stringify(cart))
    updateCart()
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const cart = getCart()
    const item = cart.find((item) => item.productId === productId)
    
    if (item) {
      item.quantity = quantity
      localStorage.setItem('getsbi-cart', JSON.stringify(cart))
      updateCart()
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/catalog"
        className="inline-flex items-center text-neon-blue hover:text-neon-blue/80 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Вернуться в каталог
      </Link>

      <h1 className="text-4xl font-bold text-neon-blue mb-8">Корзина</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-dark-purple-light/50 border-2 border-neon-blue/30 rounded-lg p-4 flex items-center space-x-4"
              >
                {item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-dark-purple rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Нет фото</span>
                  </div>
                )}

                <div className="flex-1">
                  <Link
                    href={`/product/${item.product.id}`}
                    className="text-xl font-bold text-neon-blue hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-400">{getCategoryName(item.product.category)}</p>
                  <div className="text-lg font-semibold text-neon-pink mt-2">
                    {item.product.discount && item.product.discount > 0 ? (
                      <div className="flex flex-col">
                        <span>{formatDiscountedPrice(item.product.price, item.product.discount)}</span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                    ) : (
                      formatPrice(item.product.price)
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 border-2 border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-white font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 border-2 border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-purple-light/50 border-2 border-neon-blue/30 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-neon-blue mb-6">Итого</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Товаров: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="border-t border-neon-blue/30 pt-4">
                  <div className="flex justify-between text-2xl font-bold text-neon-pink">
                    <span>Сумма:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-neon-blue flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Оформить заказ</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400 mb-4">Корзина пуста</p>
          <Link
            href="/catalog"
            className="inline-block bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-2 rounded-lg transition-all"
          >
            Перейти в каталог
          </Link>
        </div>
      )}
    </div>
  )
}
