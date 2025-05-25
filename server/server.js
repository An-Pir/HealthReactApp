require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const authRoutes    = require('./routes/auth');
const eventsRoutes  = require('./routes/events');
const serviceRoutes = require('./routes/services');
const messagesRouter = require('./routes/messages');

const app = express();


// ————— CORS —————
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} запрещён`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// ————— JSON-парсер —————
app.use(express.json());

// ————— Монтируем ваши роуты —————
app.use('/api/auth',   authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messagesRouter);

// ————— Подключаемся к БД и стартуем сервер —————
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });