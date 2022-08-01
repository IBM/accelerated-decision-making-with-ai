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
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ibm.pmai.models.core.ResultsRequest;
import com.ibm.pmai.models.repositories.ResultsRequestRepository;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.utils.Utils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

/**
 * ResultsRequest Controller is used to manage all the interactions needed to manager resultsrequest as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/resultsrequest")
public class ResultsRequestController {


    @Autowired
    @Qualifier("myJobLauncher")
    private JobLauncher jobLauncher;

    @Autowired
    private Job fetchTaskExecutionResult;

    /**
     * ResultsRequest repository declaration
     */
    private ResultsRequestRepository resultsRequestRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ResultsRequestController.class);

    /**
     * ResultsRequest controller
     * @param resultsRequestRepository
     */
    @Autowired
    public ResultsRequestController(ResultsRequestRepository resultsRequestRepository) {
        this.resultsRequestRepository = resultsRequestRepository;
    }

    /**
     * Returns ResultsRequest
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"   )
    @Operation(summary = "Find ResultsRequest by ResultsRequest id",
        tags = {"ResultsRequest"},
        description = "Returns a ResultsRequest ",
        responses = {
            @ApiResponse(description = "ResultsRequest", content = @Content(schema = @Schema(implementation = ResultsRequest.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a ResultsRequest to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve ResultsRequest by id
        ResultsRequest resultsrequest = resultsRequestRepository.getOne(id);

        // Check if the returned object is not null
        if (null != resultsrequest) {

            // Set ResultsRequest as entity in response object
            return Response.ok().entity(resultsrequest).build();

        } else {
            // Handle where ResultsRequest is not provided
            throw new ApiException(404, "ResultsRequest not found");
        }
    }


    /**
     * Returns ResultsRequest
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/status/{id}"   )
    @Operation(summary = "Find ResultsRequest by ResultsRequest id",
        tags = {"ResultsRequest"},
        description = "Returns a ResultsRequest ",
        responses = {
            @ApiResponse(description = "ResultsRequest", content = @Content(schema = @Schema(implementation = ResultsRequest.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response checkRequestStatus(@Parameter(description = "id of a ResultsRequest to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve ResultsRequest by id
        ResultsRequest resultsrequest = resultsRequestRepository.getOne(id);

        // Check if the returned object is not null
        if (null != resultsrequest) {

            // Set ResultsRequest as entity in response object
            return Response.ok().entity(resultsrequest).build();

        } else {
            // Handle where ResultsRequest is not provided
            throw new ApiException(404, "ResultsRequest not found");
        }
    }


    /**
     * Save ResultsRequest
     * @param resultsrequest
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save ResultsRequest",
        tags = {"ResultsRequest"},
        description = "Save ResultsRequest",
        responses = {
            @ApiResponse(description = "ResultsRequest", content = @Content(schema = @Schema(implementation = ResultsRequest.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "ResultsRequest object to be saved",required = true) @Valid @RequestBody ResultsRequest resultsrequest) throws Exception {

        // set audit details: created and updated at values
        resultsrequest.setAuditValues();

        resultsrequest.setStatus(false);

        resultsrequest.setTimeCreated(Utils.getDateTime(new Date()));

        // save ResultsRequest
        ResultsRequest savedResultsRequest = resultsRequestRepository.save(resultsrequest);

        // Check if the returned object is not null
        if (null != savedResultsRequest) {
            runResultsRequest(savedResultsRequest.getId());

            // Set ResultsRequest as entity in response object
            return Response.ok().entity(savedResultsRequest).build();

        } else {
            // Handle where ResultsRequest is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ResultsRequest not fod");
        }
    }

    @Async
    public void runResultsRequest(String resultRequestId){
        JobParameters jobParameters = new JobParametersBuilder()
            .addString("resultRequestId",resultRequestId).addLong("epoch", System.currentTimeMillis())
            .toJobParameters();
        try {
            jobLauncher.run(fetchTaskExecutionResult, jobParameters);
        } catch (JobExecutionAlreadyRunningException e) {
            e.printStackTrace();
        } catch (JobRestartException e) {
            e.printStackTrace();
        } catch (JobInstanceAlreadyCompleteException e) {
            e.printStackTrace();
        } catch (JobParametersInvalidException e) {
            e.printStackTrace();
        }
    }

    /**
     * update ResultsRequest
     * @param resultsrequest
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{id}"  )
    @Operation(summary = "Update ResultsRequest",
        tags = {"ResultsRequest"},
        description = "Update ResultsRequest",
        responses = {
            @ApiResponse(description = "ResultsRequest", content = @Content(schema = @Schema(implementation = ResultsRequest.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of ResultsRequest that needs to be updated", required = true)  @Valid @PathVariable("id") String id,
        @Parameter(description = "ResultsRequest object to update",required = true) @Valid @RequestBody ResultsRequest resultsrequest) throws Exception {

        // set ResultsRequest
        resultsrequest.setId(id);

        // set audit details: created and updated at values
        resultsrequest.setAuditValues();

        // updated ResultsRequest
        ResultsRequest savedResultsRequest = resultsRequestRepository.save(resultsrequest);

        // Check if the returned object is not null
        if (null != savedResultsRequest) {

            // Set ResultsRequest as entity in response object
            return Response.ok().entity(savedResultsRequest).build();

        } else {
            // Handle where ResultsRequest is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "ResultsRequest not fod");
        }
    }

    /**
     * Returns all resultsrequest:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all resultsrequest",
        tags = {"ResultsRequest"},
        description = "Returns all resultsrequest ",
        responses = {
            @ApiResponse(description = "ResultsRequest", content = @Content(schema = @Schema(implementation = ResultsRequest.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all resultsrequest
        List<ResultsRequest> savedResultsRequest = resultsRequestRepository.findAll();

        // Check if the returned object is not null
        if (null != savedResultsRequest) {

            // Set ResultsRequest as entity in response object
            return Response.ok().entity(savedResultsRequest).build();

        } else {
            // Handle where ResultsRequest is not provided
            throw new ApiException(404, "ResultsRequest not found");
        }
    }

}

