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

import com.ibm.pmai.models.core.Algorithm;
import com.ibm.pmai.models.repositories.AlgorithmsRepository;
import com.ibm.pmai.taskclerk.exceptions.ApiException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * @author charleswachira on 19/05/2019
 * @project trustmodels
 **/
@RestController
@RequestMapping("/api/algorithms")
public class AlgorithmsController {
    private static final Logger logger = LoggerFactory.getLogger(AlgorithmsController.class);

    private final AlgorithmsRepository algorithmsRepository;

    @Autowired
    public AlgorithmsController(AlgorithmsRepository algorithmsRepository) {
        this.algorithmsRepository = algorithmsRepository;
    }

    /**
     * Returns Algorithm
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}" )
    @Operation(summary = "Find Algorithm by Algorithm id",
        tags = {"Algorithm"},
        description = "Returns a Algorithm ",
        responses = {
            @ApiResponse(description = "Algorithm", content = @Content(schema = @Schema(implementation = Algorithm.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a Algorithm to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve Algorithm by id
        Algorithm algorithm = algorithmsRepository.getOne(id);

        // Check if the returned object is not null
        if (null != algorithm) {

            // Set Algorithm as entity in response object
            return Response.ok().entity(algorithm).build();

        } else {
            // Handle where Algorithm is not provided
            throw new ApiException(404, "Algorithm not found");
        }
    }

     /**
     * Save Algorithm
     *
     * @param algorithm
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(value = "")
    @Operation(summary = "Save Algorithm",
        tags = {"Algorithm"},
        description = "Save Algorithm",
        responses = {
            @ApiResponse(description = "Algorithm", content = @Content(schema = @Schema(implementation = Algorithm.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "Algorithm object to be saved", required = true) @Valid @RequestBody Algorithm algorithm) throws Exception {

        // set audit details: created and updated at values
        algorithm.setAuditValues();

        // save the algorithm
        Algorithm savedAlgorithm = algorithmsRepository.save(algorithm);
        if (savedAlgorithm == null) {
            // Handle where Algorithm is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Algorithm not saved");
        }

        // Set Algorithm as entity in response object
        return Response.status(201).entity(savedAlgorithm).build();
    }


    /**
     * update Algorithm
     *
     * @param algorithm
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping(value = "/{id}")
    @Operation(summary = "Update Algorithm",
        tags = {"Algorithm"},
        description = "Update Algorithm",
        responses = {
            @ApiResponse(description = "Algorithm", content = @Content(schema = @Schema(implementation = Algorithm.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of Algorithm that needs to be updated", required = true) @Valid @PathVariable("id") String id,
        @Parameter(description = "Algorithm object to update", required = true) @Valid @RequestBody Algorithm algorithm) throws Exception {

        // set Algorithm
        algorithm.setId(id);

        // set audit details: created and updated at values
        algorithm.setUpdatedAt(new Date());

        // updated Algorithm
        Algorithm savedAlgorithm = algorithmsRepository.save(algorithm);

        // Check if the returned object is not null
        if (null != savedAlgorithm) {

            // Set Algorithm as entity in response object
            return Response.ok().entity(savedAlgorithm).build();

        } else {
            // Handle where Algorithm is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Algorithm not fod");
        }
    }

    /**
     * Returns all algorithm
     *
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping()
    @Operation(summary = "Returns all algorithm",
        tags = {"Algorithm"},
        description = "Returns all algorithm ",
        responses = {
            @ApiResponse(description = "Algorithm", content = @Content(schema = @Schema(implementation = Algorithm.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all algorithm
        List<Algorithm> savedAlgorithm = algorithmsRepository.findAll();

        // Check if the returned object is not null
        if (null != savedAlgorithm) {

            // Set Algorithm as entity in response object
            return Response.ok().entity(savedAlgorithm).build();

        } else {
            // Handle where Algorithm is not provided
            throw new ApiException(404, "Algorithm not found");
        }
    }
}
