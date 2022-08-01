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

import optuna

from sys import exit, exc_info, argv
import random
import gym
import numpy as np
optuna.logging.set_verbosity(optuna.logging.WARNING)

class CustomAgent:
    def __init__(self, environment, episode_number=20, seed=None):
        self.environment = environment
        self.episode_number = episode_number
        self.seed = seed
 
        if isinstance(self.environment.action_space, gym.spaces.multi_discrete.MultiDiscrete):
          self.high = (environment.action_space.nvec)-1
          self.low = environment.action_space.nvec*0
        elif isinstance(self.environment.action_space, gym.spaces.box.Box):
          self.high = environment.action_space.high
          self.low = environment.action_space.low
        else:
          raise ValueError("This action space (%s) is not currently supported for this algorithm."%type(self.environment.action_space))

    def f(self, trial):
        self.environment.reset()
        intervention_program = [trial.suggest_uniform(str(i), j, k) for i,j,k in zip(range(len(self.low)),self.low,self.high)]
        state, reward, done, _ = self.environment.step(intervention_program)
        return -reward

    def generate(self):
        best_interventionprogram = []
        best_reward = []
        candidates = []
        self.study = optuna.create_study(sampler=optuna.samplers.NSGAIISampler(seed=self.seed))
        n=5
        try:
          for _ in range(n):
            self.study.optimize(self.f, n_trials=self.episode_number/n)
            
            res = self.study.best_params
            program = [res[str(i)] for i in range(len(self.low))]

            self.environment.reset()
            _,reward,_,_ = self.environment.step(program)

            best_interventionprogram.append(program)
            best_reward.append(reward)
        
        except (KeyboardInterrupt, SystemExit):
            print(exc_info())

        return best_interventionprogram, best_reward
