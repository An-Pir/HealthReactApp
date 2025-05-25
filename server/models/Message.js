const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Создает поля createdAt и updatedAt
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;