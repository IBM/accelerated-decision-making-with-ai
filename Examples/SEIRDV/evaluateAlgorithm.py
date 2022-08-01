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

import environment
import algorithm
import pandas as pd
import utils

baseuri = "https://link-to-my-source-of-case-data"
location = "UG"
start_date = "2020-04-01"
end_date = "2021-04-01"
episode_num = 10
startpt = 10
numdays = 14
maxpop = 10000000.0
model_name = "SEIRDV"
userID = "61122946-1832-11ea-ssss-github"
low=[0,0,0]
high=[1,1,1]

data = {
    "baseuri": baseuri,
    "location": location,
    "start_date": start_date,
    "end_date": end_date,
    "episode_num": episode_num,
    "startpt": startpt,
    "numdays": numdays,
    "maxpop": maxpop,
    "userID": userID,
    "low": low,
    "high": high,
    "model_name": model_name
}

calibenv = environment.CUSTOMModelEnv_betalist(data=data)
a=algorithm.CustomAgent(calibenv, episode_num)
results = a.generate()
# print(results)

# Step once with the best results
calibenv.step(results[0][-1])

# save results 
utils.dbpush("", "", calibenv.actions_start_dates, calibenv.actions_end_dates, calibenv.action_names, a.study.trials_dataframe(), results, calibenv.states)
