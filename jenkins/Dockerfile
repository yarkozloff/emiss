# Используем официальный образ Jenkins
FROM jenkins/jenkins:lts

# Устанавливаем необходимые зависимости
USER root
RUN apt-get update && \
    apt-get install -y \
    docker.io \
    docker-compose \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Добавляем пользователя jenkins в группу docker
RUN usermod -aG docker jenkins

# Устанавливаем необходимые плагины Jenkins (например, Docker Pipeline)
RUN jenkins-plugin-cli --plugins \
    docker-workflow \
    docker-build-step

# Возвращаемся к пользователю jenkins
USER jenkins

# Открываем порты (по желанию)
EXPOSE 8080 50000

# Запускаем Jenkins
ENTRYPOINT ["jenkins.sh"]
