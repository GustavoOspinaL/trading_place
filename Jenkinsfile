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
                // Pruebas en Chrome
                stage('Pruebas Chrome') {
                    steps {
                        script {
                            try {
                                sh 'npm test -- --browser=chrome'
                            } catch (err) {
                                echo "Pruebas en Chrome fallaron: ${err}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                    post {
                        always {
                            junit 'test-results/junit-chrome.xml'
                        }
                    }
                }

                // Pruebas en Firefox
                stage('Pruebas Firefox') {
                    steps {
                        script {
                            try {
                                sh 'npm test -- --browser=firefox'
                                junit 'junit-firefox.xml'
                            } catch (err) {
                                echo "Pruebas en Firefox fallaron: ${err}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                    post{
                        always {
                            junit 'test-results/junit-firefox.xml'
                        }
                    }
                }
            }
        }
    }
}