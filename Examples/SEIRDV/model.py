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

from numpy import exp, pi, sqrt, array, isnan
from datetime import datetime, timedelta
import json
import copy
import argparse
import numpy as np
from scipy.integrate import odeint

def run_model(parameters):
    ##Country demographics
    N =  parameters["population"]
    I0 = parameters["infectious"] if parameters["infectious"] is not None else 0
    R0 = parameters["recovered"] if parameters["recovered"] is not None else 0
    D0 = parameters["deaths"] if hasattr(parameters, "deaths") and parameters["deaths"] is not None else 0
    V0 = parameters["vaccinated"] if hasattr(parameters, "vaccinated") and parameters["vaccinated"] is not None else 0
    results=[]

    #simulation parameters
    day0 = parameters["day0"]
    duration = int(parameters["days"])

    ##Model parameters
    d0= parameters["d0"]
    beta0 = parameters["beta"]
    gamma = parameters["gamma"]
    alpha = parameters["alpha"]

    e0 = parameters["e0"]  if hasattr(parameters, "e0") and parameters["e0"] is not None and not isnan(parameters["e0"])else 0.2 # some multiple of I0 based on the literature
    nu = parameters["nu"]  if hasattr(parameters, "nu") and parameters["nu"] is not None and not isnan(parameters["nu"])else 0 # vaccination rate

    # Estimated Country demographics
    E0 = parameters["exposed"] if parameters["exposed"] is not None and parameters["exposed"] is not None and not isnan(parameters["exposed"]) else e0 * I0
    S0 = parameters["susceptible"] if parameters["susceptible"] is not None else N - I0 - R0 - D0 - E0 - V0

    # The SEVIRD model differential equations.
    def deriv(y, t):
        S, E, I, R, D, V = y
        dSdt = -beta0[t] * (S/N) * I - S * nu
        dEdt = beta0[t] * (S/N) * I - alpha * E
        dIdt = alpha * E - (gamma + d0) * I
        dRdt = gamma * I - R * nu
        dDdt = d0 * I
        dVdt = nu * (S + R)
        return dSdt, dEdt, dIdt, dRdt, dDdt, dVdt

    # Integrate the SIRD equations over the time grid, t.
    loopresults=[]
    # Initial conditions vector
    y = array([S0, E0, I0, R0, D0, V0])
    
    for time in range(duration):
        loopresults.append(copy.deepcopy(y))
        aval = deriv(y, time)
        y += array(aval)
    loopresults = array(loopresults)
    S, E, I, R, D, V = loopresults[:, 0], loopresults[:, 1], loopresults[:, 2], loopresults[:, 3], loopresults[:, 4], loopresults[:, 5]

    for day in range(duration):
        results.append({
            'day': (datetime.strptime(day0,'%Y-%m-%d')+timedelta(days=day)).strftime('%Y-%m-%d'),
            'population': N,
            'susceptible': S[day],
            'exposed': E[day],
            'infectious': I[day],
            'quarantined': None,
            'hospital': None,
            'icu': None,
            'hospital_recovery': None,
            'deaths': D[day],
            'recovered': R[day],
            'vaccinated': V[day]
        })
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_data', default="input.json", help='The JSON formatted file containing the parameters for the model')
    parser.add_argument('--output_data', default="output.json", help='The JSON formatted file containing the output for the model')
    args = parser.parse_args()

    input_data, output_data = args.input_data, args.output_data

    with open(input_data) as json_file:
        parms = json.load(json_file)
        results = run_model(parms[0])

    if output_data != "":
        with open(output_data, "w") as outfile:
            json.dump(results, outfile, indent=2)
