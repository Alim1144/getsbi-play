import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark-purple-light border-t border-neon-blue/30 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-neon-blue mb-4">GETSBI play</h3>
            <p className="text-gray-400">
              Ваш надежный партнер в мире игровых приставок и аксессуаров
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-neon-pink mb-4">Категории</h4>
            <ul className="space-y-2">
              <li><Link href="/catalog?category=consoles" className="text-gray-400 hover:text-neon-blue transition-colors">Приставки</Link></li>
              <li><Link href="/catalog?category=games" className="text-gray-400 hover:text-neon-blue transition-colors">Игры</Link></li>
              <li><Link href="/catalog?category=accounts" className="text-gray-400 hover:text-neon-blue transition-colors">Аккаунты</Link></li>
              <li><Link href="/catalog?category=controllers" className="text-gray-400 hover:text-neon-blue transition-colors">Джойстики</Link></li>
              <li><Link href="/catalog?category=services" className="text-gray-400 hover:text-neon-blue transition-colors">Услуги</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-neon-pink mb-4">Информация</h4>
            <ul className="space-y-2">
              <li><Link href="/admin" className="text-gray-400 hover:text-neon-blue transition-colors">Админ-панель</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neon-blue/30 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GETSBI play. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
