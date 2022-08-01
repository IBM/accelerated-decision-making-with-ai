/*
 * Copyright 2022 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ibm.pmai.taskclerk.batch.results;


import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.annotation.BeforeStep;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ibm.cloud.objectstorage.services.s3.model.S3ObjectInputStream;
import com.ibm.pmai.models.core.Experiment;
import com.ibm.pmai.models.core.ExperimentOutput;
import com.ibm.pmai.models.core.ResultsRequest;
import com.ibm.pmai.models.repositories.ExperimentOutputRepository;
import com.ibm.pmai.models.repositories.ExperimentRepository;
import com.ibm.pmai.models.repositories.ResultsRequestRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.utils.Constants;
import com.ibm.pmai.taskclerk.utils.PBEEncryption;
import com.ibm.pmai.taskclerk.utils.Sha256DocumentHasher;
import com.ibm.pmai.taskclerk.utils.Utils;

public class Reader implements ItemReader<String> {

    /**
     * Experiment repository declaration
     */
    private ExperimentRepository experimentRepository;

    /**
     * TaskOutput repository declaration
     */
    private ExperimentOutputRepository experimentOutputRepository;

    /**
     * Hashing util
     */
    private Sha256DocumentHasher sha256DocumentHasher;

    /**
     * Encryption key
     */
    private PBEEncryption pbeEncryption;

    private ResultsRequestRepository resultsRequestRepository;

    /**
     * Application configurations to access property values
     */
    private ApplicationConfigurations applicationConfigurations;

    private String resultRequestId;
    private long epoch;


    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(Reader.class);


    @Autowired
    public Reader(ResultsRequestRepository resultsRequestRepository, ApplicationConfigurations applicationConfigurations, PBEEncryption pbeEncryption, ExperimentOutputRepository experimentOutputRepository, ExperimentRepository experimentRepository, Sha256DocumentHasher sha256DocumentHasher) {
        this.resultsRequestRepository = resultsRequestRepository;
        this.applicationConfigurations = applicationConfigurations;
        this.pbeEncryption = pbeEncryption;
        this.experimentOutputRepository = experimentOutputRepository;
        this.experimentRepository = experimentRepository;
        this.sha256DocumentHasher = sha256DocumentHasher;
    }

    @BeforeStep
    public void beforeStep(final StepExecution stepExecution) {
        JobParameters jobParameters = stepExecution.getJobParameters();
        resultRequestId = jobParameters.getString("resultRequestId");
        epoch = jobParameters.getLong("epoch");
    }

    @Override
    public String read() throws Exception, UnexpectedInputException,
        ParseException, NonTransientResourceException {
        JsonArray resultsArray = null;
        logger.info("READER: " + System.currentTimeMillis());

        if ((System.currentTimeMillis() - epoch) > (applicationConfigurations.getJobBatchTimeout()*60*60*1000)) {
            return null;
        }

        if (resultRequestId != null) {
            ResultsRequest resultsRequest = resultsRequestRepository.getById(resultRequestId);

            if (resultsRequest == null || resultsRequest.isStatus()) {
                return null;
            }
            
            // request of type experiment
            if (resultsRequest.getRequestName().equalsIgnoreCase("experiment")) {
                logger.info("=====experiment=====");

                List<Map<String, Object>> experimentArray = resultsRequest.getExperiments();
                if (experimentArray == null || experimentArray.size()<1) {
                    logger.info("======NO MATCHING FOUND====" + new Gson().toJson(resultsRequest));
                    return null;
                }

                resultsArray = fetchExperimentsResults(resultsRequest, experimentArray);

            } else if (resultsRequest.getRequestName().equalsIgnoreCase("search")) {
                // request of type search
                logger.info("=====search=====");

                List<Map<String, Object>> environmentsArray = resultsRequest.getEnvironments();

                List<Map<String, Object>> locationsArray = resultsRequest.getLocations();

                List<Map<String, Object>> experimentArray = new ArrayList<>();

                if (environmentsArray == null || locationsArray == null || environmentsArray.size()<1 || locationsArray.size()<1) {
                    logger.info("======NO MATCHING FOUND====" + new Gson().toJson(resultsRequest));
                    return null;
                }

                for (int i = 0; i < environmentsArray.size(); i++) {
                    String json = new Gson().toJson(environmentsArray.get(i));
                    JsonObject jsonExecutorObject = JsonParser.parseString(json).getAsJsonObject();
                    JsonObject jsonLocationObject = new JsonObject();
                    if (i < locationsArray.size()) {
                        jsonLocationObject = JsonParser.parseString(new Gson().toJson(locationsArray.get(i))).getAsJsonObject();
                    } else {
                        jsonLocationObject = JsonParser.parseString(new Gson().toJson(locationsArray.get(locationsArray.size()-1))).getAsJsonObject();
                    }

                    String executorId = jsonExecutorObject.get("id").getAsString();
                    String locationId = jsonLocationObject.get("id").getAsString();
                    // compute hash
                    String experimentHash = sha256DocumentHasher.getHash(Utils.getExperimentHash(locationId, executorId).getBytes());

                    // fetch experiment based on the computed hash
                    List<Experiment> experimentsWithHash = experimentRepository.getByExperimentHash(experimentHash);
                    if (experimentsWithHash == null || experimentsWithHash.size() < 1) {
                        continue;
                    }
                    for (int exp = 0; exp < experimentsWithHash.size(); exp++) {
                        Experiment experimentWithHash = experimentsWithHash.get(exp);
                        Map<String, Object> experimentWithHashObject = new HashMap<>();
                        experimentWithHashObject.put("id", experimentWithHash.getId().toString());
                        experimentArray.add(experimentWithHashObject);
                    }
                }

                resultsArray = fetchExperimentsResults(resultsRequest, experimentArray);

            } else if (resultsRequest.getRequestName().equalsIgnoreCase("algorithm")) {
                // request of type algorithm
                logger.info("=====algorithm=====");

                List<Map<String, Object>> algorithmsArray = resultsRequest.getExecutors();

                List<Map<String, Object>> environmentsArray = resultsRequest.getEnvironments();

                List<Map<String, Object>> locationsArray = resultsRequest.getLocations();

                List<Map<String, Object>> experimentArray = new ArrayList<>();

                if (environmentsArray == null || locationsArray == null || algorithmsArray == null || environmentsArray.size()<1 || locationsArray.size()<1 || algorithmsArray.size()<1) {
                    logger.info("======NO MATCHING FOUND====" + new Gson().toJson(resultsRequest));
                    return null;
                }

                for (int i = 0; i < environmentsArray.size(); i++) {
                    String json = new Gson().toJson(environmentsArray.get(i));
                    JsonObject jsonExecutorObject = JsonParser.parseString(json).getAsJsonObject();
                    JsonObject jsonLocationObject = new JsonObject();
                    JsonObject jsonAlgorithmObject = new JsonObject();
                    if (i < locationsArray.size()) {
                        jsonLocationObject = JsonParser.parseString(new Gson().toJson(locationsArray.get(i))).getAsJsonObject();
                    } else {
                        jsonLocationObject = JsonParser.parseString(new Gson().toJson(locationsArray.get(locationsArray.size()-1))).getAsJsonObject();
                    }

                    if (i < algorithmsArray.size()) {
                        jsonAlgorithmObject = JsonParser.parseString(new Gson().toJson(algorithmsArray.get(i))).getAsJsonObject();
                    } else {
                        jsonAlgorithmObject = JsonParser.parseString(new Gson().toJson(algorithmsArray.get(algorithmsArray.size()-1))).getAsJsonObject();
                    }

                    String executorId = jsonExecutorObject.get("id").getAsString();
                    String locationId = jsonLocationObject.get("id").getAsString();
                    String algorithmId = jsonAlgorithmObject.get("id").getAsString();
                    // compute hash
                    String experimentHash = sha256DocumentHasher.getHash(Utils.getExperimentHash(locationId, executorId).getBytes());

                    // fetch experiment based on the computed hash and algorithmId
                    List<Experiment> experimentsWithHashAndAlgorithmId = experimentRepository.getByExperimentHashAndAlgorithmId(experimentHash, algorithmId);
                    if (experimentsWithHashAndAlgorithmId == null || experimentsWithHashAndAlgorithmId.size() < 1) {
                        continue;
                    }
                    for (int exp = 0; exp < experimentsWithHashAndAlgorithmId.size(); exp++) {
                        Experiment experimentWithHashAndAlgorithmId = experimentsWithHashAndAlgorithmId.get(exp);
                        Map<String, Object> experimentWithHashObject = new HashMap<>();
                        experimentWithHashObject.put("id", experimentWithHashAndAlgorithmId.getId().toString());
                        experimentArray.add(experimentWithHashObject);
                    }
                }

                resultsArray = fetchExperimentsResults(resultsRequest, experimentArray);
            }
        }

        if (resultsArray != null) {
            logger.info("=====resultsArray====");
            return resultsArray.toString();
        } else
            return "";
    }

    private JsonArray fetchExperimentsResults(ResultsRequest resultsRequest,
            List<Map<String, Object>> experimentArray) throws Exception, IOException {
        JsonArray resultsArray = null;
        for (int i = 0; i < experimentArray.size(); i++) {
            String json = new Gson().toJson(experimentArray.get(i));
            JsonObject jsonExperimentObject = JsonParser.parseString(json).getAsJsonObject();

            String experimentId = jsonExperimentObject.get("id").getAsString();

            Experiment experiment = experimentRepository.getById(experimentId);
            if (experiment == null) {
                logger.info("======EXPERIMENT NOT FOUND====" + experimentId);
                continue;
            }

            JsonObject jsonResultObject = new JsonObject();

            jsonResultObject.addProperty("resultId", resultRequestId);
            jsonResultObject.addProperty("resultName", "");
            String outputType = Constants.TASK_OUTPUTS_TYPES.TASK_EXECUTION_RESPONSE.toString();

            if (experiment.getLocation()!= null)
                jsonResultObject.addProperty("locationId", experiment.getLocation().getId());
            if (experiment.getExecutor()!= null)
                jsonResultObject.addProperty("executorId", experiment.getExecutor().getId());

            List<ExperimentOutput> experimentOutputList = experimentOutputRepository.getByExperiment_IdOrderByUpdatedAt(experimentId);
            ExperimentOutput experimentOutput = null;
            if (experimentOutputList.size() > 0) {
                // The outputs are ordered by the updatedat time, so we get the first file
                experimentOutput = experimentOutputList.get(0);
            }
            
            if (resultsRequest.isStatus() 
            || experimentOutput == null
            || experimentOutput.getMetadataDetails() == null
            || experimentOutput.getMetadataDetails().getDataRepositoryConfiguration() == null) {
                logger.info("======TASK EXECUTION NOT READY====" + resultsRequest.isStatus()+experimentId);
                continue;
            }
            logger.info("======JOB EXECUTION READY====" + resultsRequest.isStatus());

            // decrypt credentials
            String decryptedCredentials = pbeEncryption
            .decrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), experimentOutput.getMetadataDetails().getDataRepositoryConfiguration().getCredentials());

            JsonObject jsonObject = JsonParser.parseString(decryptedCredentials).getAsJsonObject();

            String fileName = experimentOutput.getMetadataDetails().getName();

            S3ObjectInputStream s3ObjectInputStream = Utils.downloadFileFromCos(jsonObject.get("apikey").getAsString(), jsonObject.get("resource_instance_id").getAsString(), jsonObject.get("endpointUrl").getAsString()
                , jsonObject.get("bucketName").getAsString(), jsonObject.get("bucketRegion").getAsString(), jsonObject.get("iamEndpoint").getAsString(), fileName);

            InputStream inputStream = s3ObjectInputStream.getDelegateStream();
            String text = IOUtils.toString(inputStream, StandardCharsets.UTF_8.name());

            if (outputType.contains(Constants.TASK_OUTPUTS_TYPES.TASK_EXECUTION_RESPONSE.toString())){
                JsonObject dataObject = JsonParser.parseString(text).getAsJsonObject();
                if (dataObject.has("states")) {
                    jsonResultObject.add("rewards", dataObject.get("states").getAsJsonArray());
                }
                if (dataObject.has("actions")) {
                    jsonResultObject.add("actions", dataObject.get("actions").getAsJsonArray());
                }
                if (dataObject.has("study_trials")) {
                    jsonResultObject.add("study_trials", dataObject.get("study_trials").getAsJsonArray());
                }
                
                jsonResultObject.addProperty("outputType",outputType);
                
                if (resultsArray == null) {
                    resultsArray = new JsonArray();
                }
                resultsArray.add(jsonResultObject);
            }
        }
        return resultsArray;
    }
}
