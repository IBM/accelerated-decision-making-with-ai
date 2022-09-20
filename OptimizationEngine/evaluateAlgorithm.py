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
import utils
import pandas as pd

# Remove files if they exists before downloading
def remove_files(filenames):
    for filename in filenames:
        if os.path.exists(filename):
            os.remove(filename)

remove_files(["./environment.py", "./algorithm.py", "./model.py", "model_requirements.txt", "environment_requirements.txt", "algorithm_requirements.txt"])

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
data_string = os.getenv("data")
print("data: ", data_string)

data = json.loads(data_string)

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
filename_alg = wget.download(algorithm_uri, "./algorithm.py")
filename_model = wget.download(model_uri, "./model.py")

# Install requirements
install_requirements(model_requirements_uri, "model")
install_requirements(environments_requirements_uri, "environment")
install_requirements(algorithm_requirements_uri, "algorithm")

# Import environment
environment_module = __import__("environment")
environment_class = getattr(environment_module, environment_name)

# Import algorithm
algorithm_module = __import__("algorithm")
algorithm_class = getattr(algorithm_module, algorithm_name)

# Instantiate an environment
calibenv = environment_class(data=data)

if experimentType == 'Calibration':
# Instantiate an algorithm
    a = algorithm_class(calibenv, episode_num)

    # Run study trials with the algorithms
    results = a.generate()
    # print(results)

    # Step once with the best results
    calibenv.step(results[0][-1])

    # save results 
    utils.dbpush(experimentID, experimentType, calibenv.actions_start_dates, calibenv.actions_end_dates, calibenv.action_names, a.study.trials_dataframe(), results[0][-1], calibenv.states)

elif experimentType == 'Model Evaluation':
    calibenv.step(data["calibratedParams"])

    # save results 
    utils.dbpush(experimentID, experimentType, calibenv.actions_start_dates, calibenv.actions_end_dates, calibenv.action_names, None, calibenv.actions[0], calibenv.states)



