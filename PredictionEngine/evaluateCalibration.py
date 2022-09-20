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

import os
import wget
import json
import subprocess
import sys
#import utils
import pandas as pd

# Remove files if they exists before downloading
def remove_files(filenames):
    for filename in filenames:
        if os.path.exists(filename):
            os.remove(filename)

remove_files(["./environment.py", "./model.py", "model_requirements.txt", "environment_requirements.txt"])

# Method to install all requirements
def install_requirements(requirements_uri, requements_type):
    if requirements_uri:
        filename_requirements = wget.download(requirements_uri, "./"+ requements_type +"_requirements.txt")
        command = [
            sys.executable,
            "-m",
            "pip",
            "install",
            "--requirement",
            requements_type + "_requirements.txt",
        ]
        subprocess.check_call(command)

# Get data
with open("../Researchproject/experiments/experiment19.json", 'r') as file:
    data = json.load(file)


# Extract parameters
episode_num = int(data["episode_num"]) if "episode_num" in data else 10
algorithm_name = data["algorithm_name"]
environment_name = data["environment_name"]
environments_uri = data["environments_uri"]
algorithm_uri = data["algorithm_uri"]
model_uri = data["model_uri"]
model_requirements_uri = data["model_requirements_uri"]
algorithm_requirements_uri = data["algorithm_requirements_uri"]
environments_requirements_uri = data["environments_requirements_uri"]
experimentID = data["experimentID"]
experimentType = data["experimentType"]

# Download code
filename_env = wget.download(environments_uri, "./environment.py")
filename_model = wget.download(model_uri, "./model.py")

# Install requirements
install_requirements(model_requirements_uri, "model")
install_requirements(environments_requirements_uri, "environment")


# Import environment
environment_module = __import__("environment")
environment_class = getattr(environment_module, environment_name)


# Instantiate an environment
predenv = environment_class(data=data)

# Get calibration data
with open("../Researchproject/calibration_results/8969a9a98316c1540183180256420002-prediction.json", 'r') as file:
    calib_data = json.load(file)

optimal_params = []
for x in calib_data:
    if '-' in x:
        optimal_params.append(calib_data[x].get('value'))
print(optimal_params)


# Step once with the best results
predenv.step(optimal_params)
states_data_df = pd.DataFrame(predenv.states, columns=["day", "susceptible", "infectious", "recovered", "deaths"])

print(predenv.actions_start_dates)
print(predenv.actions_end_dates)
print(predenv.action_names)
print(predenv.states)

# save results 
#utils.dbpush(experimentID, experimentType, predenv.actions_start_dates, predenv.actions_end_dates, predenv.action_names,optimal_params, predenv.states)
