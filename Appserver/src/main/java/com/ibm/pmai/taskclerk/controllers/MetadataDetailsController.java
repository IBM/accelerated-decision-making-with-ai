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

import com.ibm.pmai.models.core.MetadataDetails;
import com.ibm.pmai.models.repositories.MetadataDetailsRepository;
import com.ibm.pmai.taskclerk.exceptions.ApiException;

import io.swagger.v3.oas.annotations.Hidden;
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
import java.util.Optional;


/**
 * MetadataDetails Controller is used to manage all the interactions needed to manager metadataDetailss as well do any related additions and updates
 */
@Hidden
@RestController
@RequestMapping("/api/metadataDetails")
public class MetadataDetailsController {


    /**
     * MetadataDetails repository declaration
     */
    private MetadataDetailsRepository metadataDetailsRepository;


    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(MetadataDetailsController.class);

    /**
     * metadataDetails controller
     * @param metadataDetailsRepository
     */
    @Autowired
    public MetadataDetailsController(MetadataDetailsRepository metadataDetailsRepository) {
        this.metadataDetailsRepository = metadataDetailsRepository;
    }

    /**
     * Returns metadataDetails
     * @param locationId
     * @param executorId
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{locationId}/{executorId}")
    @Operation(summary = "get metadataDetails by metadataDetails by locationid and executor id",
        tags = {"MetadataDetails"},
        description = "Returns list MetadataDetails ",
        responses = {
            @ApiResponse(description = "MetadataDetails", content = @Content(schema = @Schema(implementation = MetadataDetails.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getMetadataDetailsByLocationIdAndExecutorId(@Parameter(description = "locationId",required = true) @Valid @PathVariable String locationId,@Parameter(description = "executorId",required = true) @Valid @PathVariable String executorId) throws Exception {

        // Retrieve metadataDetails by id
        List<MetadataDetails> metadataDetails = metadataDetailsRepository.getByLocationIdAndExecutorId(locationId,executorId);

        // Check if the returned object is not null
        if (null != metadataDetails & metadataDetails.size()>0) {

            // Set metadataDetails as entity in response object
            return Response.ok().entity(metadataDetails).build();
        } else {
            // Handle where metadataDetails is not provided
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }

    /**
     * Returns metadataDetails
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}")
    @Operation(summary = "Find metadataDetails by metadataDetails id",
        tags = {"MetadataDetails"},
        description = "Returns a MetadataDetails ",
        responses = {
            @ApiResponse(description = "MetadataDetails", content = @Content(schema = @Schema(implementation = MetadataDetails.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a metadataDetails to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve metadataDetails by id
        Optional<MetadataDetails> metadataDetails = metadataDetailsRepository.findById(id);

        // Check if the returned object is not null
        if (null != metadataDetails & metadataDetails.isPresent()) {

            // Set metadataDetails as entity in response object
            return Response.ok().entity(metadataDetails.get()).build();
        } else {
            // Handle where metadataDetails is not provided
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


    /**
     * Save metadataDetails
     * @param metadataDetails
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping()
    @Operation(summary = "Save metadataDetails",
        tags = {"MetadataDetails"},
        description = "Save metadataDetails",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response saveMetadataDetails(  @RequestBody MetadataDetails metadataDetails ) throws Exception {


        // set audit details: created and updated at values
        metadataDetails.setAuditValues();


        // save metadataDetails
        MetadataDetails savedMetadataDetails= metadataDetailsRepository.save(metadataDetails);

        // Check if the returned object is not null
        if (null != savedMetadataDetails) {

            // Set metadataDetails as entity in response object
            return Response.ok().entity(savedMetadataDetails).build();

        } else {
            // Handle where metadataDetails is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


    /**
     * update metadataDetails
     * @param metadataDetails
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{metadataDetailsId}")
    @Operation(summary = "Update metadataDetails",
        tags = {"MetadataDetails"},
        description = "Update metadataDetails",
        responses = {
            @ApiResponse(description = "MetadataDetails", content = @Content(schema = @Schema(implementation = MetadataDetails.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response updateMetadataDetails(
        @Parameter(description = "Id of metadataDetails that needs to be updated", required = true)  @Valid @PathVariable("metadataDetailsId") String metadataDetailsId,
        @Parameter(description = "MetadataDetails object to update",required = true) @Valid @RequestBody MetadataDetails metadataDetails) throws Exception {

        // set metadataDetails id
        metadataDetails.setId(metadataDetailsId);


        // set audit details: created and updated at values
        metadataDetails.setAuditValues();

        // updated metadataDetails
        MetadataDetails updatedMetadataDetails = metadataDetailsRepository.save(metadataDetails);

        // Check if the returned object is not null
        if (null != updatedMetadataDetails) {

            // Set contect as entity in response object
            return Response.ok().entity(updatedMetadataDetails).build();

        } else {
            // Handle where metadataDetails is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }

    /**
     * Returns all metadataDetailss:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping( )
    @Operation(summary = "Returns all metadataDetailss",
        tags = {"MetadataDetails"},
        description = "Returns all metadataDetailss ",
        responses = {
            @ApiResponse(description = "MetadataDetails", content = @Content(schema = @Schema(implementation = MetadataDetails.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAllMetadataDetailss() throws Exception {

        // Retrieve all metadataDetailss
        List<MetadataDetails> metadataDetailsList = metadataDetailsRepository.findAll();

        // Check if the returned object is not null
        if (null != metadataDetailsList) {

            // Set content as entity in response object
            return Response.ok().entity(metadataDetailsList).build();

        } else {
            // Handle where metadataDetails is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }

}
