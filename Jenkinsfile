pipeline {
    // Usar cualquier agente disponible en Jenkins
    agent any

    // Definir la herramienta Node.js a usar (debe estar configurada en Jenkins)
    tools {
        nodejs 'Node_24'
    }

    // Variables de entorno disponibles durante la ejecución
    environment {
        VITE_ENV = 'development' // Variable de entorno para Vite
    }

    stages {
        // Etapa 1: Clona el repositorio desde GitHub en la rama main
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/GustavoOspinaL/trading_place.git'
            }
        }

        // Etapa 2: Instala las dependencias del proyecto (React con Vite)
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        // Etapa 3: Ejecuta el build del proyecto con Vite
        stage('Construir proyecto') {
            steps {
                sh 'npm run build'
            }
        }

        // Etapa 4: Prepara una carpeta para guardar los resultados de tests
        stage('Preparar carpeta para el resultado de los tests') {
            steps {
                sh 'mkdir -p test-results'
            }
        }

        // Etapa 5: Ejecuta las pruebas unitarias (configuradas en el proyecto)
        stage('Pruebas Unitarias') {
            steps {
                echo 'Ejecutando pruebas...'
                sh 'npm run test'
            }
        }

        // Etapa 6: Ejecuta pruebas en paralelo en dos navegadores (Chrome y Firefox)
        stage('Pruebas en Paralelo') {
            parallel {
                stage('Pruebas Chrome') {
                    steps {
                        script {
                            try {
                                // Ejecuta pruebas en Chrome
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
                                // Ejecuta pruebas en Firefox
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

        // Etapa 7: Simula un despliegue copiando archivos de build a una carpeta "prod"
        stage('Simular Deploy a producción') {
            // Solo se ejecuta si las pruebas pasaron
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'mkdir -p prod && cp -r dist/* prod/' // Simulación de deploy
                echo 'Simulación de deploy completada.'
            }
        }
    }

    // Bloque post-ejecución: Siempre se ejecuta, sin importar si falló o no
    post {
        always {
            // Publica resultados de pruebas (JUnit) si existen
            junit 'test-results/junit-chrome.xml'
            junit 'test-results/junit-firefox.xml'

            // Envía correo con el resultado del pipeline
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