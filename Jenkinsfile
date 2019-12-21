pipeline {
  environment {
    registry = "gbxnga/foodapp-nodejs"
    registryCredential = 'dockerhub'
  }
  agent any
  tools {nodejs "node"}
  stages {
    stage('Compile') {

        steps {
            sh 'whoami'
            sh 'echo $PATH '

        }

    }
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Testing') {
      steps {
        sh "echo 'running test'"
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