pipeline {
    agent any

    environment {
        IMAGE_NAME = 'kanban-api-real'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Jenkins will pull the latest code automatically from your GitHub repository
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building the actual application image..."
                // This builds using the real Dockerfile inside your repository
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploying application container...'
                sh 'docker stop kanban-api-prod || true'
                sh 'docker rm kanban-api-prod || true'
                
                // Fixed network name to match your folder structure exactly
                sh "docker run -d --name kanban-api-prod --network devops_kanban_board_default -p 5050:5000 ${IMAGE_NAME}:latest"
            }
        }
    }
}