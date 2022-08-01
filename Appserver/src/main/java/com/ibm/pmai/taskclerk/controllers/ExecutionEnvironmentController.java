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

import com.ibm.pmai.models.core.ExecutionEnvironment;
import com.ibm.pmai.models.repositories.ExecutionEnvironmentRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.utils.PBEEncryption;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.ws.rs.core.Response;
import java.util.Date;
import java.util.List;


/**
 * ExecutionEnvironment Controller is used to manage all the interactions needed to manager executionenvironment as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/executionenvironment")
public class ExecutionEnvironmentController {


    /**
     * ExecutionEnvironment repository declaration
     */
    private ExecutionEnvironmentRepository executionEnvironmentRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ExecutionEnvironmentController.class);


    /**
     * Encryption key
     */
    private PBEEncryption pbeEncryption;


    /**
     * Application configurations to access property values
     */
    private ApplicationConfigurations applicationConfigurations;

    /**
     * ExecutionEnvironment controller
     * @param executionEnvironmentRepository
     */
    @Autowired
    public ExecutionEnvironmentController(ExecutionEnvironmentRepository executionEnvironmentRepository,PBEEncryption pbeEncryption,ApplicationConfigurations applicationConfigurations) {
        this.executionEnvironmentRepository = executionEnvironmentRepository;
        this.pbeEncryption =pbeEncryption;
        this.applicationConfigurations = applicationConfigurations;
    }

    /**
     * Returns ExecutionEnvironment
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"   )
    @Operation(summary = "Find ExecutionEnvironment by ExecutionEnvironment id",
        tags = {"ExecutionEnvironment"},
        description = "Returns a ExecutionEnvironment ",
        responses = {
            @ApiResponse(description = "ExecutionEnvironment", content = @Content(schema = @Schema(implementation = ExecutionEnvironment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a ExecutionEnvironment to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve ExecutionEnvironment by id
        ExecutionEnvironment executionEnvironment = executionEnvironmentRepository.getOne(id);

        // Check if the returned object is not null
        if (null != executionEnvironment) {

            // Set ExecutionEnvironment as entity in response object
            return Response.ok().entity(executionEnvironment).build();

        } else {
            // Handle where ExecutionEnvironment is not provided
            throw new ApiException(404, "ExecutionEnvironment not found");
        }
    }


    /**
     * Save ExecutionEnvironment
     * @param executionEnvironment
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save ExecutionEnvironment",
        tags = {"ExecutionEnvironment"},
        description = "Save ExecutionEnvironment",
        responses = {
            @ApiResponse(description = "ExecutionEnvironment", content = @Content(schema = @Schema(implementation = ExecutionEnvironment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "ExecutionEnvironment object to be saved",required = true) @Valid @RequestBody ExecutionEnvironment executionEnvironment) throws Exception {

        if (executionEnvironment.getHostPassword() != null) {
            // encrypt the password
            String encryptedPassword = pbeEncryption
                    .encrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), executionEnvironment.getHostPassword().getBytes());

            // set the value back
            executionEnvironment.setHostPassword(encryptedPassword);
        }

        // set audit details: created and updated at values
        executionEnvironment.setAuditValues();

        // save ExecutionEnvironment
        ExecutionEnvironment savedExecutionEnvironment = executionEnvironmentRepository.save(executionEnvironment);

        // Check if the returned object is not null
        if (null != savedExecutionEnvironment) {

            // Set ExecutionEnvironment as entity in response object
            return Response.ok().entity(savedExecutionEnvironment).build();

        } else {
            // Handle where ExecutionEnvironment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutionEnvironment not fod");
        }
    }


    /**
     * update ExecutionEnvironment
     * @param executionEnvironment
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{executionEnvironmentId}"  )
    @Operation(summary = "Update ExecutionEnvironment",
        tags = {"ExecutionEnvironment"},
        description = "Update ExecutionEnvironment",
        responses = {
            @ApiResponse(description = "ExecutionEnvironment", content = @Content(schema = @Schema(implementation = ExecutionEnvironment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(
        @Parameter(description = "ID of ExecutionEnvironment that needs to be updated", required = true)  @Valid @PathVariable("executionEnvironmentId") String executionEnvironmentId,
        @Parameter(description = "ExecutionEnvironment object to update",required = true) @Valid @RequestBody ExecutionEnvironment executionEnvironment) throws Exception {

        // set ExecutionEnvironment
        executionEnvironment.setId(executionEnvironmentId);

        // set updated ata
        executionEnvironment.setUpdatedAt(new Date());

        // updated ExecutionEnvironment
        ExecutionEnvironment executionEnvironmentSaved = executionEnvironmentRepository.save(executionEnvironment);

        // Check if the returned object is not null
        if (null != executionEnvironmentSaved) {

            // Set ExecutionEnvironment as entity in response object
            return Response.ok().entity(executionEnvironmentSaved).build();

        } else {
            // Handle where ExecutionEnvironment is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutionEnvironment not fod");
        }
    }

    /**
     * Returns all executionenvironment:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all executionenvironment",
        tags = {"ExecutionEnvironment"},
        description = "Returns all executionenvironment ",
        responses = {
            @ApiResponse(description = "ExecutionEnvironment", content = @Content(schema = @Schema(implementation = ExecutionEnvironment.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all executionenvironment
        List<ExecutionEnvironment> executionenvironments = executionEnvironmentRepository.findAll();

        // Check if the returned object is not null
        if (null != executionenvironments) {

            // Set ExecutionEnvironment as entity in response object
            return Response.ok().entity(executionenvironments).build();

        } else {
            // Handle where ExecutionEnvironment is not provided
            throw new ApiException(404, "ExecutionEnvironment not found");
        }
    }

}

