#!/usr/bin/env bash

#
# Copyright 2022 IBM Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

echo "--------------------------------------------------------------"
echo 'Commencing deployment of application to code engine!'

TARGET_IBM_CLOUD_URL=$1
TARGET_IBM_CLOUD_REGION=$2
TARGET_IBM_CLOUD_GROUP=$3
CE_PROJECT=$4
TARGET_IBM_REGISTRY_URL=$5
CR_NAMESPACE=$6
IMAGE_NAME=$7
IMAGE_TAG=$8
PORT=$9
VISIBILITY=$10

echo "IBM Cloud url: $TARGET_IBM_CLOUD_URL"
echo "IBM Cloud region: $TARGET_IBM_CLOUD_REGION"
echo "IBM Cloud group: $TARGET_IBM_CLOUD_GROUP"
echo "IBM Cloud Code Engine Project: $CE_PROJECT"
echo "IBM Container Registry url: $TARGET_IBM_REGISTRY_URL"
echo "Container Registry Namespace: $CR_NAMESPACE"
echo "Image name/Repository name: $IMAGE_NAME"
echo "Image Tag Name: $IMAGE_TAG"
echo "Port: $PORT"
echo "Visibility: $VISIBILITY"

############################################################################
# Check whether IBM Cloud CLI is installed.                                #
############################################################################
ibmcloud -v
ibmcloud_return_code="$?"
if [ "$ibmcloud_return_code" -ne 0 ]
then
  ############################################################################
  # Download and install a few CLI tools plug-in.                            #
  # Documentation on details can be found here:                              #
  #    https://github.com/IBM-Cloud/ibm-cloud-developer-tools                #
  ############################################################################
  echo "Install IBM Cloud CLI"
  curl -sL https://ibm.biz/idt-installer | bash
fi

############################################################################
# Log into the IBM Cloud environment using apikey                          #
############################################################################
echo "Login to IBM Cloud using apikey"
ibmcloud login -a "$TARGET_IBM_CLOUD_URL" --apikey "$FUNC_ID_BLUEMIX_API_KEY" -r "$TARGET_IBM_CLOUD_REGION" -g "$TARGET_IBM_CLOUD_GROUP"
if [ $? -ne 0 ]; then
  echo "Failed to authenticate to IBM Cloud"
  exit 1
fi

############################################################################
# Check whether IBM Cloud CLI Code Engine is installed.                    #
############################################################################
echo "verify that the plug-in is installed"
ibmcloud plugin show code-engine
ce_return_code="$?"
if [ "$ce_return_code" -ne 0 ]
then
  ############################################################################
  # Download and install Code Engine plug-in.                                #
  # Documentation on details can be found here:                              #
  #    https://cloud.ibm.com/docs/codeengine?topic=codeengine-install-cli    #
  ############################################################################
  echo "Install IBM Cloud Code Engine plug-in"
  ibmcloud plugin install code-engine
fi

############################################################################
# Verify that the project exists and if it does, set the project.          #
# Documentation on details can be found here:                              #
#    https://cloud.ibm.com/docs/codeengine?topic=codeengine-manage-project #
############################################################################
echo "Verify IBM Cloud Code Engine exists"
ibmcloud ce project get --name "$CE_PROJECT"
ce_project_return_code="$?"
if [ $ce_project_return_code -ne 0 ]; then
  echo "Failed to get project"

  ############################################################################
  # Create new project.                                                      #
  ############################################################################
  echo "Attempting to create new project"
  ibmcloud ce project create --name "$CE_PROJECT"
fi

echo "Work with a project"
ibmcloud ce project select --name "$CE_PROJECT"

################################################################################
# Check whether an application exists, if it does, update, if it doesn't,      #
# check whether a registry access is created for it, if not create one,        #
# and create the app.                                                          #
# Documentation on details can be found here:                                  #
#    https://cloud.ibm.com/docs/codeengine?topic=codeengine-access-service     #
#    https://cloud.ibm.com/docs/codeengine?topic=codeengine-deploy-app-crimage #
#    https://cloud.ibm.com/docs/codeengine?topic=codeengine-update-app         #
################################################################################
echo "Accessing app details with the CLI"
ibmcloud ce app get --name "$IMAGE_NAME"
ce_app_return_code="$?"
if [ $ce_app_return_code -ne 0 ]; then
  echo "Failed to get app"

  #####################################################################################
  # Check whether a secret registry exists, if it doesn't, create one                 #
  # Documentation on details can be found here:                                       #
  #    https://cloud.ibm.com/docs/codeengine?topic=codeengine-cli#cli-registry-create #
  #####################################################################################
  echo "Accessing registry details with the CLI"
  ibmcloud ce registry get --name "$IMAGE_NAME"
  ce_registry_return_code="$?"
  if [ $ce_registry_return_code -ne 0 ]; then
    echo "Failed to get registry"

    ############################################################################
    # Create new registry.                                                          #
    ############################################################################
    echo "Attempting to create new registry"
    ibmcloud ce registry create --name "$IMAGE_NAME" --server "$TARGET_IBM_REGISTRY_URL" --username iamapikey --password "$FUNC_ID_BLUEMIX_API_KEY"
  fi

  ############################################################################
  # Create new app.                                                          #
  ############################################################################
  echo "Attempting to create new app"
  ibmcloud ce app create --name "$IMAGE_NAME" --image "$TARGET_IBM_REGISTRY_URL"/"$CR_NAMESPACE"/"$IMAGE_NAME":"$IMAGE_TAG" --registry-secret "$IMAGE_NAME" --port "$PORT" --visibility="$VISIBILITY" --env SPRING_PROFILES_ACTIVE=$SPRING_ENV --env APP_VERSION=$APP_VERSION --env POSTGRES_PASS=$POSTGRES_PASS --env KEY_64=$KEY_64 --env KEY_64N=$KEY_64N --env POSTGRES_URL=$POSTGRES_URL --env ENCRYPTION_KEY=$ENCRYPTION_KEY --env HOSTNAME=$HOSTNAME --env POSTGRES_USERNAME=$POSTGRES_USERNAME --env COS_STORAGE=$COS_STORAGE --env ENVIRONMENT_COMMAND_NAME=$ENVIRONMENT_COMMAND_NAME

else
  echo "Updating your app with the CLI"
  ibmcloud ce application update -n "$IMAGE_NAME" --visibility="$VISIBILITY" --env SPRING_PROFILES_ACTIVE=$SPRING_ENV --env APP_VERSION=$APP_VERSION --env POSTGRES_PASS=$POSTGRES_PASS --env KEY_64=$KEY_64 --env KEY_64N=$KEY_64N --env POSTGRES_URL=$POSTGRES_URL --env ENCRYPTION_KEY=$ENCRYPTION_KEY --env HOSTNAME=$HOSTNAME --env POSTGRES_USERNAME=$POSTGRES_USERNAME --env COS_STORAGE=$COS_STORAGE --env ENVIRONMENT_COMMAND_NAME=$ENVIRONMENT_COMMAND_NAME
fi


