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
import json
import yaml
from kubernetes import client, config
JOB_NAMESPACE = os.getenv('JOB_NAMESPACE', "default")

def kube_authenticate():
    # Authenticate using local kube file or the service account in a cluster.
    try:
        config.load_kube_config()
    except:
        config.load_incluster_config()


def iscodeengine():
    try:  
        print(os.environ['CE_APP'])
        return 'CE_APP' in  os.environ.keys()
    except:
        return False


def create_notce_job_object(job_name, args):
    """Build job spec."""
    f="""
    apiVersion: batch/v1          ## The version of the Kubernetes API
    kind: Job                     ## The type of object for jobs
    metadata:
      name: job-test
    spec:                        ## What state you desire for the object
      template:
       metadata:
         name: job-test
       spec:
         containers:
         - name: job
           image: busybox                  ##  Image used
           command: ["echo"]   ##  Command used to create logs for verification later
           args: ["job-test"]
         restartPolicy: Never          ##  Restart Policy in case container failed
         imagePullSecrets:
          - name: ris-ibm-container-registry    
    """
    job = yaml.safe_load(f)
    job["metadata"]["name"] = job_name
    job["spec"]["template"]["metadata"]["name"] = job_name
    simpleenvs = [{"name":"JOB_NAME", 'value': job_name}]
    for key in args.keys():
        if key == "cmd" or key == "args" or key == "image": continue
        o = json.loads(args[key])
        # Serialize all environmental variables but deserialize kubernetes
        # specific objects such as `valueFrom`
        if "value" in o:
            simpleenvs.append({"name": o["name"], "value": json.dumps(o["value"])})
        else:
            simpleenvs.append(o)
    job["spec"]["template"]["spec"]["containers"][0]["env"] = simpleenvs
    if "image" in args.keys():
        job["spec"]["template"]["spec"]["containers"][0]["image"] = args["image"]
    if "cmd" in args.keys():
        job["spec"]["template"]["spec"]["containers"][0]["command"] = [x for x in args["cmd"].split(" ")]

    # For containers without arguments
    if "args" in args.keys():
        job["spec"]["template"]["spec"]["containers"][0]["args"] = [args["args"]]
    else:
        job["spec"]["template"]["spec"]["containers"][0].pop("args", None)
    return job


def create_ce_job_object(job_name, args):
    """Build CE job spec."""
    f = """
    apiVersion: codeengine.cloud.ibm.com/v1beta1          ## The version of the Kubernetes API
    kind: JobRun                     ## The type of object for jobs
    metadata:
     name: job-test
    spec:                        ## What state you desire for the object
     jobDefinitionSpec:
      template:
        metadata:
          name: job-test
        containers:
        - name: job
          image: busybox                  ##  Image used
          command: ["echo"]   ##  Command used to create logs for verification later
          args: ["job-test"]
        restartPolicy: Never          ##  Restart Policy in case container failed
        imagePullSecrets:
          - name: ris-ibm-container-registry
    """

    job = yaml.safe_load(f)
    job["metadata"]["name"] = job_name
    job["spec"]["jobDefinitionSpec"]["template"]["metadata"]["name"] = job_name
    simpleenvs = [{"name":"JOB_NAME", 'value': job_name}]
    for key in args.keys():
        if key == "cmd" or key == "args" or key == "image": continue
        o = json.loads(args[key])
        # Serialize all environmental variables but deserialize kubernetes
        # specific objects such as `valueFrom`
        if "value" in o:
            simpleenvs.append({"name": o["name"], "value": json.dumps(o["value"])})
        else:
            simpleenvs.append(o)
    job["spec"]["jobDefinitionSpec"]["template"]["containers"][0]["env"] = simpleenvs
    if "image" in args.keys():
        job["spec"]["jobDefinitionSpec"]["template"]["containers"][0]["image"] = args["image"]
    if "cmd" in args.keys():
        job["spec"]["jobDefinitionSpec"]["template"]["containers"][0]["command"] = [x for x in args["cmd"].split(" ")]
    if "args" in args.keys():
        job["spec"]["jobDefinitionSpec"]["template"]["containers"][0]["args"] = [args["args"]]
    else:
        job["spec"]["jobDefinitionSpec"]["template"]["containers"][0].pop("args", None)
    return job


def create_ce_job(api_instance, job, namespace=JOB_NAMESPACE):
    api_response = api_instance.create_namespaced_custom_object(
                group="codeengine.cloud.ibm.com",
                version="v1beta1",
                namespace=namespace,
                plural="jobruns",
                body=job,
            )
    return api_response


def create_notce_job(api_instance, job, namespace=JOB_NAMESPACE):
    api_response = api_instance.create_namespaced_job(body=job, namespace=JOB_NAMESPACE)
    return api_response.status


def run_job(job_run_id, metadata):
    kube_authenticate()
    #is this a codeengine cluster?
    if iscodeengine():
        return create_ce_job(
            client.CustomObjectsApi(), 
            create_ce_job_object(job_run_id, metadata))
    else:
        return create_notce_job(
            client.BatchV1Api(), 
            create_notce_job_object(job_run_id, metadata))


def job_status(job_id):
    """Check status of specific job."""
    ran_jobs = job_statii()
    resp = []
    for entry in ran_jobs:
        if entry[0] == job_id:
            resp.append((job_id, entry[1]))
    if len(resp) == 0:
        status = "not_found"
        resp.append((job_id, status))

    return resp


def job_statii():
    kube_authenticate()
    #is this a codeengine cluster?
    if iscodeengine():
        return job_ce_statii()
    else:
        return job_notce_statii()


def job_notce_statii():
    """Check status of all known kubernetes jobs."""
    kube_authenticate()
    api_client = client.BatchV1Api()
    # TODO: Not supported by upstream see: https://github.com/kubernetes-client/python/issues/1082
    # When this feature is added it can be included as a filter to reduce the response size.
    # field_selector = "metadata.name"

    jobs = api_client.list_namespaced_job(JOB_NAMESPACE)
    ran_jobs = []
    for job in jobs.items:
        if job.status.active is not None and job.status.active >= 1:
            status = "active"
        elif job.status.succeeded is not None and job.status.succeeded >= 1:
            status = "succeeded"
        elif job.status.failed is not None and job.status.failed >= 1:
            status = "failed"
        else:
            raise ValueError(f"Unsupported job status {job.status}. Check the logs.")
        ran_jobs.append((job.metadata.name, status))

    return ran_jobs


def job_ce_statii():
    """Check status of all known kubernetes jobs."""
    kube_authenticate()
    api_client = client.CustomObjectsApi()
    jobs = api_client.list_namespaced_custom_object(
                group="codeengine.cloud.ibm.com",
                version="v1beta1",
                plural="jobruns",
                namespace= JOB_NAMESPACE
            )
    ran_jobs = []
    for job in jobs["items"]:
        if job["status"]["requested"] is not None and job["status"]["requested"] >= 1:
            status = "requested"
        elif job["status"]["pending"] is not None and job["status"]["pending"] >= 1:
            status = "pending"
        elif job["status"]["running"] is not None and job["status"]["running"] >= 1:
            status = "active"
        elif job["status"]["failed"] is not None and job["status"]["failed"] >= 1:
            status = "failed"
        elif job["status"]["succeeded"] is not None and job["status"]["succeeded"] >= 1:
            status = "succeeded"
        elif job["status"]["unknown"] is not None and job["status"]["unknown"] >= 1:
            status = "unknown"
        else:
            raise ValueError(f"Unsupported job status {job['status']}. Check the logs.")
        ran_jobs.append((job["metadata"]["name"], status))

    return ran_jobs
