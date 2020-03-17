pipeline {

    agent any
    environment {
        USER_PIKOBAR = "${env.USER_PIKOBAR}"
        HOST_PIKOBAR = "${env.HOST_PIKOBAR}"
 
    }

    stages {
        stage('Run Docker on production') {
            environment {
                SSH_COMMAND = "ssh-agent bash -c 'ssh-add ~/.ssh/id_rsa; git pull origin master'"     
            }

            steps{
                   sshagent (['']){
                        // ssh block
                    sh 'ssh -o StrictHostKeyChecking=no $USER_PIKOBAR@$HOST_PIKOBAR "cd /home/ubuntu/app/pikobar-pelaporan-backend && $SSH_COMMAND \
                                                                                    && docker-compose -f docker-compose-production.yml down \
                                                                                    && docker-compose -f docker-compose-production.yml build --no-cache \
                                                                                    && docker-compose -f docker-compose-production.yml up -d"'
                                                                                        
                    }
                
            }      
         }
        
    } 

}
