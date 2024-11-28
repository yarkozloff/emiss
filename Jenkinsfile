pipeline {
    agent any
    stages {
        stage('1 Build emiss-api') {
            steps {
                script {
                    // Переходим в директорию первого приложения
                    dir('node') {
                        // Собираем Docker образ для первого приложения
                        sh '/usr/local/bin/docker build -t yar-emiss-api .'
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
                            yar-emiss-api
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
                        sh '/usr/local/bin/docker build -t yar-emiss-web .'
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
                            -p 8080:80 \
                            yar-emiss-web
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
