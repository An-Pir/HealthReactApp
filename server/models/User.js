const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  registeredEvents: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: 'Event',
  default: []
}
}, { timestamps: true })

// хешируем пароль
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 8)
  next()
})

// метод для проверки пароля
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)