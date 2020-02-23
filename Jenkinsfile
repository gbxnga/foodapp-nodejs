
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
                // example to show you can run docker commands when you mount the socket
                sh 'hostname'
                sh 'hostname -i' 
                sh 'docker ps'
                sh 'ls'
            }
            container('kubectl') {
                // example to show you can run docker commands when you mount the socket
                sh 'kubectl get pods -n default' 
                // sh 'helm version'
            }
            container('helm') {
                // example to show you can run docker commands when you mount the socket
                // sh 'helm init --service-account helm-tiller'
                //sh 'helm list'
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
                // dir('foodapp-nodejs/') { 
                    sh 'whoami'
                    sh 'hostname -i'
                    // sh 'npm install'
                    //sh 'npm install -g jest'
                    //sh 'npm run test'
                    sh 'docker run gbxnga/foodapp-nodejs:${BUILD_NUMBER}'
                    sh 'docker ps'
                    sh 'docker exec -it 857f35c7267d npm run test'
                //}
            }
        }
        
        stage('Deploy to k8s'){
            container('helm'){
                sh 'helm list'
                sh 'helm lint ./k8s/foodapp'
                sh 'helm upgrade --set image.tag=${BUILD_NUMBER} foodapp ./k8s/foodapp'
                sh 'helm list | grep foodapp'
                //sh 'helm test foodapp'
            }
        }
    }
}