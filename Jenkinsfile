
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
        
        /*stage('Clone repository') {
            container('git') {
                sh 'whoami'
                sh 'hostname -i'
                sh 'git clone -b master https://github.com/gbxnga/foodapp-nodejs.git'
            }
        }*/

        stage('Testing') {
            container('node') {
                // dir('foodapp-nodejs/') { 
                    sh 'whoami'
                    sh 'hostname -i'
                    sh 'npm install'
                    sh 'npm install -g jest'
                    sh 'npm run test'
                //}
            }
        }
        
        stage('Build Image'){
            container('docker'){

                  withCredentials([[ 
                      $class: 'StringBinding',
                      credentialsId: 'docker-login',
                      usernameVariable: 'DOCKER_USERNAME',
                      passwordVariable: 'DOCKER_PASSWORD',
                  ]]) {
                    sh 'docker login --username="${DOCKER_USERNAME}" --password="${DOCKER_PASSWORD}"'
                  }
                
                // dir('foodapp-nodejs/'){
                    sh 'docker build -t gbxnga/foodapp-nodejs .'
                    sh 'docker ps'
                    /*sh 'docker push gbxnga/foodapp-nodejs'*/
                //}
                
            }
        }
        
        stage('Deploy to k8s'){
            container('helm'){
                sh 'helm list'
                sh 'helm lint ./k8s/foodapp'
                sh 'helm upgrade --set image.tag=latest foodapp ./k8s/foodapp'
                sh 'helm list | grep foodapp'
                //sh 'helm test foodapp'
            }
        }
    }
}