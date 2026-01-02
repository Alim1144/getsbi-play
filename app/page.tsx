import Link from 'next/link'
import { Gamepad2, Disc, User, Joystick, Settings } from 'lucide-react'

export default function Home() {
  const categories = [
    {
      name: 'Приставки',
      icon: Gamepad2,
      href: '/catalog?category=consoles',
      description: 'PS5, PS4 и другие игровые консоли',
      color: 'neon-blue',
    },
    {
      name: 'Игры',
      icon: Disc,
      href: '/catalog?category=games',
      description: 'Диски с играми для PlayStation',
      color: 'neon-pink',
    },
    {
      name: 'Аккаунты',
      icon: User,
      href: '/catalog?category=accounts',
      description: 'Игровые аккаунты с играми',
      color: 'neon-blue',
    },
    {
      name: 'Джойстики',
      icon: Joystick,
      href: '/catalog?category=controllers',
      description: 'Геймпады и контроллеры',
      color: 'neon-pink',
    },
    {
      name: 'Услуги',
      icon: Settings,
      href: '/catalog?category=services',
      description: 'Настройка и скупка приставок',
      color: 'neon-blue',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-neon-blue mb-4">
          GETSBI
          <span className="text-3xl md:text-5xl text-neon-pink ml-3" style={{ fontFamily: 'cursive' }}>
            play
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Игровые приставки, игры и аксессуары
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-neon-blue/20 hover:bg-neon-blue/30 border-2 border-neon-blue text-neon-blue font-semibold px-8 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-neon-blue"
        >
          Перейти в каталог
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.map((category) => {
          const Icon = category.icon
          const isBlue = category.color === 'neon-blue'
          
          return (
            <Link
              key={category.name}
              href={category.href}
              className={`group relative bg-dark-purple-light/50 border-2 rounded-lg p-6 hover:scale-105 transition-all ${
                isBlue
                  ? 'border-neon-blue/50 hover:border-neon-blue hover:shadow-neon-blue'
                  : 'border-neon-pink/50 hover:border-neon-pink hover:shadow-neon-pink'
              }`}
            >
              <div className={`inline-block p-4 rounded-lg mb-4 ${
                isBlue ? 'bg-neon-blue/20' : 'bg-neon-pink/20'
              }`}>
                <Icon className={`w-8 h-8 ${isBlue ? 'text-neon-blue' : 'text-neon-pink'}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isBlue ? 'text-neon-blue' : 'text-neon-pink'}`}>
                {category.name}
              </h3>
              <p className="text-gray-400">{category.description}</p>
            </Link>
          )
        })}
      </div>

      {/* Features Section */}
      <div className="bg-dark-purple-light/30 rounded-lg p-8 border border-neon-blue/30">
        <h2 className="text-3xl font-bold text-neon-blue text-center mb-8">
          Почему выбирают нас?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-neon-pink mb-2">Широкий ассортимент</h3>
            <p className="text-gray-400">Приставки, игры, аккаунты и аксессуары</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-neon-pink mb-2">Быстрая доставка</h3>
            <p className="text-gray-400">Быстрое оформление и отправка заказов</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-neon-pink mb-2">Гарантия качества</h3>
            <p className="text-gray-400">Проверенные товары и надежные аккаунты</p>
          </div>
        </div>
      </div>
    </div>
  )
}
