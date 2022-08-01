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

echo "Starting to configure YAML Files!"
NAME=$1
IMAGE_PULL_SECRET_NAME=$2
JOB_NAMESPACE=$3
DOCKER_SERVER=$4
CONTAINER_REGISTRY_NAMESPACE=$5
IMAGE_NAME=$6
IMAGE_TAG=$7

if [ -z "$IMAGE_TAG" ] && [ -f .env ]
then
  ############################################################################
  # Load environment variables from the .env file                            #
  ############################################################################
  set -a; source .env; set +a
fi

export NAME
export IMAGE_PULL_SECRET_NAME
export JOB_NAMESPACE
export DOCKER_SERVER
export CONTAINER_REGISTRY_NAMESPACE
export IMAGE_NAME
export IMAGE_TAG

erb ocpdeploy.template > ocpdeploy.yaml
erb mkbservice.template > mkbservice.yaml
erb ocpservice.template > ocpservice.yaml
erb ocproute.template > ocproute.yaml
erb ocprbac.template > ocprbac.yaml

echo "Done!"
