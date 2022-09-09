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
echo 'Main Script for Image Registry and Deployment!'

chmod +x ../.github/scripts/*

echo "Start by pushing the docker image to the container registry"
sh ../.github/scripts/pushToRegistry.sh https://cloud.ibm.com us-south 'IBM Research Kenya Healthcare' us.icr.io admai jds latest

echo "Then we deploy the application in to Code Engine"
sh ../.github/scripts/deploymentCE.sh https://cloud.ibm.com us-south "IBM Research Kenya Healthcare" ADMAI us.icr.io admai jds latest 8080 project
