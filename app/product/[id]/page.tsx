'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { getProducts } from '@/lib/storage'
import { formatPrice, formatDiscountedPrice, calculateDiscountedPrice, getCategoryName } from '@/lib/utils'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const products = getProducts()
    const foundProduct = products.find((p) => p.id === params.id)
    setProduct(foundProduct || null)
  }, [params.id])

  const addToCart = () => {
    if (!product) return

    const cart = JSON.parse(localStorage.getItem('getsbi-cart') || '[]')
    const existingItem = cart.find((item: any) => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ productId: product.id, quantity })
    }

    localStorage.setItem('getsbi-cart', JSON.stringify(cart))
    router.push('/cart')
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-2xl text-gray-400 mb-4">Товар не найден</p>
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
        href="/catalog"
        className="inline-flex items-center text-neon-blue hover:text-neon-blue/80 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Назад в каталог
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {product.images.length > 0 ? (
            <>
              <div className="relative w-full h-96 bg-dark-purple rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-full h-20 bg-dark-purple rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-neon-blue'
                          : 'border-transparent hover:border-neon-blue/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-96 bg-dark-purple rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Нет фото</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="text-sm text-neon-pink mb-2">
            {getCategoryName(product.category)}
          </div>
          <h1 className="text-4xl font-bold text-neon-blue mb-4">{product.name}</h1>
          <div className="mb-6">
            {product.discount && product.discount > 0 ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <div className="text-4xl font-bold text-neon-pink">
                    {formatDiscountedPrice(product.price, product.discount)}
                  </div>
                  <div className="text-xl text-gray-400 line-through mt-1">
                    {formatPrice(product.price)}
                  </div>
                </div>
                <span className="bg-neon-pink/20 text-neon-pink px-4 py-2 rounded-lg text-lg font-bold">
                  -{product.discount}%
                </span>
              </div>
            ) : (
              <div className="text-4xl font-bold text-neon-pink">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neon-blue mb-2">Описание</h3>
            <p className="text-gray-300 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="border-t border-neon-blue/30 pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <label className="text-white">Количество:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={addToCart}
              className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-neon-blue flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Добавить в корзину</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
