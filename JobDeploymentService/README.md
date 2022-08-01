# accelerated-decision-making-with-ai Job Deployment Service (JDS)

This service is intended to enable deployment of a job within an openshift or a Kubernetes/minikube cluster (minishift was not tested).
The service is deployed into the cluster where the jobs will be deployed, so it's assumed that the appropriate credentials are available.

The service itself has two endpoints, one to check if a particular job is currently running, and the other to deploy a new job given a specified json payload defining the image to be used, and the environment variables which should be injected at runtime.

## DOCKER INSTALLATION
1. Download docker from https://docs.docker.com/engine/install/
2. Search for the docker installation file and install docker
3. start docker
4. type `docker ps` on terminal

## Prepare the Container Image (assuming IBM container registry)

`docker build . -t us.icr.io/namespace/jobname:tag`

`docker push us.icr.io/namespace/jobname:tag`

Alternatively you can use the `push_image.sh` to handle all transactions involved while pushing an image to the IBM Container registry.
You can run the script by either,
1. Providing all the environment variables inline, when running the script. e.g. in terminal run

    `sh ./push_image.sh <TARGET_IBM_CLOUD_URL> <TARGET_IBM_CLOUD_REGION <TARGET_IBM_CLOUD_GROUP> <IBM_CLOUD_APIKEY> <DOCKER_SERVER> <CONTAINER_REGISTRY_NAMESPACE> <IMAGE_NAME> <IMAGE_TAG>`

    with the correct variables.
2. Creating a `.env` file to hold all the required environment variables.
    ```
    # Shared variables
    DOCKER_SERVER=______
    CONTAINER_REGISTRY_NAMESPACE=______
    IMAGE_NAME=______
    IMAGE_TAG=______
    
    # Push image variables
    TARGET_IBM_CLOUD_URL='https://cloud.ibm.com'
    TARGET_IBM_CLOUD_REGION=______
    TARGET_IBM_CLOUD_GROUP=______
    IBM_CLOUD_APIKEY=______
    
    # Configure yaml files variables
    NAME=______
    IMAGE_PULL_SECRET_NAME=______
    JOB_NAMESPACE=______
    ```

   Copy the above and save it as `.env` in the JobDeploymentService directory and provide all the variables. Finally, run the script by simply running `sh ./push_image.sh`

    NB: Some variables are used in configuring the yaml files as discussed below.

`(optional)` If the  image already exists in the registry, opt to pull the image instead of pushing the Docker image.
To pull the Docker image, execute;
```
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

## Kubernetes Cluster Deployment

Start by generating and configuring the yaml files, by running the script `sh ./config_yaml_files.sh` if you already created the `.env` file above. Otherwise, either create the `.env` file and supply the variables or supply the required environment variables inline when running the script.

## Kind

1. Install kind `brew install kind`
2. Check for clusters `kind get clusters`
3. Create new cluster `kind create cluster --name admai`
4. To allow minikube to access and pull the image in the IBM container registry, create an image pull secret and update it in the `.env` file. Run, 
    `kubectl create secret docker-registry <YOUR_SECRET_NAME> --docker-server=<YOUR_DOCKER_SERVER e.g. us.icr.io> --docker-username=iamapikey --docker-password=<YOUR_ACCOUNT_APIKEY> --docker-email=<YOUR_DOCKER_EMAIL>`
5. cd to accelerated-decision-making-with-ai/JobDeploymentService directory
6. To allow the system user to access cluster resources, run `kubectl create -f ocprbac.yaml`
7. Create a deployment using `kubectl create -f ocpdeploy.yaml`
8. Create a service using `kubectl create -f mkbservice.yaml`
9. Check whether the pod is started by running `kubectl get pods` and if it is not started you can check more details using `kubectl describe pod <pod_name>`.
10. If the pod is started, run `kubectl port-forward service/<service_name> 7080:8080` to launch JobDeployment service on a web browser at `http://localhost:7080/ui`

****
NEXT UP -> Move to the [Initializations](../Initialization/README.md)

****
