# Инструкция по публикации на Render

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на https://github.com/new
2. Создайте новый репозиторий (например, `getsbi-play`)
3. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
4. Скопируйте URL репозитория (например, `https://github.com/ваш-username/getsbi-play.git`)

## Шаг 2: Подключение к GitHub

Выполните в терминале (замените URL на ваш):

```bash
git remote add origin https://github.com/ваш-username/getsbi-play.git
git branch -M main
git push -u origin main
```

## Шаг 3: Создание сервиса на Render

1. Перейдите на https://dashboard.render.com
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub репозиторий
4. Заполните настройки:

### Основные настройки:
- **Name**: `getsbi-play` (или любое другое имя)
- **Region**: выберите ближайший регион
- **Branch**: `main`
- **Root Directory**: оставьте пустым (или `./`)

### Build & Deploy:
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

## Шаг 4: Настройка Environment Variables

В разделе "Environment" добавьте две переменные:

1. **TELEGRAM_BOT_TOKEN**: `7953146305:AAEjT4qYVI7zciK0bx1b2U0Ww41UZUaA-cY`
2. **TELEGRAM_CHAT_ID**: `6920795432`

## Шаг 5: Де deploiй

1. Нажмите "Create Web Service"
2. Дождитесь завершения сборки (обычно 3-5 минут)
3. Ваш сайт будет доступен по адресу: `https://ваш-сервис.onrender.com`

## Важные заметки:

- Первый деплой может занять несколько минут
- Render бесплатно предоставляет бесплатный план, но сайт может "засыпать" после 15 минут бездействия
- Для продакшена рассмотрите платные планы или другие хостинги
- Все товары хранятся в LocalStorage браузера (данные не синхронизируются между устройствами)

## Обновление сайта:

После каждого изменения в коде:

```bash
git add .
git commit -m "Описание изменений"
git push
```

Render автоматически пересоберет и перезапустит сайт.
