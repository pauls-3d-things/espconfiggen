pipeline {
    agent any

    stages {
        stage('npm install') {
            dir('generator') {
                sh 'npm install'
            }
        }
        stage('build') {
            dir('generator') {
                sh 'npm run build'
            }
        }
        stage('undeploy') {
            dir('generator') {
                sh 'rm -rf /var/www/espconfiggen/*'
            }
        }
        stage('deploy') {
            dir('generator') {
                sh 'cp -R dist/* /var/www/espconfiggen/'
            }
        }
    }
}