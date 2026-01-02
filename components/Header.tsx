'use client'

import Link from 'next/link'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const categories = [
    { name: 'Приставки', href: '/catalog?category=consoles' },
    { name: 'Игры', href: '/catalog?category=games' },
    { name: 'Аккаунты', href: '/catalog?category=accounts' },
    { name: 'Джойстики', href: '/catalog?category=controllers' },
    { name: 'Услуги', href: '/catalog?category=services' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-dark-purple/95 backdrop-blur-sm border-b border-neon-blue/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-3xl md:text-4xl font-bold text-neon-blue group-hover:scale-105 transition-transform">
              GETSBI
            </div>
            <span className="text-lg md:text-xl text-neon-pink hidden sm:block" style={{ fontFamily: 'cursive' }}>
              play
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full bg-dark-purple-light/50 border border-neon-blue/50 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue w-5 h-5" />
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-white hover:text-neon-blue transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/cart"
              className="flex items-center space-x-2 text-neon-pink hover:text-neon-pink/80 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden xl:inline">Корзина</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-neon-blue p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-neon-blue/30 pt-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="w-full bg-dark-purple-light/50 border border-neon-blue/50 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue w-5 h-5" />
              </div>
            </form>

            {/* Mobile Nav */}
            <nav className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-neon-blue transition-colors py-2"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-neon-pink hover:text-neon-pink/80 transition-colors py-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Корзина</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
