const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ Mongo error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));

app.listen(5000, "0.0.0.0", () => console.log('🚀 Server running on http://localhost:5000'));
