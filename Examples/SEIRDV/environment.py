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

from time import strftime
import gym
import pandas as pd
import numpy as np
import model
import datetime

class CUSTOMModelEnv_betalist(gym.Env):
    def __init__(self, data = {
        "baseuri":"https://link-to-my-source-of-case-data",
        "location": "UG",
        "start_date": "2020-04-01",
        "end_date": "2021-04-01",
        "episode_num": "10",
        "model_name":"SEIRDV",
        "userID":"61122946-1832-11ea-ssss-github", 
        "numdays":14, 
        "startpt":0,
        "maxpop":10000000.0, 
        "low":[0,0,0], 
        "high":[1,1,1]
        }):
        self.userID = data["userID"] if "userID" in data else "61122946-1832-11ea-ssss-github"
        self.statedata = ["ds", "de", "di", "dr", "dd", "dv"]
        self.window = int(data["numdays"]) if "numdays" in data else 14
        self.max_pop = float(data["maxpop"]) if "maxpop" in data else 10000000.0
        self.startpt = int(data["startpt"]) if "startpt" in data else 14
        end_date = data["end_date"] if "end_date" in data else "2021-04-01"
        start_date = data["start_date"] if "start_date" in data else "2020-04-01"
        location = data["location"] if "location" in data else "UG"
        baseuri = data["baseuri"] if "baseuri" in data else "https://link-to-my-source-of-case-data"

        number_of_windows = int((datetime.datetime.strptime(end_date, "%Y-%m-%d") - datetime.datetime.strptime(start_date, "%Y-%m-%d")).days/self.window)
        self.duration = self.window * number_of_windows
        self.action_names = np.array(["beta"]*number_of_windows+["alpha"]+["d0"]+["gamma"])
        self.actions_start_dates = [(datetime.datetime.strptime(start_date, "%Y-%m-%d") + datetime.timedelta(i * self.window)).strftime("%Y-%m-%d") for i in range(number_of_windows)]+[start_date]+[start_date]+[start_date]
        self.actions_end_dates = [(datetime.datetime.strptime(start_date, "%Y-%m-%d") + datetime.timedelta(((i+1) * self.window)-1)).strftime("%Y-%m-%d") for i in range(number_of_windows)] \
        +[(datetime.datetime.strptime(start_date, "%Y-%m-%d") + datetime.timedelta(self.duration-1)).strftime("%Y-%m-%d")] \
        +[(datetime.datetime.strptime(start_date, "%Y-%m-%d") + datetime.timedelta(self.duration-1)).strftime("%Y-%m-%d")] \
        +[(datetime.datetime.strptime(start_date, "%Y-%m-%d") + datetime.timedelta(self.duration-1)).strftime("%Y-%m-%d")]
        
        # self.action_space = gym.spaces.MultiDiscrete([50]*int(duration/numdays)+[20]+[20])
        #d0, alpha, gamma
        #epis should be telling us the ranges here!
        self.action_space = gym.spaces.Box(
            low=np.array([0.05]*number_of_windows+[0.1]+[0.0001]+[0.02]), 
            high=np.array([.3]*number_of_windows+[0.4]+[0.002]+[.2]), dtype=float)
        self.observation_space = gym.spaces.Box(low=0, high=self.max_pop, shape=(6,), dtype=float)

        # self.parms = pd.read_json(baseuri+"modelbasedata/json/%s/"%model_name)
        # casedata_ = pd.read_csv(baseuri+"casedata/csv/"+driver_data)
        parms = '''
        [
            {"alpha":0.2,"alphabeta":0.007800311303,"b0":2017.9017,"b1":0.1,"beta":0.2755065199,"bf":0.06060285777,"d0":0.000606656,"day0":"2020-04-01","days":20,"deaths":87,"e0":0.2,"exposed":null,"gamma":0.02212809241,"hospital":null,"hospital_recovery":null,"hs_days":null,"icu":null,"infectious":2986,"nu":0.2,"population":59308690,"qu_days":null,"quarantined":null,"r_exp_inf":null,"r_exp_rec":null,"r_hs_death":null,"r_hs_icu":null,"r_icu_death":null,"r_inf_qu":null,"r_inf_rec":null,"r_qu_hs":null,"recovered":1473,"susceptible":null,"vaccinated":null}
        ]
        '''
        self.parms = pd.read_json(parms)
        driver_data = location + "/?startDate=" + start_date
        casedata_ = pd.read_csv(baseuri+"casedata/csv/"+driver_data)

        self.N = casedata_['population'].tolist()[self.startpt]
        self.output0 = casedata_['confirmed_cases'].tolist()[self.startpt:]
        self.output1 = casedata_['deaths'].tolist()[self.startpt:]

        assert self.duration <= len(self.output0), "Output0 length does not match the length of the model driver"
        assert self.duration <= len(self.output1), "Output1 length does not match the length of the model driver"
        self.R0 = 0
        self.E0 = self.parms["exposed"][0] if "susceptible" in self.parms.keys() and not np.isnan(self.parms["susceptible"][0]) else 0
        self.D0 = self.output1[self.startpt]
        self.I0 = self.output0[self.startpt]-self.D0-self.R0
        self.V0 = 0
        if "susceptible" in self.parms.keys() and not np.isnan(self.parms["susceptible"][0]):
            self.S0 = self.parms["susceptible"][0]
            self.parms["population"] = self.S0 + self.I0 + self.R0 + self.D0
        else:
            self.S0 = self.N - self.I0 - self.R0 - self.D0
            self.parms.at[0,"susceptible"] = self.S0
            self.parms["population"] = self.N

        self.parms["days"] = self.duration
        self.parms["infectious"] = self.I0
        self.parms["recovered"] = self.R0
        self.parms["deaths"] = self.D0

        self.parms["exposed"] = self.E0
        self.parms["vaccinated"] = self.V0
        self.reset()
        return

    def reset(self):
        self.states = []
        self.actions = []
        self.tempactions = []
        self.jobids = []
        self.rewards = []
        return [self.S0, self.E0, self.I0, self.R0, self.D0, self.V0] #should probably clip to self.max_pop

    def step(self, action):
        done = False
        reward = None
        assert self.action_space.contains(action), "Invalid action: %s"%action
        if len(self.states) <= self.duration:
            self.actions.append(action)
            self.tempactions = np.repeat(action[0:-3], self.window)
            tmp = {}
            for ind in self.parms.keys():
                if ind == "beta":
                    tmp["beta"] = self.tempactions.tolist()
                # elif ind == "alpha":
                    # tmp["alpha"] = 0.001743884546577731#action[-3]
                elif ind == "d0":
                    tmp["d0"] = action[-2]
                elif ind == "gamma":
                    tmp["gamma"] = action[-1]
                else:
                    tmp[ind] = self.parms[ind][0]
            tmp["beta_window"]=self.window

            results = model.run_model(tmp)

            # self.states = gym.spaces.utils.np.array([[i['susceptible'],i['infectious'],i['recovered'],i['deaths']] for i in results])
            self.states = pd.DataFrame(results)

            model_data = gym.spaces.utils.np.array([self.states[['infectious','recovered','deaths']].sum(axis=1).values,self.states['deaths'].values]).T
            # model_data = gym.spaces.utils.np.array([self.states[:,1:].sum(axis=1), self.states[:,3]]).T
            real_data = gym.spaces.utils.np.array([np.array(self.output0[:self.duration]), self.output1[:self.duration]]).T

            se = (real_data-model_data)**2
            reward = - np.mean(np.sqrt(np.mean(se, axis=0))/(np.amax(real_data, axis=0)-np.amin(real_data, axis=0)))
            self.rewards.append(reward)
        done = True
        state = self.states.iloc[-1].values

        return state, reward, done, {}
