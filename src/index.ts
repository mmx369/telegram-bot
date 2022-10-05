import * as dotenv from 'dotenv'
dotenv.config()

import TelegramApi from 'node-telegram-bot-api'

const token = process.env.TELEGRAM_TOKEN as string

const bot = new TelegramApi(token, { polling: true })

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/info', description: 'Информация о пользователе' },
  { command: '/game', description: 'Угадайка' },
])

const chats = {} as any

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: 'Текст кнопки', callback_data: 'dasdsa' }]],
  }),
}

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        `https://tlgrm.eu/_/stickers/4ea/1cd/4ea1cd7d-6b79-3e89-a718-0e83b9f04749/4.webp`
      )
      return bot.sendMessage(chatId, `Добро пожаловать в бот mmx369!`)
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Привет, ${msg.chat.first_name}! Ты просто красавчик!`
      )
    }

    if (text === '/game') {
      await bot.sendMessage(
        chatId,
        `Давай я загадаю число от 0 до 9. Сможешь отгадать? :)`
      )
      const randomNumber = Math.floor(Math.random() * 10)
      chats[chatId] = randomNumber
      return bot.sendMessage(chatId, 'Давай отгадывай!', gameOptions as any)
    }

    return bot.sendMessage(
      chatId,
      `Привет, красавчик! Ты написал мне какую-то хрень - ${text} :(`
    )
  })
}

start()
