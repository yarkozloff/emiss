const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models/db'); // Подключение к базе данных
const apiRoutes = require('./routes/api'); // Импорт маршрутов

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Используем маршруты
app.use('/api', apiRoutes);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
