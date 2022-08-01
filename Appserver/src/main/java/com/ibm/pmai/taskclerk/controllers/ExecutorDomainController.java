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

import java.util.Date;
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

import com.ibm.pmai.models.core.ExecutorDomain;
import com.ibm.pmai.models.repositories.ExecutorDomainRepository;
import com.ibm.pmai.taskclerk.exceptions.ApiException;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

/**
 * ExecutorDomain Controller is used to manage all the interactions needed to manager executor domain as well do any related additions and updates
 */
@Hidden
@RestController
@RequestMapping("/api/executordomain")
public class ExecutorDomainController {
        /**
     * ExecutorDomain repository declaration
     */
    private ExecutorDomainRepository executorDomainRepository;

        /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ExecutorDomainController.class);


    /**
     * Executor controller
     * @param executorDomainRepository
     */
    @Autowired
    public ExecutorDomainController(ExecutorDomainRepository executorDomainRepository) {
        this.executorDomainRepository = executorDomainRepository;
    }

    /**
     * Returns ExecutorDomain
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}" )
    @Operation(summary = "Find ExecutorDomain by ExecutorDomain id",
        tags = {"ExecutorDomain"},
        description = "Returns an ExecutorDomain ",
        responses = {
            @ApiResponse(description = "ExecutorDomain", content = @Content(schema = @Schema(implementation = ExecutorDomain.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a ExecutorDomain to be retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve ExecutorDomain by id
        ExecutorDomain executorDomain = executorDomainRepository.getOne(id);

        // Check if the returned object is not null
        if (null != executorDomain) {

            // Set ExecutorDomain as entity in response object
            return Response.ok().entity(executorDomain).build();

        } else {
            // Handle where ExecutorDomain is not provided
            throw new ApiException(404, "ExecutorDomain not found");
        }
    }


    /**
     * Returns ExecutorDomain
     * @param name
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/domain/{domain}"  )
    @Operation(summary = "Find ExecutorDomain by ExecutorDomain domain name",
        tags = {"ExecutorDomain"},
        description = "Returns a ExecutorDomain given domain name ",
        responses = {
            @ApiResponse(description = "ExecutorDomain", content = @Content(schema = @Schema(implementation = ExecutorDomain.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getExecutorDomainByDomainName(@Parameter(description = "name of ExecutorDomain to be retrieved",required = true) @Valid @PathVariable String domain) throws Exception {

        // Retrieve ExecutorDomain by domain name
        ExecutorDomain executorDomain = executorDomainRepository.getByDomain(domain);


        // Check if the returned object is not null
        if (null != executorDomain) {
            // Set ExecutorDomain as entity in response object
            return Response.ok().entity(executorDomain).build();

        } else {
            // Handle where ExecutorDomain is not provided
            throw new ApiException(404, "ExecutorDomain not found");
        }
    }


    /**
     * Save ExecutorDomain
     * @param executorDomain
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping()
    @Operation(summary = "Save ExecutorDomain",
        tags = {"ExecutorDomain"},
        description = "Save ExecutorDomain",
        responses = {
            @ApiResponse(description = "ExecutorDomain", content = @Content(schema = @Schema(implementation = ExecutorDomain.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "ExecutorDomain object to be saved",required = true) @Valid @RequestBody ExecutorDomain executorDomain) throws Exception {

        // set audit details: created and updated at values
        executorDomain.setAuditValues();

        // save ExecutorDomain
        ExecutorDomain savedExecutorDomain = executorDomainRepository.save(executorDomain);

        // Check if the returned object is not null
        if (null != savedExecutorDomain) {

            // Set ExecutorDomain as entity in response object
            return Response.ok().entity(savedExecutorDomain).build();

        } else {
            // Handle where ExecutorDomain is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutorDomain not fod");
        }
    }


    /**
     * update ExecutorDomain
     * @param executorDomain
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{id}")
    @Operation(summary = "Update ExecutorDomain",
        tags = {"ExecutorDomain"},
        description = "Update ExecutorDomain",
        responses = {
            @ApiResponse(description = "ExecutorDomain", content = @Content(schema = @Schema(implementation = ExecutorDomain.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of ExecutorDomain that needs to be updated", required = true)  @Valid @PathVariable("id") String id,
        @Parameter(description = "ExecutorDomain object to update",required = true) @Valid @RequestBody ExecutorDomain executorDomain) throws Exception {

        // set ExecutorDomain
        executorDomain.setId(id);

        // set audit details: created and updated at values
        executorDomain.setUpdatedAt(new Date());

        // updated ExecutorDomain
        ExecutorDomain savedExecutorDomain = executorDomainRepository.save(executorDomain);

        // Check if the returned object is not null
        if (null != savedExecutorDomain) {

            // Set ExecutorDomain as entity in response object
            return Response.ok().entity(savedExecutorDomain).build();

        } else {
            // Handle where ExecutorDomain is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ExecutorDomain not fod");
        }
    }

    /**
     * Returns all executorDomain:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping( )
    @Operation(summary = "Returns all executorDomain",
        tags = {"ExecutorDomain"},
        description = "Returns all executorDomain ",
        responses = {
            @ApiResponse(description = "ExecutorDomain", content = @Content(schema = @Schema(implementation = ExecutorDomain.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all executorDomain
        List<ExecutorDomain> savedExecutorDomain = executorDomainRepository.findAll();

        // Check if the returned object is not null
        if (null != savedExecutorDomain) {

            // Set ExecutorDomain as entity in response object
            return Response.ok().entity(savedExecutorDomain).build();

        } else {
            // Handle where ExecutorDomain is not provided
            throw new ApiException(404, "ExecutorDomain not found");
        }
    }
}
