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
echo 'Commencing  image push to registry!'

TARGET_IBM_CLOUD_URL=$1
TARGET_IBM_CLOUD_REGION=$2
TARGET_IBM_CLOUD_GROUP=$3
TARGET_IBM_REGISTRY_URL=$4
CR_NAMESPACE=$5
IMAGE_NAME=$6
IMAGE_TAG=$7

echo "IBM Cloud url: $TARGET_IBM_CLOUD_URL"
echo "IBM Cloud region: $TARGET_IBM_CLOUD_REGION"
echo "IBM Cloud group: $TARGET_IBM_CLOUD_GROUP"
echo "IBM Container Registry url: $TARGET_IBM_REGISTRY_URL"
echo "Container Registry Namespace: $CR_NAMESPACE"
echo "Image name/Repository name: $IMAGE_NAME"
echo "Image Tag Name: $IMAGE_TAG"

############################################################################
# Download and install a few CLI tools plug-in.                            #
# Documentation on details can be found here:                              #
#    https://github.com/IBM-Cloud/ibm-cloud-developer-tools                #
############################################################################
echo "Install IBM Cloud CLI"
curl -sL https://ibm.biz/idt-installer | bash

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
# Ask Docker to tag the image as latest and with the custom tag            #
############################################################################
echo "Tagging the image as $IMAGE_NAME:$DEPLOY_TIMESTAMP-$TRAVIS_BUILD_NUMBER and $IMAGE_NAME:$IMAGE_TAG"
docker tag $IMAGE_NAME:$DEPLOY_TIMESTAMP-$TRAVIS_BUILD_NUMBER $TARGET_IBM_REGISTRY_URL/$CR_NAMESPACE/$IMAGE_NAME:$DEPLOY_TIMESTAMP-$TRAVIS_BUILD_NUMBER
docker tag $IMAGE_NAME:latest $TARGET_IBM_REGISTRY_URL/$CR_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG

############################################################################
# Log into the IBM Cloud container registry                                          #
############################################################################
echo "Logging into IBM Cloud container registry"
ibmcloud cr login
if [ $? -ne 0 ]; then
  echo "Failed to authenticate to IBM Cloud container registry"
  exit 1
fi

############################################################################
# Push the image                                                           #
############################################################################
echo "Pushing image to registry"
docker push $TARGET_IBM_REGISTRY_URL/$CR_NAMESPACE/$IMAGE_NAME:$DEPLOY_TIMESTAMP-$TRAVIS_BUILD_NUMBER
docker push $TARGET_IBM_REGISTRY_URL/$CR_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG
echo "Done pushing image to registry"

