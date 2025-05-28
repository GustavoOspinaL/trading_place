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
            }
        }
        
        stage('Pruebas Unitarias') {
            steps {
                echo 'Ejecutando pruebas...'
                sh 'npm run test'
            }
        }

        stage('Compilar Proyecto') {
            steps {
                echo 'Compilando proyecto...'
                sh 'npm run build'
            }
        }
    }
}