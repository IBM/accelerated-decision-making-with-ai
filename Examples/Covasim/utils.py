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

import pandas as pd
import json

def dbpush(job_name, job_type, action_start_dates, action_end_dates, action_names, thedataframe, results, states_data_df):
    #prepare the data for upload/updating
    
    actions_df = pd.DataFrame({'action_position': list(range(0, len(action_names))), \
    'action_start_date': action_start_dates, 'action_end_date': action_end_dates, \
    'action_name': action_names, 'action_value': results[0][-1]})

    # thedataframe.fillna("None",inplace=True)
    states_data_df.fillna("None",inplace=True)

    data = {
        'id': job_name + "-" + job_type.lower(), 
        'study_trials': json.loads(thedataframe.to_json(orient='records')),
        'actions': json.loads(actions_df.to_json(orient='records')),
        'states': json.loads(states_data_df.to_json(orient='records'))
        }

    print(data)