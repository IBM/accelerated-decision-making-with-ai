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

package com.ibm.pmai.taskclerk.controllers;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.validation.Valid;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ibm.pmai.models.core.Action;
import com.ibm.pmai.models.core.Algorithm;
import com.ibm.pmai.models.core.Executor;
import com.ibm.pmai.models.core.ExecutorRequirement;
import com.ibm.pmai.models.core.Experiment;
import com.ibm.pmai.models.core.Location;
import com.ibm.pmai.models.repositories.AlgorithmsRepository;
import com.ibm.pmai.models.repositories.ExecutionEnvironmentCommandRepository;
import com.ibm.pmai.models.repositories.ExecutorRepository;
import com.ibm.pmai.models.repositories.ExperimentRepository;
import com.ibm.pmai.models.repositories.LocationRepository;
import com.ibm.pmai.models.repositories.TaskRepository;
import com.ibm.pmai.models.request.JobDeploymentRequest;
import com.ibm.pmai.models.response.ExperimentStatusResponse;
import com.ibm.pmai.models.response.JobDeploymentResponse;
import com.ibm.pmai.models.response.JobDeploymentServiceStatusResponse;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.services.interfaces.ExperimentService;
import com.ibm.pmai.taskclerk.utils.Sha256DocumentHasher;
import com.ibm.pmai.taskclerk.utils.Utils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * Experiment Controller is used to manage all the interactions needed to manager experiment as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {


    /**
     * Experiment repository declaration
     */
    private ExperimentRepository experimentRepository;


    /**
     * ExecutorRepository declaration
     */
    private ExecutorRepository executorRepository;


    /**
     * TaskService declaration
     */
    private ExperimentService experimentService;

    private LocationRepository locationRepository;


    /**
     * Hashing util
     */
    private Sha256DocumentHasher sha256DocumentHasher;


    /**
     * AlgorithmsRepository repository declaration
     */
    @Autowired
    private AlgorithmsRepository algorithmsRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ExperimentController.class);

    /**
     * Experiment controller
     *
     * @param experimentRepository
     */
    @Autowired
    public ExperimentController(ApplicationConfigurations applicationConfigurations, ExperimentService experimentService, TaskRepository taskRepository, Sha256DocumentHasher sha256DocumentHasher, ExecutorRepository executorRepository, ExperimentRepository experimentRepository, ExecutionEnvironmentCommandRepository executionEnvironmentCommandRepository, LocationRepository locationRepository) {
        this.experimentRepository = experimentRepository;
        this.executorRepository = executorRepository;
        this.sha256DocumentHasher = sha256DocumentHasher;
        this.experimentService = experimentService;
        this.locationRepository = locationRepository;
    }

    /**
     * Returns Experiment
     *
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}")
    @Operation(summary = "Find Experiment by Experiment id",
        tags = {"Experiment"},
        description = "Returns a Experiment ",
        responses = {
            @ApiResponse(description = "Experiment", content = @Content(schema = @Schema(implementation = Experiment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a Experiment to be  retrieved", required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve Experiment by id
        Experiment experiment = experimentRepository.getOne(id);

        // Check if the returned object is not null
        if (null != experiment) {

            // Set Experiment as entity in response object
            return Response.ok().entity(experiment).build();

        } else {
            // Handle where Experiment is not provided
            throw new ApiException(404, "Experiment not found");
        }
    }


    /**
     * Save Experiment
     *
     * @param experiment
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(value = "/{returnDuplicates}")
    @Operation(summary = "Save Experiment",
        tags = {"Experiment"},
        description = "Save Experiment",
        responses = {
            @ApiResponse(description = "Experiment", content = @Content(schema = @Schema(implementation = Experiment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "Return duplicates", required = true) @Valid @PathVariable boolean returnDuplicates,
                        @Parameter(description = "Experiment object to be saved", required = true) @Valid @RequestBody Experiment experiment) throws Exception {

        // set audit details: created and updated at values
        experiment.setAuditValues();

        // check if the supplied executor exists
        if (experiment.getExecutor() == null 
        || experiment.getExecutor().getId() == null
        || experiment.getExecutor().getId().isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Executor id missing!");
        }
        Executor executor = executorRepository.getOne(experiment.getExecutor().getId());
        if (executor == null) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Executor provided is unknown!");
        }
        experiment.setExecutor(executor);

        // check if the supplied environment exists
        if (experiment.getSelectedPostExecutor() == null
        || experiment.getSelectedPostExecutor().get(0) == null
        || experiment.getSelectedPostExecutor().get(0).getId() == null
        || experiment.getSelectedPostExecutor().get(0).getId().isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Environment id missing!");
        }
        Executor environment = executorRepository.getOne(experiment.getSelectedPostExecutor().get(0).getId());
        if (environment == null) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Environment provided is unknown!");
        }
        List<Executor> selectedPostExecutor = new ArrayList<>();
        selectedPostExecutor.add(environment);
        experiment.setSelectedPostExecutor(selectedPostExecutor);

        // check if the supplied location exists
        if (experiment.getLocation() == null 
        || experiment.getLocation().getId() == null
        || experiment.getLocation().getId().isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Location id missing!");
        }
        Location location = locationRepository.getOne(experiment.getLocation().getId());
        if (location == null) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Location provided is unknown!");
        }
        experiment.setLocation(location);

        // compute hash
        String experimentHash = sha256DocumentHasher.getHash(Utils.getExperimentHash(experiment).getBytes());
        experiment.setExperimentHash(experimentHash);

        // check if hash exists if duplicates are to be returned
        if (returnDuplicates) {
            List<Experiment> experimentCopies = experimentRepository.getByExperimentHash(experimentHash);

            // if the hash exists return the duplicate experiment
            if (experimentCopies != null && !experimentCopies.isEmpty()) {
                return Response.ok().entity(experimentCopies).build();
            }
        }

        // if the hash does not exists update the experimentData with urls and class names 
        String iso2code = location.getCountry().substring(0, location.getCountry().length() - 1);
        List<ExecutorRequirement> executorRequirements = executor.getExecutorRequirement();
        if (executorRequirements == null || executorRequirements.isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Model is not linked to any driver data!");
        }
        executorRequirements.removeIf(er -> (!er.getCategory().equalsIgnoreCase("data")));
        if (executorRequirements.isEmpty() || executorRequirements.get(0).getValue() == null || executorRequirements.get(0).getValue().isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Model lacks data requements");
        }

        String dataUrl = executorRequirements.get(0).getValue() + "casedata/csv/" + iso2code + "/?startDate=2020-01-01";
        if (!Utils.validateLocationData(dataUrl)) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Model data for location " + iso2code + " missing");
        }

        // update data
        String dataString = JsonParser.parseString(experiment.getData()).getAsString();
        JsonObject data = JsonParser.parseString(dataString).getAsJsonObject();
        data.addProperty("baseuri", executorRequirements.get(0).getValue());
        data.addProperty("model_name",  executor.getName());
        data.addProperty("userID", experiment.getUserId());
        data.addProperty("location", iso2code);

        // check if the supplied algorithm id exists
        if (experiment.getAlgorithmId() != null && !experiment.getAlgorithmId().isEmpty()) {
            Algorithm algorithm = algorithmsRepository.getOne(experiment.getAlgorithmId());
            if (algorithm == null) {
                throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Algorithm provided is unknown!");
            }
            experiment.setAlgorithmId(algorithm.getId());

            data.addProperty("algorithm_name", algorithm.getTitle());
            data.addProperty("algorithm_uri", algorithm.getUri());
            data.addProperty("algorithm_requirements_uri", algorithm.getRequirements());
        }

        // get the optimization image
        if (executor.getExecutionEnvironmentCommand() == null) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Execution environment not defined");
        } 
        if (!executor.getExecutionEnvironmentCommand().getEnvironmentCommandName().equalsIgnoreCase("K8S_EXECUTOR")) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Unsupport executor "
            + executor.getExecutionEnvironmentCommand().getEnvironmentCommandName() + ". Current support is for K8S_EXECUTOR");
        }
        if (executor.getExecutionEnvironmentCommand().getCommandEntryPoint() == null
        || executor.getExecutionEnvironmentCommand().getCommandEntryPoint().isEmpty()
        || executor.getExecutionEnvironmentCommand().getCommandTemplate() == null
        || executor.getExecutionEnvironmentCommand().getCommandTemplate().isEmpty()
        || executor.getExecutionEnvironmentCommand().getExecutionEnvironment() == null
        || executor.getExecutionEnvironmentCommand().getExecutionEnvironment().getHostEndpoint() == null
        || executor.getExecutionEnvironmentCommand().getExecutionEnvironment().getHostEndpoint().isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Invalid command entry point and/or command template");
        }
        HashMap<String, String> args = new HashMap<String, String>();
        args.put("image", executor.getExecutionEnvironmentCommand().getCommandEntryPoint());

        // get the optimization image run command
        args.put("cmd", executor.getExecutionEnvironmentCommand().getCommandTemplate());

        data.addProperty("userID", experiment.getUserId());
        data.addProperty("model_uri", executor.getUri());
        data.addProperty("model_requirements_uri", executor.getRunCommand());

        data.addProperty("environment_name", environment.getTitle());
        data.addProperty("environments_uri", environment.getUri());
        data.addProperty("environments_requirements_uri", environment.getRunCommand());

        experiment.setData(data.toString());

        // save the experiment
        Experiment savedExperiment = experimentRepository.save(experiment);
        if (savedExperiment == null) {
            // Handle where Experiment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Experiment not saved");
        }

        data.addProperty("experimentID", savedExperiment.getId());
        JsonObject dataHolder = new JsonObject();
        dataHolder.addProperty("name", "data");
        dataHolder.add("value", data);
        args.put("data", dataHolder.toString());
        
        JobDeploymentRequest jobDeploymentRequest = new JobDeploymentRequest();
        jobDeploymentRequest.setArgs(args);
        jobDeploymentRequest.setType(experiment.getExperimentType().toLowerCase().replaceAll("\\s", ""));

        // post the experiment to the JDS
        JobDeploymentResponse jobDeploymentResponse = experimentService.postJDS(jobDeploymentRequest, executor.getExecutionEnvironmentCommand().getExecutionEnvironment().getHostEndpoint() + "/submit").getBody();

        // update saved experiment with job id
        savedExperiment.setJobId(jobDeploymentResponse.getJob_id());
        // set audit details: created and updated at values
        savedExperiment.setUpdatedAt(new Date());

        // updated Experiment
        Experiment updatedExperiment = experimentRepository.save(savedExperiment);

        // Return as a list of experiment for consistency with duplicated experiments
        List<Experiment> savedExperimentList = new ArrayList<>();
        // Check if the returned object is not null
        if (null != updatedExperiment) {
            // Set Experiment as entity in response object
            savedExperimentList.add(updatedExperiment);
        } else {
            savedExperimentList.add(savedExperiment);
        }

        // Set Experiment as entity in response object
        return Response.status(201).entity(savedExperimentList).build();
    }


    /**
     * update Experiment
     *
     * @param experiment
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping(value = "/{id}")
    @Operation(summary = "Update Experiment",
        tags = {"Experiment"},
        description = "Update Experiment",
        responses = {
            @ApiResponse(description = "Experiment", content = @Content(schema = @Schema(implementation = Experiment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of Experiment that needs to be updated", required = true) @Valid @PathVariable("id") String id,
        @Parameter(description = "Experiment object to update", required = true) @Valid @RequestBody Experiment experiment) throws Exception {

        // set Experiment
        experiment.setId(id);

        // set audit details: created and updated at values
        experiment.setUpdatedAt(new Date());

        // updated Experiment
        Experiment savedExperiment = experimentRepository.save(experiment);

        // Check if the returned object is not null
        if (null != savedExperiment) {

            // Set Experiment as entity in response object
            return Response.ok().entity(savedExperiment).build();

        } else {
            // Handle where Experiment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Experiment not fod");
        }
    }

    /**
     * Returns all experiment
     *
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping()
    @Operation(summary = "Returns all experiment",
        tags = {"Experiment"},
        description = "Returns all experiment ",
        responses = {
            @ApiResponse(description = "Experiment", content = @Content(schema = @Schema(implementation = Experiment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all experiment
        List<Experiment> savedExperiment = experimentRepository.findAll();

        // Check if the returned object is not null
        if (null != savedExperiment) {

            // Set Experiment as entity in response object
            return Response.ok().entity(savedExperiment).build();

        } else {
            // Handle where Experiment is not provided
            throw new ApiException(404, "Experiment not found");
        }
    }

        /**
     * Returns all experiment for a user
     *
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "user/{userId}")
    @Operation(summary = "Returns all experiment for a user",
        tags = {"Experiment"},
        description = "Returns all experiment for a user",
        responses = {
            @ApiResponse(description = "Experiment", content = @Content(schema = @Schema(implementation = Experiment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAllForUser(@Parameter(description = "userId of Experiments to be retrieved", required = true) @Valid @PathVariable String userId) throws Exception {

        // Retrieve all experiment
        List<Experiment> savedExperiment = experimentRepository.getByUserId(userId);

        // Check if the returned object is not null
        if (null != savedExperiment) {

            // Set Experiment as entity in response object
            return Response.ok().entity(savedExperiment).build();

        } else {
            // Handle where Experiment is not provided
            throw new ApiException(404, "Experiment not found");
        }
    }

    /**
     * Returns Status of an Experiment
     *
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "status/{id}")
    @Operation(summary = "Find Status of an Experiment",
        tags = {"Experiment"},
        description = "Returns Status of an Experiment",
        responses = {
            @ApiResponse(description = "Experiment", content = @Content(schema = @Schema(implementation = Experiment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findStatusById(@Parameter(description = "id of a Experiment to be retrieved", required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve Experiment by id
        Experiment experiment = experimentRepository.getOne(id);
        ExperimentStatusResponse experimentStatusResponse = new ExperimentStatusResponse();

        // Check if the returned object is not null
        if (null == experiment) {
            // Handle where Experiment is not provided
            throw new ApiException(404, "Experiment not found");
        }

        experimentStatusResponse.setStatus(experiment.getStatus());
        if (!experiment.getStatus()) {
            String jobId = experiment.getJobId();
            JobDeploymentServiceStatusResponse checkJobResponse = experimentService.jobStatus(jobId, experiment.getExecutor().getExecutionEnvironmentCommand().getExecutionEnvironment().getHostEndpoint() + "/check/").getBody();
            experimentStatusResponse.setJob(checkJobResponse);
        }
        return Response.ok().entity(experimentStatusResponse).build();
    }

    //sort Action List alphabetically using the model name and in ascending order using time
    public static List<Action> orderActions(List<Action> actions) {
        //actions.sort(Comparator.comparing(Action::getModelName).thenComparingInt(action -> Integer.parseInt(action.getTime())));
        actions.sort(Comparator.comparing(Action::getModelName).thenComparing(Action::getTime));
        return actions;
    }

    // Compute a unique hash given a list of items
    public static String hash(List<String> values) {
        long result = 17;
        for (String v : values) result = 37 * result + v.hashCode();
        return String.valueOf(result);
    }
}

