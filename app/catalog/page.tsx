'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Product, ProductCategory } from '@/lib/types'
import { getProducts } from '@/lib/storage'
import { formatPrice, getCategoryName } from '@/lib/utils'

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  )
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const categories: ProductCategory[] = ['consoles', 'games', 'accounts', 'controllers', 'services']

  useEffect(() => {
    const allProducts = getProducts()
    setProducts(allProducts)
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-neon-blue mb-8">Каталог товаров</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category Filter */}
        <div>
          <h3 className="text-xl font-semibold text-neon-pink mb-3">Категории</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                selectedCategory === null
                  ? 'border-neon-blue bg-neon-blue/20 text-neon-blue'
                  : 'border-neon-blue/50 text-white hover:border-neon-blue'
              }`}
            >
              Все
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedCategory === cat
                    ? 'border-neon-blue bg-neon-blue/20 text-neon-blue'
                    : 'border-neon-blue/50 text-white hover:border-neon-blue'
                }`}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию или описанию..."
            className="w-full md:w-96 bg-dark-purple-light/50 border border-neon-blue/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group bg-dark-purple-light/50 border-2 border-neon-blue/30 rounded-lg overflow-hidden hover:border-neon-blue hover:scale-105 transition-all"
            >
              {product.images.length > 0 ? (
                <div className="relative w-full h-48 bg-dark-purple">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-dark-purple flex items-center justify-center">
                  <span className="text-gray-500">Нет фото</span>
                </div>
              )}
              <div className="p-4">
                <div className="text-sm text-neon-pink mb-2">
                  {getCategoryName(product.category)}
                </div>
                <h3 className="text-xl font-bold text-neon-blue mb-2 group-hover:text-neon-blue/80">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-neon-pink">
                  {formatPrice(product.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400 mb-4">Товары не найдены</p>
          <p className="text-gray-500">
            {products.length === 0
              ? 'Каталог пуст. Добавьте товары через админ-панель.'
              : 'Попробуйте изменить параметры поиска или фильтры.'}
          </p>
          {products.length === 0 && (
            <Link
              href="/admin"
              className="inline-block mt-6 bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-2 rounded-lg transition-all"
            >
              Добавить товар
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
