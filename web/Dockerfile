# Используем официальный образ Nginx
FROM nginx:alpine

# Копируем содержимое вашего сайта в директорию Nginx
COPY . /usr/share/nginx/html

# Копируем файл конфигурации Nginx (если нужен)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80
