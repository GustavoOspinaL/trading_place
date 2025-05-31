pipeline {
    agent any

    tools {
        nodejs 'Node_24'
    }

    environment {
        VITE_ENV = 'development'
    }

    stages {

        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/GustavoOspinaL/trading_place.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Construir proyecto') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Preparar carpeta para el resultado de los tests') {
            steps {
                sh 'mkdir -p test-results'
            }
        }

        stage('Pruebas Unitarias') {
            steps {
                echo 'Ejecutando pruebas...'
                sh 'npm run test'
            }
        }

        stage('Pruebas en Paralelo') {
            parallel {
                stage('Pruebas Chrome') {
                    steps {
                        script {
                            try {
                                sh 'BROWSER=chrome npm test -- --browser=chrome'
                            } catch (err) {
                                echo "Las pruebas en Chrome fallaron: ${err}"
                                currentBuild.result = 'FAILURE'
                            }
                        }
                    }
                }
                stage('Pruebas Firefox') {
                    steps {
                        script {
                            try {
                                sh 'BROWSER=firefox npm test -- --browser=firefox'
                            } catch (err) {
                                echo "Las pruebas en Firefox fallaron: ${err}"
                                currentBuild.result = 'FAILURE'
                            }
                        }
                    }
                }
            }
        }

        stage('Simular Deploy a producción') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'mkdir -p prod && cp -r dist/* prod/'
                echo 'Simulación de deploy completada.'
            }
        }
    }

    post {
        always {
            junit 'test-results/junit-chrome.xml'
            junit 'test-results/junit-firefox.xml'
            
            mail(
                to: 'anonimusa415@gmail.com',
                subject: "Pipeline ${currentBuild.result}: ${env.JOB_NAME}",
                body: """
                    <h2>Resultado: ${currentBuild.result}</h2>
                    <p><b>URL del Build:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><b>Consola:</b> <a href="${env.BUILD_URL}console">Ver logs</a></p>
                """,
                mimeType: 'text/html'
            )
        }
    }
}