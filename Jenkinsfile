pipeline {
  environment {
    registry = "gbxnga/foodapp-nodejs"
    registryCredential = 'dockerhub'
  }
  agent any
  tools {nodejs "node"}
  stages {
    stage('Preparation') {

        steps {
            sh 'whoami'
            sh 'echo $PATH '
        }
    } 
    stage('Testing') {
      steps {
        sh "npm run test"
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
    stage('Deploy App') {
      steps {
          
          sh("kubectl get pods")
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
  }
}