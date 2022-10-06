import * as dotenv from 'dotenv'
dotenv.config()

import TelegramApi from 'node-telegram-bot-api'
import { againOptions, gameOptions } from './options'

const token = process.env.TELEGRAM_TOKEN as string

const bot = new TelegramApi(token, { polling: true })

const chats = {} as any

const startGame = async (chatId: number) => {
  await bot.sendMessage(
    chatId,
    `Давай я загадаю число от 0 до 9. Сможешь отгадать? :)`
  )
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Давай отгадывай!', gameOptions as any)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Информация о пользователе' },
    { command: '/game', description: 'Угадайка' },
  ])

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
      return startGame(chatId)
    }

    return bot.sendMessage(
      chatId,
      `Привет, красавчик! Ты написал мне какую-то хрень :(`
    )
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message?.chat.id!

    if (data === '/again') {
      return startGame(chatId)
    }

    if (data === chats[chatId].toString()) {
      return (
        await bot.sendSticker(
          chatId,
          `https://tlgrm.eu/_/stickers/4ea/1cd/4ea1cd7d-6b79-3e89-a718-0e83b9f04749/9.webp`
        ),
        await bot.sendMessage(
          chatId,
          `Ты крут! Отгадал! Это действительно число ${data}.`
        ),
        againOptions
      )
    } else {
      return bot.sendMessage(
        chatId,
        `Лузер! Я загадала число ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
