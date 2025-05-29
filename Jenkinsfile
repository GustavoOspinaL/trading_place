pipeline {
    agent any

    tools {
        nodejs 'Node_24' // Configurado en Global Tools
    }

    triggers {
        githubPush()
    }

    environment {
        VITE_ENV = 'development'
    }

    stages {
        stage('Validar rama') {
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/develop' || env.BRANCH_NAME == 'develop'
                }
            }
            steps {
                echo "Push en rama develop detectado. Continuando..."
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        // Crear carpeta para resultado de tests
        stage('Prepare test-results folder') {
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

        // Etapa 3: Pruebas Paralelizadas
        stage('Pruebas en Paralelo') {
            parallel {
                stage('Tests Chrome') {
                    steps {
                        script {
                            try {
                                sh 'BROWSER=chrome npm test -- --browser=chrome'
                            } catch (err) {
                                echo "Tests Chrome fallaron: ${err}"
                                currentBuild.result = 'FAILURE'
                            }
                        }
                    }
                }
                stage('Tests Firefox') {
                    steps {
                        script {
                            try {
                                sh 'BROWSER=firefox npm test -- --browser=firefox'
                            } catch (err) {
                                echo "Tests Firefox fallaron: ${err}"
                                currentBuild.result = 'FAILURE'
                            }
                        }
                    }
                }
            }
        }

        post {
            always {
                junit 'test-results/junit-chrome.xml'
                junit 'test-results/junit-firefox.xml'
                // Notificación por email del resultado
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
}