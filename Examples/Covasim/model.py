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

from datetime import datetime, timedelta
import json
import argparse
import covasim as cv

def run_model(parameters, pop_size=2e5):
    ##Country demographics
    pars = {}
    pop_scale = int(parameters["population"]/pop_size)

    pars["rescale"] = True
    pars["pop_scale"] = pop_scale
    pars["pop_size"] = pop_size

    ## Covid parameters
    pars["pop_infected"] = parameters["infectious"]
    pars["rel_severe_prob"] = 1.0
    pars["rel_crit_prob"] = 1.0
    pars["rel_symp_prob"]=  1.0
    # pars["asym2rec"]
    # pars["mild2rec"]

    results=[]
    verbose = 0

    ## Simulation parameters
    day0 = parameters["day0"]
    pars["n_days"] = int(parameters["days"])

    ##Controlled parameters
    pars["rel_death_prob"] = parameters["d0"]
    # nu = parameters["nu"]  # vaccination rate
    betas = parameters["beta"]

    assert pars["n_days"] == len(betas)*parameters["beta_window"], "Mismatch of number of days of simulation and interventions (%s ~= %s)"%(pars["n_days"], len(betas))

    times = [i*parameters["beta_window"] for i in range( len(betas) )] #day when the beta values change
    pars["interventions"] = cv.change_beta(times, betas)
    pars["use_waning"]=False #permit reinfection
    # nab_decay=dict(form='nab_growth_decay', growth_time=21, decay_rate1=0.07, decay_time1=47, decay_rate2=0.02, decay_time2=106)
    sim = cv.Sim(pars=pars, verbose=verbose)
    sim.run(verbose=verbose)

    for day in range(pars["n_days"]):
        results.append({
            'day': (datetime.strptime(day0,'%Y-%m-%d')+timedelta(days=day)).strftime('%Y-%m-%d'),
            'population': pars["pop_size"],
            'susceptible': sim.results["n_susceptible"][day],
            'exposed': 0,
            'infectious': sim.results["n_infectious"][day],
            'quarantined': None,
            'hospital': None,
            'icu': None,
            'hospital_recovery': None,
            'deaths': sim.results['cum_deaths'][day],
            'recovered': sim.results['n_recovered'][day],
            'vaccinated': 0
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
