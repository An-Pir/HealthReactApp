const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    fullText: { type: String, default: '' },
    image: { type: Buffer }, // бинарные данные
    imageType: { type: String }, // MIME-тип, например "image/png"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
