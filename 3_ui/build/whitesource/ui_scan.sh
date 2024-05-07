#!/usr/bin/env bash
set -e
alias aws='/usr/local/bin/aws --region us-east-1'
IMAGE_VERSION="$1"
aws ecr get-login-password | docker login --username AWS --password-stdin 737922848153.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
docker pull --quiet 737922848153.dkr.ecr.us-east-1.amazonaws.com/advise-ui-test:$IMAGE_VERSION
CONTAINER_ID=$(docker run --name whitesource -dit -e ADVISE_STANDALONE_CLIENT=1 -e BITBUCKET_BRANCH=$BITBUCKET_BRANCH -e SCAN_LOG_LEVEL=$SCAN_LOG_LEVEL 737922848153.dkr.ecr.us-east-1.amazonaws.com/advise-ui-test:$IMAGE_VERSION bash)
echo Copying WhiteSource config file to docker container
aws s3 cp s3://conning-aws/whitesource-fs-agent.config ./

docker cp whitesource-fs-agent.config $CONTAINER_ID:/ADVISE
docker exec -t -e SLACK_SECURITY_SCAN_ALERTS_WEBHOOK_URL=$SLACK_SECURITY_SCAN_ALERTS_WEBHOOK_URL $CONTAINER_ID  /bin/bash -c  '
  if ! [ $(which curl) ]; then
    apt-get update
    echo Installing curl...
    apt-get install -y curl
  fi
  if ! [ $(which java) ]; then
    apt-get update
    apt-get install -y software-properties-common
    add-apt-repository -y ppa:webupd8team/java
    apt-get update
    echo Installing default java...
    apt-get install -y default-jdk
    java -version
    #echo Installing Oracle java8...
    #echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
    #apt-get install -y oracle-java8-installer
    #echo Make java 8 the default java installation
    #apt-get -y install oracle-java8-set-default
  fi
  echo The present working directory is:
  pwd
  echo The files in the current directory are:
  ls -l
  echo WhiteSource config file contents:
  cat whitesource-fs-agent.config
  echo Branch is $BITBUCKET_BRANCH
  echo Retrieving WhiteSource Scanner jar file via curl
  curl -LJO https://github.com/whitesource/unified-agent-distribution/releases/latest/download/wss-unified-agent.jar
  echo Running WhiteSource scanner
  echo scan_log_level=$SCAN_LOG_LEVEL
  java -jar wss-unified-agent.jar -c ./whitesource-fs-agent.config -apiKey 8603fb3b86734dc2a7e68124dd66c64df79fecee8d31497f9e076aa6cd92a5ec -userKey 2cda2f4c14554a6f8abafaa953b526a48af8eba7ac104168927d4f94b47a8123 -project $BITBUCKET_BRANCH -logLevel $SCAN_LOG_LEVEL -d /ADVISE
  exit_code=$?
  echo WhiteSource Return Code is $exit_code

  if ! [ "$exit_code" -eq "0" ]; then
    echo Notifying slack of failure
    curl -X POST -H "Content-type: application/json" --data "{\"text\":\"ADVISE / Software Scans / WhiteSource_Scan (DotNet Test Image Build) failed for branch $BITBUCKET_BRANCH, commit $BITBUCKET_COMMIT\"}" $SLACK_SECURITY_SCAN_ALERTS_WEBHOOK_URL
  fi

  exit $exit_code
'

# Offline Mode Only, Required
#echo Copying WhiteSource offline output file to S3 conning-aws bucket
#docker cp $CONTAINER_ID:/ADVISE/whitesource/update-request.txt ./
#aws s3 cp ./update-request.txt s3://conning-aws/update-requestWebKui.txt

# cleanup
CONTAINER_ID=$(docker ps -a -f name=whitesource -q)

if [ "$CONTAINER_ID" != "" ]; then
   docker cp $CONTAINER_ID:/ADVISE/whitesource/policyRejectionSummary.json ./
   docker stop $CONTAINER_ID
   docker rm -f $CONTAINER_ID
fi
