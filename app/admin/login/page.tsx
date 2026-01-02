'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Проверяем, не авторизован ли уже пользователь
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push('/admin')
        }
      })
      .catch(() => {
        // Игнорируем ошибки
      })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Неверный пароль')
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-dark-purple-light/90 border-2 border-neon-blue/50 rounded-lg p-8 max-w-md w-full backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neon-blue mb-2">GETSBI play</h1>
          <p className="text-neon-pink text-xl">Админ-панель</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-white mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-purple border border-neon-blue/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50"
              placeholder="Введите пароль"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-neon-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
