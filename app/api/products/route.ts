import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Product } from '@/lib/types'

export async function GET() {
  try {
    const db = await getDatabase()
    if (!db) {
      return NextResponse.json([]) // Возвращаем пустой массив если БД не настроена
    }
    const products = await db.collection<Product>('products').find({}).toArray()
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json([]) // Возвращаем пустой массив при ошибке
  }
}

export async function POST(request: NextRequest) {
  try {
    const product: Product = await request.json()
    
    // Убеждаемся, что есть ID
    if (!product.id) {
      product.id = Date.now().toString()
    }
    
    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: 'База данных не настроена. Добавьте MONGODB_URI в переменные окружения.' },
        { status: 500 }
      )
    }
    
    // Используем upsert для обновления или создания
    await db.collection('products').updateOne(
      { id: product.id },
      { $set: product },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true, id: product.id })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании товара' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const product: Product = await request.json()
    
    if (!product.id) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: 'База данных не настроена. Добавьте MONGODB_URI в переменные окружения.' },
        { status: 500 }
      )
    }
    
    await db.collection('products').updateOne(
      { id: product.id },
      { $set: product },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении товара' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: 'База данных не настроена. Добавьте MONGODB_URI в переменные окружения.' },
        { status: 500 }
      )
    }
    
    await db.collection('products').deleteOne({ id })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    )
  }
}