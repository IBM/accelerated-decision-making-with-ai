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

import com.ibm.pmai.models.core.Notification;
import com.ibm.pmai.models.repositories.NotificationRepository;
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


/**
 * Notification Controller is used to manage all the interactions needed to manager notification as well do any related additions and updates
 */
@Hidden
@RestController
@RequestMapping("/api/notification")
public class NotificationController {


    /**
     * Notification repository declaration
     */
    private NotificationRepository notificationRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    /**
     * Notification controller
     * @param notificationRepository
     */
    @Autowired
    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Returns Notification
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find Notification by Notification id",
        tags = {"Notification"},
        description = "Returns a Notification ",
        responses = {
            @ApiResponse(description = "Notification", content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a Notification to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve Notification by id
        Notification notification = notificationRepository.getOne(id);

        // Check if the returned object is not null
        if (null != notification) {

            // Set Notification as entity in response object
            return Response.ok().entity(notification).build();

        } else {
            // Handle where Notification is not provided
            throw new ApiException(404, "Notification not found");
        }
    }


    /**
     * Save Notification
     * @param notification
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save Notification",
        tags = {"Notification"},
        description = "Save Notification",
        responses = {
            @ApiResponse(description = "Notification", content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "Notification object to be saved",required = true) @Valid @RequestBody Notification notification) throws Exception {

        // set audit details: created and updated at values
        notification.setAuditValues();


        // save Notification
        Notification savedNotification = notificationRepository.save(notification);

        // Check if the returned object is not null
        if (null != savedNotification) {

            // Set Notification as entity in response object
            return Response.ok().entity(savedNotification).build();

        } else {
            // Handle where Notification is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Notification not fod");
        }
    }


    /**
     * update Notification
     * @param notification
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{notificationId}"  )
    @Operation(summary = "Update Notification",
        tags = {"Notification"},
        description = "Update Notification",
        responses = {
            @ApiResponse(description = "Notification", content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of Notification that needs to be updated", required = true)  @Valid @PathVariable("notificationId") String notificationId,
        @Parameter(description = "Notification object to update",required = true) @Valid @RequestBody Notification notification) throws Exception {

        // set Notification
        notification.setId(notificationId);

        // set audit details: created and updated at values
        notification.setAuditValues();

        // updated Notification
        Notification savedNotification = notificationRepository.save(notification);

        // Check if the returned object is not null
        if (null != savedNotification) {

            // Set Notification as entity in response object
            return Response.ok().entity(savedNotification).build();

        } else {
            // Handle where Notification is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Notification not fod");
        }
    }

    /**
     * Returns all notification:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all notification",
        tags = {"Notification"},
        description = "Returns all notification ",
        responses = {
            @ApiResponse(description = "Notification", content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all notification
        List<Notification> savedNotification = notificationRepository.findAll();

        // Check if the returned object is not null
        if (null != savedNotification) {

            // Set Notification as entity in response object
            return Response.ok().entity(savedNotification).build();

        } else {
            // Handle where Notification is not provided
            throw new ApiException(404, "Notification not found");
        }
    }

}

