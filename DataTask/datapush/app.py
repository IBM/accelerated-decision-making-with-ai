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
import uuid
from flask import Flask, Blueprint, render_template, request, escape, jsonify
from flask_swagger import swagger
from swagger_ui_bundle import swagger_ui_path
from flask_restx import Api, Resource
from werkzeug.datastructures import FileStorage
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.utils import secure_filename
import pandas as pd
import json
import constants
import requests
import ibm_boto3
from ibm_botocore.client import Config, ClientError
import hashlib
import glob


app = Flask(__name__)
api = Api(app)

upload_parser = api.parser()
upload_parser.add_argument('file', type=FileStorage, location='files',required=True)
upload_parser.add_argument('data_repository_configuration_ID', type=str,required=True)


@api.route('/datapush')
@api.expect(upload_parser)
class CollectData(Resource):
    def post(self):
        args = upload_parser.parse_args()
        file = args.get('file')
        data_repository_configuration_ID = args.get('data_repository_configuration_ID')
        #4028818382aacd920182aacf07340000

        UPLOAD_FOLDER = '/Users/dorcasawino/Documents/dev/open-source/accelerated-decision-making-with-ai/DataTask/datapush/pushed_datasets'
        randID = str(uuid.uuid4())
        appendRand = "datapush-"+str(randID)
        appendNewname = str(appendRand)+"-"+file.filename
        url=os.path.join(UPLOAD_FOLDER,appendNewname)
        
        # file1 = open(url, "w")
        # toFile = "John,Doe,120 jefferson st.,Riverside, NJ, 08075"
        # file1.write(toFile)
        # file1.close()

        dbpush(url, data_repository_configuration_ID, appendNewname)
        return "Uploaded file is " + file.filename + data_repository_configuration_ID

def dbpush(url, data_repository_configuration_ID,appendNewname):
    
    with open(url, mode="r") as file:
        file_content = file.read()

    # Get COS credentials details
    dataRepositoryConfigurationId = data_repository_configuration_ID
    print(dataRepositoryConfigurationId)

    credentials_url = constants.DATA_REPOSITORY_CREDENTIALS+dataRepositoryConfigurationId
    response = requests.get(credentials_url)
    cosCredentials = json.loads(json.loads(response.content)["entity"])
    print(cosCredentials)

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

        with open(url, mode="rb") as file_data:
            cos.Object(cosCredentials['bucketName'],
                        appendNewname).upload_fileobj(Fileobj=file_data,Config=transfer_config)

        # update job with link to output
        DataPush_output_payload = {
            "name":  appendNewname,
            "description": "DataPush_output",
            "hash": hashlib.md5(file_content.encode('utf-8')).hexdigest(),
            "metadataDetails": {
                "name":  appendNewname,
                "contentType": "json",
                "description": "DataPush output file",
                "source":  appendNewname,
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
        files = glob.glob('/DataTask/datapush/pushed_datasets')
        for f in files:
            os.remove(f)
        if r.status_code != 200:
            print("FAILED TO UPDATE DataPush WITH OUTPUT")
        else:
            print("SUCCESSFULLY UPLOADED DATAPUSH OBJECT TO CLOUD OBJECT STORAGE")
    
    except Exception as e:
        print("FAILED TO UPLOAD FILE TO CLOUD OBJECT STORAGE {0}".format(e))
        # TODO: DO A WORK AROUND THIS AND HOW BEST TO HANDLE ERRORS
        

if __name__ == '__main__':
    app.run(debug=True)