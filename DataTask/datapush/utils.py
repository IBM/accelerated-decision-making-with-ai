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

def dbpush(data_to_push):
    
    #prepare the data for upload/updating
    data_to_push_df = pd.DataFrame([data_to_push])


    data = {
        'id': "12" + "-datapush",
        'data': json.loads(data_to_push_df.to_json(orient='records'))
        }

    print(data)

    with open("12" + "-datapush.json", 'w') as outfile:
        json.dump(data, outfile)

    # Get COS credentials details
    url = constants.DATA_REPOSITORY_CATEGORY
    response = requests.get(url)
    categorylist = json.loads(response.content)["entity"][0]
    dataRepositoryConfigurationId = categorylist["id"]
    print(dataRepositoryConfigurationId)

    url = constants.DATA_REPOSITORY_CREDENTIALS+dataRepositoryConfigurationId
    response = requests.get(url)
    cosCredentials = json.loads(json.loads(response.content)["entity"])
    print(cosCredentials)
    
    # with open('data-dump.json') as f:
    #     data = json.load(f)
    #     cosCredentials = json.loads(data["credentials"])
    #     print(cosCredentials)
    

    # upload
    with open("12" + "-datapush.json", mode="r") as file:
        file_content = file.read()

    try:
        # Create resource
        cos = ibm_boto3.resource("s3",
                                    ibm_api_key_id= cosCredentials['apikey'],
                                    ibm_service_instance_id=cosCredentials['iam_serviceid_crn'],
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

        with open("12" + "-datapush.json", mode="rb") as file_data:
            cos.Object(cosCredentials['bucketName'],
                        "12" + "-datapush.json").upload_fileobj(Fileobj=file_data,
                                                                                    Config=transfer_config)

        # update job with link to output
        DataPush_output_payload = {
            "name":  "12" + "-datapush.json",
            "description": "DataPush_output",
            "hash": hashlib.md5(file_content.encode('utf-8')).hexdigest(),
            "metadataDetails": {
                "name":  "13" + "-datapush.json",
                "contentType": "json",
                "description": "DataPush output file",
                "source":  "12" + "-datapush.json",
                "testData": "",
                "dataRepositoryConfiguration": {
                    "id": dataRepositoryConfigurationId,
                }
                
            },
            }
        
        print(DataPush_output_payload)
        headers = {'Content-Type': 'application/json'}

        r = requests.post(constants.DataPush_URL, data=json.dumps(DataPush_output_payload),
                            headers=headers)
        print(r.status_code)
        print(r.content)
        if r.status_code != 200:
            print("FAILED TO UPDATE DataPush WITH OUTPUT")
    
    except Exception as e:
        print("FAILED TO UPLOAD FILE TO CLOUD OBJECT STORAGE {0}".format(e))
        # TODO: DO A WORK AROUND THIS AND HOW BEST TO HANDLE ERRORS

# Get data
with open('empty.json') as f:
    data_to_push = json.load(f)
    print(data_to_push)


dbpush(data_to_push)