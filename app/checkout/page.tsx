'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product, CartItem, OrderItem } from '@/lib/types'
import { getProducts, getCart, clearCart } from '@/lib/storage'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })

  useEffect(() => {
    const cart = getCart()
    const products = getProducts()
    
    const items: CartItem[] = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return product ? { product, quantity: item.quantity } : null
      })
      .filter((item): item is CartItem => item !== null)

    setCartItems(items)
    setTotal(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }))

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          customerName: formData.customerName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          notes: formData.notes,
          total,
        }),
      })

      if (response.ok) {
        clearCart()
        alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.')
        router.push('/')
      } else {
        throw new Error('Ошибка при отправке заказа')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-2xl text-gray-400 mb-4">Ваша корзина пуста</p>
        <Link
          href="/catalog"
          className="text-neon-blue hover:underline"
        >
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/cart"
        className="inline-flex items-center text-neon-blue hover:text-neon-blue/80 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Назад в корзину
      </Link>

      <h1 className="text-4xl font-bold text-neon-blue mb-8">Оформление заказа</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-dark-purple-light/50 border-2 border-neon-blue/30 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-white mb-2">
                Имя <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50"
                placeholder="Введите ваше имя"
              />
            </div>

            <div>
              <label className="block text-white mb-2">
                Телефон <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50"
                placeholder="+7 (999) 999-99-99"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Адрес доставки</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50 resize-none"
                placeholder="Укажите адрес доставки (если требуется)"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Комментарий к заказу</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50 resize-none"
                placeholder="Дополнительная информация о заказе"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-neon-blue flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Отправка...' : 'Отправить заказ'}</span>
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-purple-light/50 border-2 border-neon-blue/30 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-neon-blue mb-6">Ваш заказ</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start pb-4 border-b border-neon-blue/30">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="text-neon-pink font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neon-blue/30 pt-4">
              <div className="flex justify-between text-2xl font-bold text-neon-pink mb-4">
                <span>Итого:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
