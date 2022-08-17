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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ibm.pmai.models.core.DataPush;
import com.ibm.pmai.models.repositories.DataPushRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.utils.PBEEncryption;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * DataPush Controller is used to manage all the interactions needed to manage dataPush as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/dataPush")
public class DataPushController {

    /**
     * DataPush repository declaration
     */
    private DataPushRepository dataPushRepository;

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
    private static final Logger logger = LoggerFactory.getLogger(DataPushController.class);

    /**
     * DataPush controller
     * @param dataPushRepository
     */
    @Autowired
    public DataPushController(DataPushRepository dataPushRepository,PBEEncryption pbeEncryption,ApplicationConfigurations applicationConfigurations) {
        this.dataPushRepository = dataPushRepository;
        this.pbeEncryption =pbeEncryption;
        this.applicationConfigurations = applicationConfigurations;
    }

    /**
     * Returns DataPush
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find DataPush by id",
        tags = {"DataPush"},
        description = "Returns an DataPush ",
        responses = {
            @ApiResponse(description = "DataPush", content = @Content(schema = @Schema(implementation = DataPush.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a DataPush to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve DataPush by id
         Optional<DataPush> optionalDataPush = dataPushRepository.findById(id);

        // Check if the returned object is not null
        if (null != optionalDataPush  && optionalDataPush.isPresent())  {
            DataPush dataPush = optionalDataPush.get();

            // Set DataPush as entity in response object
            return Response.ok().entity(dataPush).build();

        } else {
            // Handle where DataPush is not provided
            throw new ApiException(404, "DataPush not found");
        }
    }


    /**
     * Save DataPush
     * @param hash
     * @param DataPush
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save DataPush",
        tags = {"DataPush"},
        description = "Save DataPush",
        responses = {
            @ApiResponse(description = "DataPush", content = @Content(schema = @Schema(implementation = DataPush.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "DataPush object to be saved",required = true) @Valid @RequestBody DataPush dataPush) throws Exception {


            // set audit details: created and updated at values
            dataPush.setAuditValues();
            dataPush.getMetadataDetails().setAuditValues();
    
            // check if we have that file added
            // Retrieve DataPush by hash
            DataPush dataPush1 = dataPushRepository.getByHash(dataPush.getHash());
            if (dataPush1==null){
                // save DataPush
                DataPush savedDataPush = dataPushRepository.save(dataPush);
    
                // Check if the returned object is not null
                if (null != savedDataPush) {
    
                    // Set DataPush as entity in response object
                    return Response.ok().entity(savedDataPush).build();
    
                } else {
                    // Handle where DataPush is not save - most probably due to bad request
                    throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "DataPush not found");
                }
            } else {
                // File already saved
                return Response.ok().entity(dataPush1).build();
            }
        }


    /**
     * Returns all dataPush:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all dataPush",
        tags = {"DataPush"},
        description = "Returns all dataPush ",
        responses = {
            @ApiResponse(description = "DataPush", content = @Content(schema = @Schema(implementation = DataPush.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all dataPush
        List<DataPush> savedDataPush = dataPushRepository.findAll();

        // Check if the returned object is not null
        if (null != savedDataPush) {

            // Set DataPush as entity in response object
            return Response.ok().entity(savedDataPush).build();

        } else {
            // Handle where DataPush is not provided
            throw new ApiException(404, "DataPush not found");
        }
    }

  
    /**
     * update DataPush
     * @param dataPush
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{id}"  )
    @Operation(summary = "Update DataPush",
        tags = {"DataPush"},
        description = "Update DataPush",
        responses = {
            @ApiResponse(description = "DataPush", content = @Content(schema = @Schema(implementation = DataPush.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of DataPush that needs to be updated", required = true)  @Valid @PathVariable("id") String id,
        @Parameter(description = "DataPush object to update",required = true) @Valid @RequestBody DataPush dataPush) throws Exception {

        // set DataPush
        dataPush.setId(id);

        // set audit details: created and updated at values
        dataPush.setAuditValues();

        // updated DataPush
        DataPush savedDataPush = dataPushRepository.save(dataPush);

        // Check if the returned object is not null
        if (null != savedDataPush) {

            // Set DataPush as entity in response object
            return Response.ok().entity(savedDataPush).build();

        } else {
            // Handle where DataPush is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "DataPush not found");
        }
    }
}
