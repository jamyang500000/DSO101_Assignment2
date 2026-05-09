pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKER_IMAGE = 'jammiii/todo-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        // Stage 1: Checkout Code from GitHub
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/jamyang500000/DSO101_Assignment2.git',
                    credentialsId: 'github-credentials'
            }
        }

        // Stage 2: Install Dependencies
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm install'
            }
        }

        // Stage 3: Build the application
        stage('Build') {
            steps {
                echo 'Building the application...'
                bat 'npm run build'
            }
        }

        // Stage 4: Run Unit Tests
        stage('Test') {
            steps {
                echo 'Running unit tests...'
                bat 'npm test'
            }
            post {
                always {
                    // Publish JUnit test results to Jenkins
                    junit 'junit.xml'
                }
            }
        }

        // Stage 5: Build Docker Image and Deploy
        stage('Deploy') {
            steps {
                script {
                    echo 'Building Docker image...'
                    def dockerImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")

                    echo 'Pushing Docker image to Docker Hub...'
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully! ✅'
        }
        failure {
            echo 'Pipeline failed! ❌ Check the logs above for details.'
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}