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

import com.ibm.pmai.models.core.ExecutionEnvironmentCommand;
import com.ibm.pmai.models.repositories.ExecutionEnvironmentCommandRepository;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
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
 * ExecutionEnvironmentCommand Controller is used to manage all the interactions needed to manager executionenvironmentcommand as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/executionenvironmentcommand")
public class ExecutionEnvironmentCommandController {


    /**
     * ExecutionEnvironmentCommand repository declaration
     */
    private ExecutionEnvironmentCommandRepository executionEnvironmentCommandRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ExecutionEnvironmentCommandController.class);

    /**
     * ExecutionEnvironmentCommand controller
     * @param executionEnvironmentCommandRepository
     */
    @Autowired
    public ExecutionEnvironmentCommandController(ExecutionEnvironmentCommandRepository executionEnvironmentCommandRepository) {
        this.executionEnvironmentCommandRepository = executionEnvironmentCommandRepository;
    }

    /**
     * Returns ExecutionEnvironmentCommand
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"   )
    @Operation(summary = "Find ExecutionEnvironmentCommand by ExecutionEnvironmentCommand id",
        tags = {"ExecutionEnvironmentCommand"},
        description = "Returns a ExecutionEnvironmentCommand ",
        responses = {
            @ApiResponse(description = "ExecutionEnvironmentCommand", content = @Content(schema = @Schema(implementation = ExecutionEnvironmentCommand.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a ExecutionEnvironmentCommand to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve ExecutionEnvironmentCommand by id
        ExecutionEnvironmentCommand executionEnvironmentCommand = executionEnvironmentCommandRepository.getOne(id);

        // Check if the returned object is not null
        if (null != executionEnvironmentCommand) {

            // Set ExecutionEnvironmentCommand as entity in response object
            return Response.ok().entity(executionEnvironmentCommand).build();

        } else {
            // Handle where ExecutionEnvironmentCommand is not provided
            throw new ApiException(404, "ExecutionEnvironmentCommand not found");
        }
    }


    /**
     * Save ExecutionEnvironmentCommand
     * @param executionEnvironmentCommand
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save ExecutionEnvironmentCommand",
        tags = {"ExecutionEnvironmentCommand"},
        description = "Save ExecutionEnvironmentCommand",
        responses = {
            @ApiResponse(description = "ExecutionEnvironmentCommand", content = @Content(schema = @Schema(implementation = ExecutionEnvironmentCommand.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "ExecutionEnvironmentCommand object to be saved",required = true) @Valid @RequestBody ExecutionEnvironmentCommand executionEnvironmentCommand) throws Exception {

        // set audit details: created and updated at values
        executionEnvironmentCommand.setAuditValues();


        // save ExecutionEnvironmentCommand
        ExecutionEnvironmentCommand savedExecutionEnvironment = executionEnvironmentCommandRepository.save(executionEnvironmentCommand);

        // Check if the returned object is not null
        if (null != savedExecutionEnvironment) {

            // Set ExecutionEnvironmentCommand as entity in response object
            return Response.ok().entity(savedExecutionEnvironment).build();

        } else {
            // Handle where ExecutionEnvironmentCommand is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutionEnvironmentCommand not fod");
        }
    }


    /**
     * update ExecutionEnvironmentCommand
     * @param executionEnvironmentCommand
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{executionEnvironmentId}"  )
    @Operation(summary = "Update ExecutionEnvironmentCommand",
        tags = {"ExecutionEnvironmentCommand"},
        description = "Update ExecutionEnvironmentCommand",
        responses = {
            @ApiResponse(description = "ExecutionEnvironmentCommand", content = @Content(schema = @Schema(implementation = ExecutionEnvironmentCommand.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(
        @Parameter(description = "ID of ExecutionEnvironmentCommand that needs to be updated", required = true)  @Valid @PathVariable("executionEnvironmentId") String executionEnvironmentId,
        @Parameter(description = "ExecutionEnvironmentCommand object to update",required = true) @Valid @RequestBody ExecutionEnvironmentCommand executionEnvironmentCommand) throws Exception {

        // set ExecutionEnvironmentCommand
        executionEnvironmentCommand.setId(executionEnvironmentId);

        // set updated ata
        executionEnvironmentCommand.setUpdatedAt(new Date());

        // updated ExecutionEnvironmentCommand
        ExecutionEnvironmentCommand dataLakeConfigurationSaved = executionEnvironmentCommandRepository.save(executionEnvironmentCommand);

        // Check if the returned object is not null
        if (null != dataLakeConfigurationSaved) {

            // Set ExecutionEnvironmentCommand as entity in response object
            return Response.ok().entity(dataLakeConfigurationSaved).build();

        } else {
            // Handle where ExecutionEnvironmentCommand is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutionEnvironmentCommand not fod");
        }
    }

    /**
     * Returns all executionenvironmentcommand:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all executionenvironmentcommand",
        tags = {"ExecutionEnvironmentCommand"},
        description = "Returns all executionenvironmentcommand ",
        responses = {
            @ApiResponse(description = "ExecutionEnvironmentCommand", content = @Content(schema = @Schema(implementation = ExecutionEnvironmentCommand.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all executionenvironmentcommand
        List<ExecutionEnvironmentCommand> executionEnvironmentCommands = executionEnvironmentCommandRepository.findAll();

        // Check if the returned object is not null
        if (null != executionEnvironmentCommands) {

            // Set ExecutionEnvironmentCommand as entity in response object
            return Response.ok().entity(executionEnvironmentCommands).build();

        } else {
            // Handle where ExecutionEnvironmentCommand is not provided
            throw new ApiException(404, "ExecutionEnvironmentCommand not found");
        }
    }

}

