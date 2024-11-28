# Указываем базовый образ
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Экспортируем порт, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "server.js"]
