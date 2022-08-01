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

import com.ibm.pmai.models.core.Feedback;
import com.ibm.pmai.models.repositories.FeedbackRepository;
import com.ibm.pmai.taskclerk.exceptions.ApiException;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * Feedback Controller is used to manage all the interactions needed to manager feedback as well do any related additions and updates
 */
@Hidden
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {


    /**
     * Feedback repository declaration
     */
    private FeedbackRepository feedbackRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    /**
     * Feedback controller
     * @param feedbackRepository
     */
    @Autowired
    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    /**
     * Returns Feedback
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find Feedback by Feedback id",
        tags = {"Feedback"},
        description = "Returns a Feedback ",
        responses = {
            @ApiResponse(description = "Feedback", content = @Content(schema = @Schema(implementation = Feedback.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a Feedback to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve Feedback by id
        Feedback feedback = feedbackRepository.getOne(id);

        // Check if the returned object is not null
        if (null != feedback) {

            // Set Feedback as entity in response object
            return Response.ok().entity(feedback).build();

        } else {
            // Handle where Feedback is not provided
            throw new ApiException(404, "Feedback not found");
        }
    }


    /**
     * Save Feedback
     * @param feedback
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save Feedback",
        tags = {"Feedback"},
        description = "Save Feedback",
        responses = {
            @ApiResponse(description = "Feedback", content = @Content(schema = @Schema(implementation = Feedback.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "Feedback object to be saved",required = true) @Valid @RequestBody Feedback feedback) throws Exception {


        // set audit details: created and updated at values
        feedback.setAuditValues();

        // save Feedback
        Feedback savedFeedback = feedbackRepository.save(feedback);

        // Check if the returned object is not null
        if (null != savedFeedback) {

            // Set Feedback as entity in response object
            return Response.ok().entity(savedFeedback).build();

        } else {
            // Handle where Feedback is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Feedback not fod");
        }
    }


    /**
     * update Feedback
     * @param feedback
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{feedbackId}"  )
    @Operation(summary = "Update Feedback",
        tags = {"Feedback"},
        description = "Update Feedback",
        responses = {
            @ApiResponse(description = "Feedback", content = @Content(schema = @Schema(implementation = Feedback.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of Feedback that needs to be updated", required = true)  @Valid @PathVariable("feedbackId") String feedbackId,
        @Parameter(description = "Feedback object to update",required = true) @Valid @RequestBody Feedback feedback) throws Exception {

        // set Feedback
        feedback.setId(feedbackId);

        // set audit details: created and updated at values
        feedback.setAuditValues();

        // updated Feedback
        Feedback savedFeedback = feedbackRepository.save(feedback);

        // Check if the returned object is not null
        if (null != savedFeedback) {

            // Set Feedback as entity in response object
            return Response.ok().entity(savedFeedback).build();

        } else {
            // Handle where Feedback is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Feedback not fod");
        }
    }

    /**
     * Returns all feedback:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all feedback",
        tags = {"Feedback"},
        description = "Returns all feedback ",
        responses = {
            @ApiResponse(description = "Feedback", content = @Content(schema = @Schema(implementation = Feedback.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all feedback
        List<Feedback> savedFeedback = feedbackRepository.findAll();

        // Check if the returned object is not null
        if (null != savedFeedback) {

            // Set Feedback as entity in response object
            return Response.ok().entity(savedFeedback).build();

        } else {
            // Handle where Feedback is not provided
            throw new ApiException(404, "Feedback not found");
        }
    }

}

