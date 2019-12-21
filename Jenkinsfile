pipeline {
  environment {
    registry = "gbxnga/foodapp-nodejs"
    registryCredential = 'dockerhub'
  }
  agent {
      docker { image "node" }
  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Testing') {
      steps {
        sh 'cp .env.example .env'
        sh 'php artisan key:generate'
        sh 'vendor/bin/phpunit'
      }
    }     
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry + ":$BUILD_NUMBER"
        }
      }
    } 
    stage('Deploy Image') {
      steps{
         script {
            docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
  }
}