const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String , required: true },
  image: Buffer, // тут храним изображение как бинарные данные
  imageType: String,
  priceChildren: {type: Number },
  priceAdults: {type: Number },
});

module.exports = mongoose.model('Service', ServiceSchema);