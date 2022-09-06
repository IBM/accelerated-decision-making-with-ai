#!/bin/bash

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
echo 'Commencing determining the build condition!'

COMMIT_RANGE=$1
CODE_DIRECTORY=$2

echo "COMMIT_RANGE: $COMMIT_RANGE"
echo "CODE_DIRECTORY: $CODE_DIRECTORY"

############################################################################
# Git diff to check whether the provided code directory is among the diff  #
############################################################################
git --no-pager diff --name-only HEAD $1 | sort -u | uniq | grep $2 > /dev/null
# git diff --name-only $1 | sort -u | uniq | grep $2 > /dev/null
