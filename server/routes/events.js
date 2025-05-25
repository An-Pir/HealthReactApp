const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const {
  verifyToken,
  verifyTokenOptional,
  isAdmin,
} = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

const router = express.Router();

// ——— Multer (memory storage) ———
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Только изображения'), false);
    }
    cb(null, true);
  },
});

// ——— Validators ———
const eventValidators = [
  body('title').notEmpty().withMessage('Title обязателен'),
  body('date').notEmpty().isISO8601().withMessage('Date в формате ISO'),
  body('description').notEmpty().withMessage('Description обязателен'),
];

// ——— Вспомогательный маппер в DTO ———
function toDTO(ev) {
  const { _id, title, date, description, fullText } = ev;
  const dto = { _id, title, date, description, fullText };
  if (ev.image) dto.imageUrl = `/api/events/${_id}/image`;
  return dto;
}

// ——— CREATE EVENT ———
router.post(
  '/',
  verifyToken,
  isAdmin,
  upload.single('image'),
  eventValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const ev = new Event({
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        fullText: req.body.fullText || '',
        image: req.file?.buffer,
        imageType: req.file?.mimetype,
      });
      await ev.save();
      res.status(201).json(toDTO(ev.toObject()));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
);

// ——— UPDATE EVENT ———
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.single('image'),
  eventValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const ev = await Event.findById(req.params.id);
      if (!ev) {
        return res.status(404).json({ message: 'Событие не найдено' });
      }
      Object.assign(ev, {
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        fullText: req.body.fullText || '',
      });
      if (req.file) {
        ev.image = req.file.buffer;
        ev.imageType = req.file.mimetype;
      }
      await ev.save();
      res.json(toDTO(ev.toObject()));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
);

// ——— GET UPCOMING EVENTS ———
router.get('/upcoming', verifyTokenOptional, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const now = new Date();
    const events = await Event.find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(limit)
      .lean();

    res.json(events.map(toDTO));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Ошибка при получении предстоящих событий' });
  }
});

// ——— GET ALL EVENTS ———
router.get('/', verifyTokenOptional, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).lean();

    res.json(events.map(toDTO));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ——— GET IMAGE BINARY ———
router.get('/:id/image', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).select('image imageType');
    if (!ev?.image) {
      return res.status(404).json({ message: 'Изображение не найдено' });
    }
    res.type(ev.imageType).send(ev.image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Неверный ID' });
  }
});

// ——— DELETE EVENT ———
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Событие удалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ——— Multer error handler ———
router.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    err.message === 'Только изображения'
  ) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// ——— REGISTER ON EVENT ———
router.post('/:id/register', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    // Проверка на валидный ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Неверный ID события' });
    }

    // Убедимся, что событие существует и еще не прошло
    const ev = await Event.findById(eventId).lean();
    if (!ev) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }
    if (new Date(ev.date) < new Date()) {
      return res
        .status(400)
        .json({ message: 'Нельзя регистрироваться на прошедшее событие' });
    }

    // Добавляем eventId в массив registeredEvents, без дублей
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { registeredEvents: eventId } },
      { new: true }
    ).select('registeredEvents');

    return res.json({
      message: 'Вы успешно зарегистрированы на событие',
      registeredEvents: user.registeredEvents,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ——— UNREGISTER FROM EVENT ———
router.delete('/:id/register', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Неверный ID события' });
    }

    const ev = await Event.findById(eventId).lean();
    if (!ev) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    // Убираем eventId из массива registeredEvents
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { registeredEvents: eventId } },
      { new: true }
    ).select('registeredEvents');

    return res.json({
      message: 'Регистрация на событие отменена',
      registeredEvents: user.registeredEvents,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
