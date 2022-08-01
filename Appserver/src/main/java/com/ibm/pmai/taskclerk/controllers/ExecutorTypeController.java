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

import com.ibm.pmai.models.core.ExecutorType;
import com.ibm.pmai.models.repositories.ExecutorTypeRepository;
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
import java.util.List;


/**
 * ExecutorType Controller is used to manage all the interactions needed to manager executorType as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/executorType")
public class ExecutorTypeController {


    /**
     * ExecutorType repository declaration
     */
    private ExecutorTypeRepository executorTypeRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ExecutorTypeController.class);

    /**
     * ExecutorType controller
     * @param executorTypeRepository
     */
    @Autowired
    public ExecutorTypeController(ExecutorTypeRepository executorTypeRepository) {
        this.executorTypeRepository = executorTypeRepository;
    }

    /**
     * Returns ExecutorType
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find ExecutorType by ExecutorType id",
        tags = {"ExecutorType"},
        description = "Returns a ExecutorType ",
        responses = {
            @ApiResponse(description = "ExecutorType", content = @Content(schema = @Schema(implementation = ExecutorType.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a ExecutorType to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve ExecutorType by id
        ExecutorType executorType = executorTypeRepository.getOne(id);

        // Check if the returned object is not null
        if (null != executorType) {

            // Set ExecutorType as entity in response object
            return Response.ok().entity(executorType).build();

        } else {
            // Handle where ExecutorType is not provided
            throw new ApiException(404, "ExecutorType not found");
        }
    }


    /**
     * Save ExecutorType
     * @param executorType
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save ExecutorType",
        tags = {"ExecutorType"},
        description = "Save ExecutorType",
        responses = {
            @ApiResponse(description = "ExecutorType", content = @Content(schema = @Schema(implementation = ExecutorType.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "ExecutorType object to be saved",required = true) @Valid @RequestBody ExecutorType executorType) throws Exception {


        // set audit details: created and updated at values
        executorType.setAuditValues();


        // save ExecutorType
        ExecutorType savedExecutorType = executorTypeRepository.save(executorType);

        // Check if the returned object is not null
        if (null != savedExecutorType) {

            // Set ExecutorType as entity in response object
            return Response.ok().entity(savedExecutorType).build();

        } else {
            // Handle where ExecutorType is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutorType not fod");
        }
    }


    /**
     * update ExecutorType
     * @param executorType
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{executorTypeId}"  )
    @Operation(summary = "Update ExecutorType",
        tags = {"ExecutorType"},
        description = "Update ExecutorType",
        responses = {
            @ApiResponse(description = "ExecutorType", content = @Content(schema = @Schema(implementation = ExecutorType.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of ExecutorType that needs to be updated", required = true)  @Valid @PathVariable("executorTypeId") String executorTypeId,
        @Parameter(description = "ExecutorType object to update",required = true) @Valid @RequestBody ExecutorType executorType) throws Exception {

        // set ExecutorType
        executorType.setId(executorTypeId);


        // set audit details: created and updated at values
        executorType.setAuditValues();

        // updated ExecutorType
        ExecutorType executorTypeSaved = executorTypeRepository.save(executorType);

        // Check if the returned object is not null
        if (null != executorTypeSaved) {

            // Set ExecutorType as entity in response object
            return Response.ok().entity(executorTypeSaved).build();

        } else {
            // Handle where ExecutorType is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutorType not fod");
        }
    }

    /**
     * Returns all executorType:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all executorType",
        tags = {"ExecutorType"},
        description = "Returns all executorType ",
        responses = {
            @ApiResponse(description = "ExecutorType", content = @Content(schema = @Schema(implementation = ExecutorType.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all executorType
        List<ExecutorType> executors = executorTypeRepository.findAll();

        // Check if the returned object is not null
        if (null != executors) {

            // Set ExecutorType as entity in response object
            return Response.ok().entity(executors).build();

        } else {
            // Handle where ExecutorType is not provided
            throw new ApiException(404, "ExecutorType not found");
        }
    }

}

