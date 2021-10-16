def secretsProd = [
  [path: 'kv-pelaporan-api/production/app-v2', engineVersion: 2, secretValues: [
    [envVar: 'NODE_ENV', vaultKey: 'NODE_ENV'],
    [envVar: 'HOST', vaultKey: 'HOST'],
    [envVar: 'PORT', vaultKey: 'PORT'],
    [envVar: 'ENCODING', vaultKey: 'ENCODING'],

    // tell helm to doesnt delete resource secret and configmap
    [envVar: 'SECRET_POLICY', vaultKey: 'SECRET_POLICY'],
    [envVar: 'CONFIGMAP_POLICY', vaultKey: 'CONFIGMAP_POLICY'],

    [envVar: 'SECRET_KEY', vaultKey: 'SECRET_KEY'],

    [envVar: 'MONGO_DB_URI', vaultKey: 'MONGO_DB_URI'],

    [envVar: 'URL_PENDAFTARAN_COVID', vaultKey: 'URL_PENDAFTARAN_COVID'],
    [envVar: 'URL_USER_PENDAFTARAN_COVID', vaultKey: 'URL_USER_PENDAFTARAN_COVID'],


    [envVar: 'SMS_URL_SERVER', vaultKey: 'SMS_URL_SERVER'],
    [envVar: 'SMS_USERNAME', vaultKey: 'SMS_USERNAME'],
    [envVar: 'SMS_KEY', vaultKey: 'SMS_KEY'],

    [envVar: 'WA_URL', vaultKey: 'WA_URL'],
    [envVar: 'WA_USER', vaultKey: 'WA_USER'],
    [envVar: 'WA_TOKEN', vaultKey: 'WA_TOKEN'],

    [envVar: 'SENTRY_DSN', vaultKey: 'SENTRY_DSN'],

    [envVar: 'APP_CONVERT', vaultKey: 'APP_CONVERT'],

    [envVar: 'REDIS_HOST', vaultKey: 'REDIS_HOST'],
    [envVar: 'REDIS_PORT', vaultKey: 'REDIS_PORT'],

    [envVar: 'FIREBASE_DEBUG', vaultKey: 'FIREBASE_DEBUG'],
    [envVar: 'FIREBASE_PROJECT_ID', vaultKey: 'FIREBASE_PROJECT_ID'],
    [envVar: 'FIREBASE_PRIVATE_KEY_ID', vaultKey: 'FIREBASE_PRIVATE_KEY_ID'],
    [envVar: 'FIREBASE_PRIVATE_KEY', vaultKey: 'FIREBASE_PRIVATE_KEY'],

    [envVar: 'FIREBASE_CLIENT_EMAIL', vaultKey: 'FIREBASE_CLIENT_EMAIL'],
    [envVar: 'FIREBASE_CLIENT_ID', vaultKey: 'FIREBASE_CLIENT_ID'],
    [envVar: 'FIREBASE_CLIENT_X509_CERT_URL', vaultKey: 'FIREBASE_CLIENT_X509_CERT_URL'],
    [envVar: 'FIREBASE_DATABASE_URL', vaultKey: 'FIREBASE_DATABASE_URL'],

    [envVar: 'TOPIC_NAME_LAPORMANDIRI', vaultKey: 'TOPIC_NAME_LAPORMANDIRI'],
    [envVar: 'SUBSCRIPTION_NAME_LAPORMANDIRI', vaultKey: 'SUBSCRIPTION_NAME_LAPORMANDIRI'],

    [envVar: 'TOPIC_NAME_LABKESPELAPORAN', vaultKey: 'TOPIC_NAME_LABKESPELAPORAN'],
    [envVar: 'SUBSCRIPTION_NAME_LABKESPELAPORAN', vaultKey: 'SUBSCRIPTION_NAME_LABKESPELAPORAN'],

    [envVar: 'PUBSUB_PROJECT_ID', vaultKey: 'PUBSUB_PROJECT_ID'],
    [envVar: 'PUBSUB_PRIVATE_KEY_ID', vaultKey: 'PUBSUB_PRIVATE_KEY_ID'],
    [envVar: 'PUBSUB_PRIVATE_KEY', vaultKey: 'PUBSUB_PRIVATE_KEY'],
    [envVar: 'PUBSUB_CLIENT_EMAIL', vaultKey: 'PUBSUB_CLIENT_EMAIL'],
    [envVar: 'PUBSUB_CLIENT_ID', vaultKey: 'PUBSUB_CLIENT_ID'],
    [envVar: 'PUBSUB_AUTH_URI', vaultKey: 'PUBSUB_AUTH_URI'],
    [envVar: 'PUBSUB_TOKEN_URI', vaultKey: 'PUBSUB_TOKEN_URI'],
    [envVar: 'PUBSUB_AUTH_PROVIDER_X509_CERT_URL', vaultKey: 'PUBSUB_AUTH_PROVIDER_X509_CERT_URL'],
    [envVar: 'PUBSUB_CLIENT_X509_CERT_URL', vaultKey: 'PUBSUB_CLIENT_X509_CERT_URL'],
   

    [envVar: 'AWS_BUCKET_ID', vaultKey: 'AWS_BUCKET_ID'],
    [envVar: 'AWS_SECRET_KEY', vaultKey: 'AWS_SECRET_KEY'],
    [envVar: 'CASE_BUCKET_NAME', vaultKey: 'CASE_BUCKET_NAME'],
    [envVar: 'HISTORY_BUCKET_NAME', vaultKey: 'HISTORY_BUCKET_NAME'],
    [envVar: 'SIGNED_URL_METHOD', vaultKey: 'SIGNED_URL_METHOD'],

    [envVar: 'EMAIL_HOST', vaultKey: 'EMAIL_HOST'],
    [envVar: 'EMAIL_PORT', vaultKey: 'EMAIL_PORT'],
    [envVar: 'EMAIL_USER', vaultKey: 'EMAIL_USER'],
    [envVar: 'EMAIL_PASS', vaultKey: 'EMAIL_PASS'],
    [envVar: 'EMAIL_FROM', vaultKey: 'EMAIL_FROM']]],

]

def configuration = [vaultUrl: "${VAULT_JABAR_CLOUD}",  vaultCredentialId: 'approle-pelaporan', engineVersion: 2]

pipeline {

    agent any

    environment {
        appName = 'api-pelaporan-production'
        PROJECT_REGISTRY ='pelaporan-pikobar'
        VERSION = "${env.BUILD_ID}"
        URL_REGISTRY = "${URL_REGISTRY_JACLOUD}"
        VAULT_JABAR_CLOUD = "${VAULT_JABAR_CLOUD}"
        CLUSTER_NAME_GKE = "prod-jds-cluster-k8s"  
        PROJECT_ID_GKE = "${PROJECT_ID_GKE}"        
    }

    options {
        timeout(time: 1, unit: 'HOURS')
    }

    //  triggers {
    //             githubPush()
    //  }

    stages{

        // stage('stage build pelaporan api gke'){

        //     steps {

        //         withVault([configuration: configuration, vaultSecrets: secretsProd]) { 
                        
        //                 sh 'echo $VERSION > version.txt'
        //                 sh 'docker build --tag $appName:$VERSION -f Dockerfile.release . --no-cache'
        //             }
        //         stash includes: 'version.txt', name: 'version'
        //     }

        //     post {
        //         always {
        //             archiveArtifacts artifacts: 'version.txt', fingerprint: true
        //             cleanWs()
        //         }
        //     }
        // }

        // stage('push to registry pelaporan gke'){

        //     steps {
        //         script {
        //             withDockerRegistry([credentialsId: 'a9661b24-dad7-4eaf-a9e2-b59f474c81fa', url: "https://${URL_REGISTRY}"]) {
        //             code block
        //             unstash 'version'
        //             sh 'cat version.txt'
        //             sh 'export REGISTRY_HTTP_RELATIVEURLS=true \
        //                 && docker tag $appName:$VERSION $URL_REGISTRY/$PROJECT_REGISTRY/$appName:$VERSION \
        //                 && docker push $URL_REGISTRY/$PROJECT_REGISTRY/$appName:$VERSION \
        //                 && docker rmi $appName:$VERSION \
        //                 && docker rmi $URL_REGISTRY/$PROJECT_REGISTRY/$appName:$VERSION'
        //                 }
        //         }
        //     }
        //     post {
        //         always {
        //             archiveArtifacts artifacts: 'version.txt', fingerprint: true
        //             cleanWs()
        //         }
        //     }
        // }

         stage ('deploy to kubernetes gke'){
            agent {
                docker { 
                    image 'kiwigrid/gcloud-kubectl-helm:3.3.4-312.0.0-267'
                    args '-u root'
                }
            }

            steps {
                    // deploy kubernetes cluster production
                    withVault([configuration: configuration, vaultSecrets: secretsProd]) {   
            
                        //sh 'sed -i "s/__VERSION__/${VERSION}/g" kubernetes/helm-pelaporan-backend/values.yaml'
                        sh '''
                            set +x
                            echo $SERVICE_ACCOUNT_GKE | base64 -d > gcp-key-file.json
                            gcloud auth activate-service-account --key-file=gcp-key-file.json
                            gcloud container clusters get-credentials $CLUSTER_NAME_GKE --project=$PROJECT_ID_GKE --region=asia-southeast2-a
                            set -x
                            kubectl version
                            helm version
                            kubectl get pods --namespace pikobar-pelaporan
                            helm install $appName kubernetes/helm-pelaporan-backend --namespace pikobar-pelaporan --values kubernetes/helm-pelaporan-backend/values.yaml --dry-run --debug
                            helm upgrade --install $appName --set image.tag=$VERSION --set configmap.policy=$CONFIGMAP_POLICY \
                            --set configmap.app.node_env=$NODE_ENV \
                            --set configmap.app.host=$HOST \
                            --set configmap.app.port=$PORT \
                            --set configmap.app.encoding=$ENCODING \
                            --set configmap.url_pendaftaran_covid=$URL_PENDAFTARAN_COVID \
                            --set configmap.url_user_pendaftaran_covid=$URL_USER_PENDAFTARAN_COVID \
                            --set configmap.sms_url_server=$SMS_URL_SERVER \
                            --set configmap.wa_url=$WA_URL \
                            --set configmap.sentry_dsn=$SENTRY_DSN \
                            --set configmap.app_convert=$APP_CONVERT \
                            --set configmap.mongodb.mongo_db_uri=$MONGO_DB_URI \
                            --set configmap.redis.redis_host=$REDIS_HOST \
                            --set configmap.redis.redis_port=$REDIS_PORT \
                            --set configmap.pubsub.topic_name_lapormandiri=$TOPIC_NAME_LAPORMANDIRI \
                            --set configmap.pubsub.subscription_name_lapormandiri=$SUBSCRIPTION_NAME_LAPORMANDIRI \
                            --set configmap.pubsub.topic_name_labkespelaporan=$TOPIC_NAME_LABKESPELAPORAN \
                            --set configmap.pubsub.subscription_name_labkespelaporan=$SUBSCRIPTION_NAME_LABKESPELAPORAN \
                            --set secret.policy=$SECRET_POLICY \
                            --set secret.aws_s3.access_key=$AWS_BUCKET_ID \
                            --set secret.aws_s3.secret_key=$AWS_SECRET_KEY \
                            --set secret.aws_s3.case_bucket_name=$CASE_BUCKET_NAME \
                            --set secret.aws_s3.history_bucket_name=$HISTORY_BUCKET_NAME \
                            --set secret.aws_s3.signed_url_method=$SIGNED_URL_METHOD \
                            --set secret.firebase_debug=$FIREBASE_DEBUG \
                            --set secret.firebase_project_id=$FIREBASE_PROJECT_ID \
                            --set secret.firebase_client_email=$FIREBASE_CLIENT_EMAIL \
                            --set secret.firebase_client_id=$FIREBASE_CLIENT_ID \
                            --set secret.firebase_private_key=$FIREBASE_PRIVATE_KEY \
                            --set secret.firebase_client_x509_cert_url=$FIREBASE_CLIENT_X509_CERT_URL \
                            --set secret.firebase_database_url=$FIREBASE_DATABASE_URL \
                            --set secret.firebase_private_key_id=$FIREBASE_PRIVATE_KEY_ID \
                            --set secret.pubsub_project_id=$PUBSUB_PROJECT_ID \
                            --set secret.pubsub_private_key_id=$PUBSUB_PRIVATE_KEY_ID \
                            --set secret.pubsub_private_key=$PUBSUB_PRIVATE_KEY \
                            --set secret.pubsub_client_email=$PUBSUB_CLIENT_EMAIL \
                            --set secret.pubsub_client_id=$PUBSUB_CLIENT_ID \
                            --set secret.pubsub_auth_uri=$PUBSUB_AUTH_URI \
                            --set secret.pubsub_token_uri=$PUBSUB_TOKEN_URI \
                            --set secret.pubsub_auth_provider_x509_cert_url=$PUBSUB_AUTH_PROVIDER_X509_CERT_URL \
                            --set secret.pubsub_client_x509_cert_url=$PUBSUB_CLIENT_X509_CERT_URL \
                            --set secret.email.email_host=$EMAIL_HOST \
                            --set secret.registry.username=$REGISTRY_USERNAME \
                            --set secret.registry.password=$REGISTRY_PASSWORD \
                            kubernetes/helm-pelaporan-backend --namespace pikobar-pelaporan
                            kubectl get pods --namespace pikobar-pelaporan
                        '''
                    }
              }

              post {
                  always{
                    cleanWs()
                  }
              }
        }



        
    } 

}