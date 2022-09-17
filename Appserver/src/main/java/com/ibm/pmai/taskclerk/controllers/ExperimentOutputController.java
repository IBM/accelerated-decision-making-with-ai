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

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ibm.cloud.objectstorage.services.s3.model.S3ObjectInputStream;
import com.ibm.pmai.models.core.ExperimentOutput;
import com.ibm.pmai.models.repositories.ExperimentOutputRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.utils.Constants;
import com.ibm.pmai.taskclerk.utils.PBEEncryption;
import com.ibm.pmai.taskclerk.utils.Utils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * ExperimentOutput Controller is used to manage all the interactions needed to manager experimentOutput as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/experimentOutput")
public class ExperimentOutputController {

    /**
     * ExperimentOutput repository declaration
     */
    private ExperimentOutputRepository experimentOutputRepository;

    /**
     * Encryption key
     */
    private PBEEncryption pbeEncryption;

    /**
     * Application configurations to access property values
     */
    private ApplicationConfigurations applicationConfigurations;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ExperimentOutputController.class);

    /**
     * ExperimentOutput controller
     * @param experimentOutputRepository
     */
    @Autowired
    public ExperimentOutputController(ExperimentOutputRepository experimentOutputRepository,PBEEncryption pbeEncryption,ApplicationConfigurations applicationConfigurations) {
        this.experimentOutputRepository = experimentOutputRepository;
        this.pbeEncryption =pbeEncryption;
        this.applicationConfigurations = applicationConfigurations;
    }

    /**
     * Returns ExperimentOutput
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find ExperimentOutput by ExperimentOutput id",
        tags = {"ExperimentOutput"},
        description = "Returns an ExperimentOutput ",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a ExperimentOutput to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve ExperimentOutput by id
         Optional<ExperimentOutput> optionalExperimentOutput = experimentOutputRepository.findById(id);

        // Check if the returned object is not null
        if (null != optionalExperimentOutput  && optionalExperimentOutput.isPresent())  {
            ExperimentOutput experimentOutput = optionalExperimentOutput.get();

            // Set ExperimentOutput as entity in response object
            return Response.ok().entity(experimentOutput).build();

        } else {
            // Handle where ExperimentOutput is not provided
            throw new ApiException(404, "ExperimentOutput not found");
        }
    }


    /**
     * Save ExperimentOutput
     * @param experimentOutput
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save ExperimentOutput",
        tags = {"ExperimentOutput"},
        description = "Save ExperimentOutput",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "ExperimentOutput object to be saved",required = true) @Valid @RequestBody ExperimentOutput experimentOutput) throws Exception {


        // set audit details: created and updated at values
        experimentOutput.setAuditValues();
        experimentOutput.getMetadataDetails().setAuditValues();

        if (experimentOutput.getName().contains("output")){
            experimentOutput.setType(Constants.TASK_OUTPUTS_TYPES.TASK_EXECUTION_OUTPUT_RESPONSE.toString());

        } else if (experimentOutput.getName().contains("reward")) {
            experimentOutput.setType(Constants.TASK_OUTPUTS_TYPES.TASK_EXECUTION_REWARD_RESPONSE.toString());

        } else  experimentOutput.setType(Constants.TASK_OUTPUTS_TYPES.TASK_EXECUTION_RESPONSE.toString());

        // check if we have that file added
       ExperimentOutput experimentOutput1 = experimentOutputRepository.getByHashAndAndTypeAndExperiment_Id(experimentOutput.getHash(),experimentOutput.getType(),experimentOutput.getExperiment().getId());
        if (experimentOutput1==null){
            // save ExperimentOutput
            ExperimentOutput savedExperimentOutput = experimentOutputRepository.save(experimentOutput);

            // Check if the returned object is not null
            if (null != savedExperimentOutput) {

                // Set ExperimentOutput as entity in response object
                return Response.ok().entity(savedExperimentOutput).build();

            } else {
                // Handle where ExperimentOutput is not save - most probably due to bad request
                throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExperimentOutput not fod");
            }
        } else {
            // File already saved
            return Response.ok().entity(experimentOutput1).build();
        }
    }




    /**
     * Returns all experimentOutput:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all experimentOutput",
        tags = {"ExperimentOutput"},
        description = "Returns all experimentOutput ",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all experimentOutput
        List<ExperimentOutput> savedExperimentOutput = experimentOutputRepository.findAll();

        // Check if the returned object is not null
        if (null != savedExperimentOutput) {

            // Set ExperimentOutput as entity in response object
            return Response.ok().entity(savedExperimentOutput).build();

        } else {
            // Handle where ExperimentOutput is not provided
            throw new ApiException(404, "ExperimentOutput not found");
        }
    }

    /**
     * get experiment output by experiment id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping (value = "/experiment/{experimentId}"  )
    @Operation(summary = "Fetch a list of all experiment output by experiment id",
        tags = {"ExperimentOutput"},
        description = "Fetch a list of all experiment output by experiment id",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getExperimentOutputByExperimentId(
        @Parameter(description = "experiment Id", required = true)  @Valid @PathVariable("experimentId") String experimentId) throws Exception {

        // get output by experiment id
       List<ExperimentOutput> experimentOutputList =  experimentOutputRepository.getByExperiment_Id(experimentId);

        if (experimentOutputList!=null) {

            // Set Experiment as entity in response object
            return Response.ok().entity(experimentOutputList).build();

        } else {
            // Handle where Experiment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Experiment output not found");
        }

    }

    /**
     * get experiment output by experiment id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping (value = "/file/by.experiment.id/{experimentId}/{experimentOutputType}"  )
    @Operation(summary = "get experiment file output by experiment id and experiment output type",
        tags = {"ExperimentOutput"},
        description = "get experiment file output by experiment id and experiment output type",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public ResponseEntity<InputStreamResource> getExperimentOutputFileByExperimentIdAndExperimentOutputType(
        @Parameter(description = "experiment output type", required = true)  @Valid @PathVariable("experimentOutputType") Constants.TASK_OUTPUTS_TYPES experimentOutputType,
        @Parameter(description = "experiment Id", required = true)  @Valid @PathVariable("experimentId") String experimentId) throws Exception {
        // get output by experiment id
        List<ExperimentOutput> experimentOutputList =  experimentOutputRepository.getByExperiment_IdAndAndTypeOrderByUpdatedAt(experimentId, experimentOutputType.toString());
        ExperimentOutput experimentOutput = null;
        if (experimentOutputList.size()>0) {
            // The outputs are ordered by the updatedat time, so we get the first file
            experimentOutput = experimentOutputList.get(0);
        }
        if (experimentOutput!=null && experimentOutput.getMetadataDetails()!=null && experimentOutput.getMetadataDetails().getDataRepositoryConfiguration()!=null) {
            // decrypt credentials
            String decryptedCredentials = pbeEncryption
                .decrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), experimentOutput.getMetadataDetails().getDataRepositoryConfiguration().getCredentials());

            JsonObject jsonObject = new JsonParser().parse(decryptedCredentials).getAsJsonObject();

            String fileName =  experimentOutput.getMetadataDetails().getName();

            S3ObjectInputStream s3ObjectInputStream = Utils.downloadFileFromCos(jsonObject.get("apikey").getAsString(),jsonObject.get("resource_instance_id").getAsString(),jsonObject.get("endpointUrl").getAsString()
                ,jsonObject.get("bucketName").getAsString(),jsonObject.get("bucketRegion").getAsString(),jsonObject.get("iamEndpoint").getAsString(),fileName);

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .cacheControl(CacheControl.noCache())
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .body(new InputStreamResource(s3ObjectInputStream));

        } else  // Handle where Experiment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Missing experiment metadata details or data repository configurations");

    }

    /**
     * get experiment output by experiment id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping (value = "/files/by.experiment.id/{experimentId}/{experimentOutputType}"  )
    @Operation(summary = "get experiment output by experiment id and experiment output type",
        tags = {"ExperimentOutput"},
        description = "get experiment output by experiment id and experiment output type",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getExperimentOutputByExperimentIdAndExperimentOutputType(
        @Parameter(description = "experiment output type", required = true)  @Valid @PathVariable("experimentOutputType") Constants.TASK_OUTPUTS_TYPES experimentOutputType,

        @Parameter(description = "experiment Id", required = true)  @Valid @PathVariable("experimentId") String experimentId) throws Exception {

        // get output by experiment id
        List<ExperimentOutput> experimentOutputList =  experimentOutputRepository.getByExperiment_IdAndAndTypeOrderByUpdatedAt(experimentId,experimentOutputType.toString());
        if (experimentOutputList!=null) {

            // Set ExperimentOutput as entity in response object
            return Response.ok().entity(experimentOutputList).build();

        } else  // Handle where Experiment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Missing experiment metadata details or data repository configurations");

    }
    /**
     * get experiment output by experiment id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping (value = "/file/by.output.id/{experimentOutputId}"  )
    @Operation(summary = "get experiment file output by experiment output id",
        tags = {"ExperimentOutput"},
        description = "get experiment file output by experiment output id",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public ResponseEntity<InputStreamResource> getExperimentOutputFileByExperimentOutputId(
        @Parameter(description = "experiment output Id", required = true)  @Valid @PathVariable("experimentOutputId") String experimentOutputId) throws Exception {

        // get output by experiment id
        List<ExperimentOutput> experimentOutputList =  experimentOutputRepository.getById(experimentOutputId);

        ExperimentOutput experimentOutput =null;
        if (experimentOutputList.size()>0) {
            // The outputs are ordered by the updatedat time, so we get the first file
            experimentOutput = experimentOutputList.get(0);
        }
        if (experimentOutput!=null && experimentOutput.getMetadataDetails()!=null && experimentOutput.getMetadataDetails().getDataRepositoryConfiguration()!=null) {
            // decrypt credentials
            String decryptedCredentials = pbeEncryption
                .decrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), experimentOutput.getMetadataDetails().getDataRepositoryConfiguration().getCredentials());

            JsonObject jsonObject = new JsonParser().parse(decryptedCredentials).getAsJsonObject();

            String fileName =  experimentOutput.getMetadataDetails().getName();

            S3ObjectInputStream s3ObjectInputStream = Utils.downloadFileFromCos(jsonObject.get("apikey").getAsString(),jsonObject.get("resource_instance_id").getAsString(),jsonObject.get("endpointUrl").getAsString()
                ,jsonObject.get("bucketName").getAsString(),jsonObject.get("bucketRegion").getAsString(),jsonObject.get("iamEndpoint").getAsString(),fileName);

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .cacheControl(CacheControl.noCache())
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .body(new InputStreamResource(s3ObjectInputStream));

        } else  // Handle where Experiment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Missing experiment metadata details or data repository configurations");

    }


    /**
     * update ExperimentOutput
     * @param experimentOutput
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{id}"  )
    @Operation(summary = "Update ExperimentOutput",
        tags = {"ExperimentOutput"},
        description = "Update ExperimentOutput",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of ExperimentOutput that needs to be updated", required = true)  @Valid @PathVariable("id") String id,
        @Parameter(description = "ExperimentOutput object to update",required = true) @Valid @RequestBody ExperimentOutput experimentOutput) throws Exception {

        // set ExperimentOutput
        experimentOutput.setId(id);

        // set audit details: created and updated at values
        experimentOutput.setAuditValues();

        // updated ExperimentOutput
        ExperimentOutput savedExperimentOutput = experimentOutputRepository.save(experimentOutput);

        // Check if the returned object is not null
        if (null != savedExperimentOutput) {

            // Set ExperimentOutput as entity in response object
            return Response.ok().entity(savedExperimentOutput).build();

        } else {
            // Handle where ExperimentOutput is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExperimentOutput not fod");
        }
    }

    /**
     * get experiment output by locationId and postExecutorId
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping (value = "/by.location.id.and.post.executor.id/{locationId}/{postExecutorId}"  )
    @Operation(summary = "get experiment output by locationId and postExecutorId",
        tags = {"ExperimentOutput"},
        description = "get experiment output by locationId and postExecutorId",
        responses = {
            @ApiResponse(description = "ExperimentOutput", content = @Content(schema = @Schema(implementation = ExperimentOutput.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getExperimentOutputByLocationIdAndPostExecutorId(
        @Parameter(description = "location id", required = true)  @Valid @PathVariable("locationId") String locationId,
        @Parameter(description = "post executor id", required = true)  @Valid @PathVariable("postExecutorId") String postExecutorId) throws Exception {

        // get experiment output by locationId and postExecutorId
        List<ExperimentOutput> experimentOutputList =  experimentOutputRepository.getByExperiment_ExperimentHash(Utils.getExperimentHash(locationId, postExecutorId));
        if (experimentOutputList!=null) {
            // Set ExperimentOutput as entity in response object
            return Response.ok().entity(experimentOutputList).build();

        } else  // Handle where ExperimentOutput is not available
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Missing experiment output");

    }
}
