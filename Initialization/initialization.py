#!/usr/bin/env python

#  Copyright 2022 IBM Corporation
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

import argparse
import requests
import json
import os

# # # parse args
parser = argparse.ArgumentParser()
parser.add_argument('--baseuri', default="http://localhost:4200", help='the base url e.g. http://localhost:4200')
args = parser.parse_args()
baseuri = args.baseuri

# # # Create a DataRepositoryConfiguration
os.system("nano dataRepositoryConfiguration.json")

url = baseuri + '/api/dataRepositoryconfigurations'
f = open('dataRepositoryConfiguration.json')
data = json.load(f)
response = requests.post(url, json = data)
print('Data Repository Configuration: ', response.status_code)
f.close() 

print ('\n')

# # # Create ExecutionEnvironment 

url = baseuri + '/api/executionenvironment'
f = open('executionEnvironment.json')
data = json.load(f)
response = requests.post(url, json = data)
print('Execution Environment: ', response.status_code)
f.close()

# # # paste execution environment response from above to a json file

f = open('execution-environment-output.json','w')
f.write(response.text)
f.close()

print ('\n')

# # # Create ExecutionEnvironmentCommand
with open('execution-environment-output.json', 'r') as json_file:
    json_load = json.load(json_file)

with open('executionEnvironmentCommand.json', 'r') as file:
    content =  json.load(file)
    content['executionEnvironment'].update(json_load['context']['entity'])
    json_string = json.dumps(content, indent=4)

f = open('execution-environment-command.json','w')
f.write(json_string)
f.close()

url = baseuri + '/api/executionenvironmentcommand'
f = open('execution-environment-command.json')
data = json.load(f)
response = requests.post(url, json = data)
print('Execution Environment Command: ', response.status_code)
f.close()
print ('\n')

# # # Create ExecutorTypes
# # # 1. WHITE_BOX_MODEL
url = baseuri + '/api/executorType'
f = open('white_box_model.json')
data = json.load(f)
response = requests.post(url, json = data)
print('White Box Model: ', response.status_code)
f.close()

print ('\n')

# # # 2. BLACK_BOX_MODEL
url = baseuri + '/api/executorType'
f = open('black_box_model.json')
data = json.load(f)
response = requests.post(url, json = data)
print('Black Box Model: ', response.status_code)
f.close()

print ('\n')

# # # 3. GREY_BOX_MODEL
url = baseuri + '/api/executorType'
f = open('grey_box_model.json')
data = json.load(f)
response = requests.post(url, json = data)
print('Grey Box Model: ', response.status_code)
f.close()
  
print ('\n')

# # # 4. ENVIRONMENT
url = baseuri + '/api/executorType'
f = open('environment.json')
data = json.load(f)
response = requests.post(url, json = data)
print('Environment: ', response.status_code)
f.close()
