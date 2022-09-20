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
import constants
import requests
import ibm_boto3
from ibm_botocore.client import Config, ClientError
import hashlib

def dbpush(job_name, job_type, action_start_dates, action_end_dates, action_names, thedataframe, results, states_data_df):
    
    #prepare the data for upload/updating
    actions_df = pd.DataFrame({'action_position': list(range(0, len(action_names))), \
    'action_start_date': action_start_dates, 'action_end_date': action_end_dates, \
    'action_name': action_names, 'action_value': results})

    # thedataframe.fillna("None",inplace=True)
    states_data_df.fillna("None",inplace=True)

    data = {
        'id': job_name + "-" + job_type.lower(), 
        'actions': json.loads(actions_df.to_json(orient='records')),
        'states': json.loads(states_data_df.to_json(orient='records'))
        }
    if job_type == 'Calibration':
        data['study_trials'] = json.loads(thedataframe.to_json(orient='records'))

    print(data)

    with open(job_name + "-" + job_type.lower() + ".json", 'w') as outfile:
        json.dump(data, outfile)

    # Get COS credentials details
    url = constants.EXPERIMENT_URL+job_name
    response = requests.get(url)
    experiment = json.loads(response.content)["entity"]
    dataRepositoryConfigurationId = experiment["executor"]["dataRepositoryConfiguration"]["id"]
    print(dataRepositoryConfigurationId)

    url = constants.DATA_REPOSITORY_CREDENTIALS+dataRepositoryConfigurationId
    response = requests.get(url)
    cosCredentials = json.loads(json.loads(response.content)["entity"])
    print(cosCredentials)

    # upload
    with open(job_name + "-" + job_type.lower() + ".json", mode="r") as file:
        file_content = file.read()

    try:
        # Create resource
        cos = ibm_boto3.resource("s3",
                                    ibm_api_key_id= cosCredentials['apikey'],
                                    ibm_service_instance_id=cosCredentials['resource_instance_id'],
                                    ibm_auth_endpoint=cosCredentials['iamEndpoint'],
                                    config=Config(signature_version="oauth"),
                                    endpoint_url=cosCredentials['endpointUrl']
                                    )
        # set 5 MB chunks
        part_size = 1024 * 1024 * 5

        # set threadhold to 15 MB
        file_threshold = 1024 * 1024 * 15

        # set the transfer threshold and chunk size
        transfer_config = ibm_boto3.s3.transfer.TransferConfig(
            multipart_threshold=file_threshold,
            multipart_chunksize=part_size
        )

        with open(job_name + "-" + job_type.lower() + ".json", mode="rb") as file_data:
            cos.Object(cosCredentials['bucketName'],
                        job_name + "-" + job_type.lower() + ".json").upload_fileobj(Fileobj=file_data,
                                                                                    Config=transfer_config)

        # update job with link to output
        experiment_output_payload = {
            "name":  job_name + "-" + job_type.lower() + ".json",
            "description": "experiment_output",
            "hash": hashlib.md5(file_content.encode('utf-8')).hexdigest(),
            "metadataDetails": {
                "name":  job_name + "-" + job_type.lower() + ".json",
                "contentType": "json",
                "description": "experiment execution output file",
                "source":  job_name + "-" + job_type.lower() + ".json",
                "testData": "",
                "dataRepositoryConfiguration": {
                    "id": dataRepositoryConfigurationId
                }
            },
            "experiment": {
                "id": experiment["id"]
            }
        }
        print(experiment_output_payload)
        headers = {'Content-Type': 'application/json'}

        r = requests.post(constants.EXPERIMENT_OUTPUT_URL, data=json.dumps(experiment_output_payload),
                            headers=headers)

        if r.status_code != 200:
            print("FAILED TO UPDATE EXPERIMENT WITH OUTPUT")
    
    except Exception as e:
        print("FAILED TO UPLOAD FILE TO CLOUD OBJECT STORAGE {0}".format(e))
        # TODO: DO A WORK AROUND THIS AND HOW BEST TO HANDLE ERRORS
