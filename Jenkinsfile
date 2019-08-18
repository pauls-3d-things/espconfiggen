pipeline {
    agent any

    stages {
        stage('npm install') {
            steps {
                dir('generator') {
                    sh 'npm install'
                }
            }
        }
        stage('build') {
            steps {
                dir('generator') {
                    sh 'npm run build'
                }
            }
        }
        stage('undeploy') {
            steps {
                dir('generator') {
                    sh 'rm -rf /var/www/espconfiggen/*'
                }
            }
        }
        stage('deploy') {
            steps {
                dir('generator') {
                    sh 'cp -R dist/* /var/www/espconfiggen/'
                }
            }
        }
    }
}