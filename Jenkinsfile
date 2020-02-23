
podTemplate(label: 'mypod', serviceAccount: 'jenkins', containers: [
    containerTemplate(name: 'git', image: 'alpine/git', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'node', image: 'node', command: 'cat', ttyEnabled: true),
    containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
    containerTemplate(name: 'kubectl', image: 'amaceog/kubectl', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'helm', image: 'alpine/helm:2.14.0', ttyEnabled: true, command: 'cat')
  ],

  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
    hostPathVolume(mountPath: '/usr/local/bin/helm', hostPath: '/usr/local/bin/helm')
  ]
  ) {
    node('mypod') {
        stage('Get latest version of code') {
          checkout scm
        }
        stage('Check running containers') {
            container('docker') {  
                sh 'hostname'
                sh 'hostname -i' 
                sh 'docker ps'
                sh 'ls'
            }
            container('kubectl') { 
                sh 'kubectl get pods -n default'  
            }
            container('helm') { 
                sh 'helm init --client-only --skip-refresh'
                sh 'helm repo update'
                sh 'helm history foodapp'
            }
        }  
       
        stage('Build Image'){
            container('docker'){

              withCredentials([usernamePassword(credentialsId: 'docker-login', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh 'docker login --username="${USERNAME}" --password="${PASSWORD}"'
                sh 'docker build -t gbxnga/foodapp-nodejs:${BUILD_NUMBER} .'
                sh 'docker image ls'
                sh 'docker push gbxnga/foodapp-nodejs:${BUILD_NUMBER}'
              } 
                
            }
        }

        stage('Testing') {
            container('docker') { 
              sh 'whoami'
              sh 'hostname -i' 
              sh 'docker run gbxnga/foodapp-nodejs:${BUILD_NUMBER} npm run test '                  
            }
        }

        stage('Push Image'){
            container('docker'){
              withCredentials([usernamePassword(credentialsId: 'docker-login', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh 'docker image ls'
                sh 'docker push gbxnga/foodapp-nodejs:${BUILD_NUMBER}'
              }                 
            }
        }
        
        stage('Deploy Image to k8s'){
            container('helm'){
                sh 'helm list'
                sh 'helm lint ./k8s/foodapp'
                sh 'helm upgrade --wait --timeout 60 --set image.tag=${BUILD_NUMBER} foodapp ./k8s/foodapp'
                sh 'helm list | grep foodapp'
                //sh 'helm test foodapp'
            }
        }
    }
}