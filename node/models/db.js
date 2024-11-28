const { Pool } = require('pg');

// Настройки подключения к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST, // Здесь используем переменную окружения
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432, // Порт PostgreSQL
});

module.exports = pool;
