const express = require('express')
const router = express.Router()
const Message = require('../models/Message')

// GET /api/messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении сообщений', error: err })
  }
})

// POST /api/messages
router.post('/', async (req, res) => {
  const { name, email, message } = req.body
  try {
    const newMessage = new Message({ name, email, message })
    await newMessage.save()
    res.status(201).json({ message: 'Сообщение успешно отправлено' })
  } catch (err) {
    res.status(400).json({ message: 'Ошибка при отправке сообщения', error: err })
  }
})

// DELETE /api/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Message.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Сообщение не найдено' })
    }
    return res.status(200).json({ message: 'Сообщение удалено' })
  } catch (err) {
    console.error('Ошибка при удалении сообщения:', err)
    return res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router