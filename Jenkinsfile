pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'  // Tên bạn đã đặt trong Jenkins Tools
    }

    environment {
        APP_NAME = 'ffspace'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing packages...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building Next.js app...'
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo '✅ Build Next.js thành công!'
        }
        failure {
            echo '❌ Build thất bại! Kiểm tra Console Output.'
        }
        always {
            cleanWs()
        }
    }
}
