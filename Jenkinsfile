pipeline {
    agent any
    stages {
        stage('1 Build emiss-api') {
            steps {
                script {
                    // Переходим в директорию первого приложения
                    dir('node') {
                        // Собираем Docker образ для первого приложения
                        sh """
                            /usr/local/bin/docker stop emiss-api || true && \
                            /usr/local/bin/docker rm emiss-api || true && \
                            /usr/local/bin/docker build -t emiss-api .
                        """
                    }
                }
            }
        }
        stage('2 Run emiss-api') {
            steps {
                script {
                    // Запускаем контейнер для первого приложения
                    sh """
                        /usr/local/bin/docker run -d \
                            --name emiss-api \
                            -p 3000:3000 \
                            -e DB_USER=postgres \
                            -e DB_HOST=host.docker.internal \
                            -e DB_NAME=russtat \
                            -e DB_PASSWORD=postgres \
                            -e DB_PORT=5432 \
                            emiss-api
                    """
                }
            }
        }

        stage('3 Build emiss-web') {
            steps {
                script {
                    // Переходим в директорию первого приложения
                    dir('web') {
                        // Собираем Docker образ для первого приложения
                        sh """
                            /usr/local/bin/docker stop emiss-web || true && \
                            /usr/local/bin/docker rm emiss-web || true && \
                            /usr/local/bin/docker build -t emiss-web .
                        """
                    }
                }
            }
        }
        stage('4 Run emiss-web') {
            steps {
                script {
                    // Запускаем контейнер для первого приложения
                    sh """
                        /usr/local/bin/docker run -d \
                            --name emiss-web \
                            -p 88:80 \
                            emiss-web
                    """
                }
            }
        }
    }
    post {
        always {
            // Очистка рабочей директории после завершения
            cleanWs()
        }
    }
}
