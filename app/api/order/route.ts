import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Get Telegram bot token and chat ID from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured')
      return NextResponse.json(
        { error: 'Telegram не настроен. Пожалуйста, настройте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в переменных окружения.' },
        { status: 500 }
      )
    }

    // Format order message
    let message = `🛒 <b>Новый заказ</b>\n\n`
    message += `👤 <b>Имя:</b> ${orderData.customerName}\n`
    message += `📞 <b>Телефон:</b> ${orderData.phone}\n`
    
    if (orderData.email) {
      message += `📧 <b>Email:</b> ${orderData.email}\n`
    }
    
    if (orderData.address) {
      message += `📍 <b>Адрес:</b> ${orderData.address}\n`
    }
    
    message += `\n📦 <b>Товары:</b>\n`
    orderData.items.forEach((item: any) => {
      message += `• ${item.productName} × ${item.quantity} = ${item.price * item.quantity} ₽\n`
    })
    
    message += `\n💰 <b>Итого:</b> ${orderData.total} ₽\n`
    
    if (orderData.notes) {
      message += `\n💬 <b>Комментарий:</b> ${orderData.notes}\n`
    }

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Telegram API error:', errorData)
      return NextResponse.json(
        { error: 'Ошибка при отправке заказа в Telegram' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
