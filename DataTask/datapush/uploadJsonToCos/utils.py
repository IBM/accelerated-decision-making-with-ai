import requests
import ibm_boto3
import constants
import json
from ibm_botocore.client import Config
import hashlib
import os

# Clean up function to remove files created under the pushed_datasets folder
def delete_if_exists(url):
    os.remove(url) 
    
def dbpush(url, data_repository_configuration_ID,appendNewname):
    
    with open(url, mode="r") as file:
        file_content = file.read()

    # Get COS credentials details
    dataRepositoryConfigurationId = data_repository_configuration_ID
    credentials_url = constants.DATA_REPOSITORY_CREDENTIALS+dataRepositoryConfigurationId
    response = requests.get(credentials_url)
    cosCredentials = json.loads(json.loads(response.content)["entity"])
 
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

        # update datapush with link to output
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

        delete_if_exists(url)

        if r.status_code != 200:
            print("FAILED TO UPDATE DataPush WITH OUTPUT")
        else:
            print("SUCCESSFULLY UPLOADED DATAPUSH OBJECT TO CLOUD OBJECT STORAGE")
    
    except Exception as e:
        print("FAILED TO UPLOAD FILE TO CLOUD OBJECT STORAGE {0}".format(e))
        # TODO: DO A WORK AROUND THIS AND HOW BEST TO HANDLE ERRORS  