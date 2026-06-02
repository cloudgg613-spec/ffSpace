pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'  // Tên đã đặt ở Tools
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Pulling code...'
                checkout scm
            }
        }

        stage('Install') {
            steps {
                echo '📦 Installing...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building...'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Testing...'
                sh 'npm test'
            }
        }
    }

    post {
        success {
            echo '✅ Build thành công!'
        }
        failure {
            echo '❌ Build thất bại!'
        }
    }
}
