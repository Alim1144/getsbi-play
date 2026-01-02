'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductCategory } from '@/lib/types'
import { getProducts, saveProduct, deleteProduct } from '@/lib/storage'
import { getCategoryName } from '@/lib/utils'
import { Plus, Trash2, Edit, X, Upload } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'consoles' as ProductCategory,
    images: [] as string[],
  })

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const imageFiles = Array.from(files).slice(0, 6)
    const newImages: string[] = []

    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImages.push(reader.result as string)
        if (newImages.length === imageFiles.length) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages].slice(0, 6),
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      images: formData.images,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveProduct(product)
    setProducts(getProducts())
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'consoles',
      images: [],
    })
    setEditingProduct(null)
    setIsFormOpen(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: product.images,
    })
    setIsFormOpen(true)
  }

  const handleDelete = (productId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(productId)
      setProducts(getProducts())
    }
  }

  const categories: ProductCategory[] = ['consoles', 'games', 'accounts', 'controllers', 'services']

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-neon-blue">Админ-панель</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить товар</span>
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-purple-light border-2 border-neon-blue rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neon-blue">
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Название товара</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Описание</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Цена (₽)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Категория</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getCategoryName(cat)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Фотографии (до 6 штук, {formData.images.length}/6)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={formData.images.length >= 6}
                  className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neon-blue/20 file:text-neon-blue hover:file:bg-neon-blue/30"
                />
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-neon-blue/50"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-3 rounded-lg transition-all"
                >
                  {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-dark-purple hover:bg-dark-purple-light border-2 border-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-dark-purple-light/50 border-2 border-neon-blue/30 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4 flex-1">
                {product.images.length > 0 && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neon-blue">{product.name}</h3>
                  <p className="text-sm text-gray-400">
                    {getCategoryName(product.category)} • {product.price} ₽
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 text-neon-blue hover:bg-neon-blue/20 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400 mb-4">Нет товаров</p>
            <p className="text-gray-500">Добавьте первый товар, чтобы начать</p>
          </div>
        )}
      </div>
    </div>
  )
}
