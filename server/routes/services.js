const express = require('express');
const router = express.Router();
const multer = require('multer');
const Service = require('../models/Service')

// Настраиваем multer для хранения файлов в памяти
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Создание услуги с изображением
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, priceChildren, priceAdults } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null;
    const imageType = req.file ? req.file.mimetype : null;

    const newService = new Service({
      name,
      description,
      image: imageBuffer,
      imageType,
      priceChildren,
      priceAdults,
    });
    await newService.save();
    res.json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при сохранении услуги' });
  }
});

// Обновление услуги
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priceChildren, priceAdults } = req.body;
    const updateData = {
      name,
      description,
      priceChildren,
      priceAdults,
    };
    if (req.file) {
      updateData.image = req.file.buffer;
      updateData.imageType = req.file.mimetype;
    }
    const service = await Service.findByIdAndUpdate(id, updateData, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении услуги' });
  }
});

// Получение всех услуг
router.get('/', async (req, res) => {
  const services = await Service.find()
  const result = services.map(s => {
    const obj = s.toObject()
    if (obj.image && obj.imageType) {
      // создаём data-url: data:<mime>;base64,<данные>
      obj.imageUrl = `data:${obj.imageType};base64,${obj.image.toString('base64')}`
    } else {
      obj.imageUrl = null
    }
    // можно удалить сами поля image и imageType, чтобы не гонять лишний буфер
    delete obj.image
    delete obj.imageType
    return obj
  })
  res.json(result)
})

// Удаление услуги
router.delete('/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Удалено' });
});

// Эндпоинт для получения изображения
// GET /api/services/image/:id
router.get('/image/:id', async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service || !service.image) {
    return res.status(404).json({ message: 'Изображение не найдено' });
  }
  res.set('Content-Type', service.imageType);
  res.send(service.image);
});

module.exports = router;