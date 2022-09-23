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

import com.ibm.pmai.models.core.DataRepositoryConfiguration;
import com.ibm.pmai.models.repositories.DataRepositoryConfigurationRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.utils.PBEEncryption;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * DataRepositoryConfigurations Controller is used to manage all the interactions needed to manager dataRepositoryconfigurations as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/dataRepositoryconfigurations")
public class DataRepositoryConfigurationsController {


    /**
     * Encryption key
     */
    private PBEEncryption pbeEncryption;


    /**
     * Application configurations to access property values
     */
    private ApplicationConfigurations applicationConfigurations;


    /**
     * DataRepositoryConfigurations repository declaration
     */
    private DataRepositoryConfigurationRepository dataRepositoryConfigurationRepository ;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(DataRepositoryConfigurationsController.class);

    /**
     * DataRepositoryConfigurationRepository controller
     * @param dataRepositoryConfigurationRepository
     */
    @Autowired
    public DataRepositoryConfigurationsController(DataRepositoryConfigurationRepository dataRepositoryConfigurationRepository,PBEEncryption pbeEncryption,ApplicationConfigurations applicationConfigurations) {
        this.dataRepositoryConfigurationRepository = dataRepositoryConfigurationRepository;
        this.pbeEncryption =pbeEncryption;
        this.applicationConfigurations = applicationConfigurations;
    }

    /**
     * Returns DataRepositoryConfigurationRepository
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find DataRepositoryConfigurationRepository by DataRepositoryConfigurationRepository id",
        tags = {"DataRepositoryConfigurations"},
        description = "Returns a DataRepositoryConfigurationRepository ",
        responses = {
            @ApiResponse(description = "DataRepositoryConfigurations", content = @Content(schema = @Schema(implementation = DataRepositoryConfiguration.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a DataRepositoryConfigurationRepository to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve DataRepositoryConfiguration by id
        DataRepositoryConfiguration dataRepositoryConfigurationRepositoryObject = dataRepositoryConfigurationRepository.getOne(id);

        // Check if the returned object is not null
        if (null != dataRepositoryConfigurationRepositoryObject) {

            // Set DataRepositoryConfigurationRepository as entity in response object
            return Response.ok().entity(dataRepositoryConfigurationRepositoryObject).build();

        } else {
            // Handle where DataRepositoryConfigurationRepository is not provided
            throw new ApiException(404, "DataRepositoryConfigurations not found");
        }
    }


    /**
     * Returns DataRepositoryConfigurationRepository
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @Hidden
    @GetMapping(value = "/credentials.id/{id}"  )
    @Operation(hidden = true,summary = "Find DataRepositoryConfigurationRepository by DataRepositoryConfigurationRepository id",
        tags = {"DataRepositoryConfigurations"},
        description = "Returns a DataRepositoryConfigurationRepository ",
        responses = {
            @ApiResponse(description = "DataRepositoryConfigurations", content = @Content(schema = @Schema(implementation = DataRepositoryConfiguration.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getCredentialsById(@Parameter(description = "id of DataRepositoryConfigurationRepository to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve DataRepositoryConfiguration by id
        Optional<DataRepositoryConfiguration> dataRepositoryConfigurationRepositoryObject = dataRepositoryConfigurationRepository.findById(id);


        // Check if the returned object is not null
        if (null != dataRepositoryConfigurationRepositoryObject) {

            String decryptedCredentials = pbeEncryption
                .decrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), dataRepositoryConfigurationRepositoryObject.get().getCredentials());

            // Set DataRepositoryConfigurationRepository as entity in response object
            return Response.ok().entity(decryptedCredentials).build();

        } else {
            // Handle where DataRepositoryConfigurationRepository is not provided
            throw new ApiException(404, "DataRepositoryConfigurations not found");
        }
    }
    /**
     * Returns DataRepositoryConfigurationRepository
     * @param name
     * @return {@link Response}
     * @throws Exception
     */
    @Hidden
    @GetMapping(value = "/credentials.name/{name}"  )
    @Operation(hidden = true,summary = "Find DataRepositoryConfigurationRepository by DataRepositoryConfigurationRepository id",
        tags = {"DataRepositoryConfigurations"},
        description = "Returns a DataRepositoryConfigurationRepository ",
        responses = {
            @ApiResponse(description = "DataRepositoryConfigurations", content = @Content(schema = @Schema(implementation = DataRepositoryConfiguration.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getCredentialsByName(@Parameter(description = "name of DataRepositoryConfigurationRepository to be  retrieved",required = true) @Valid @PathVariable String name) throws Exception {

        // Retrieve DataRepositoryConfiguration by id
        DataRepositoryConfiguration dataRepositoryConfigurationRepositoryObject = dataRepositoryConfigurationRepository.getByName(name);


        // Check if the returned object is not null
        if (null != dataRepositoryConfigurationRepositoryObject) {

            String decryptedCredentials = pbeEncryption
                .decrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), dataRepositoryConfigurationRepositoryObject.getCredentials());

            // Set DataRepositoryConfigurationRepository as entity in response object
            return Response.ok().entity(decryptedCredentials).build();

        } else {
            // Handle where DataRepositoryConfigurationRepository is not provided
            throw new ApiException(404, "DataRepositoryConfigurations not found");
        }
    }

    /**
     * Save DataRepositoryConfigurationRepository
     * @param dataRepositoryConfiguration
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save DataRepositoryConfigurationRepository",
        tags = {"DataRepositoryConfigurations"},
        description = "Save DataRepositoryConfigurationRepository",
        responses = {
            @ApiResponse(description = "DataRepositoryConfigurations", content = @Content(schema = @Schema(implementation = DataRepositoryConfiguration.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response addDataRepositoryConfiguration(@Parameter(description = "DataRepositoryConfigurations object to be saved",required = true) @Valid @RequestBody DataRepositoryConfiguration dataRepositoryConfiguration) throws Exception {


        // set audit details: created and updated at values
        dataRepositoryConfiguration.setAuditValues();

        if (dataRepositoryConfiguration.getCredentials() != null) {
            // encrypt the credentials
            String encryptedCredentials = pbeEncryption
                    .encrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), dataRepositoryConfiguration.getCredentials().getBytes());


            // set the value back
            dataRepositoryConfiguration.setCredentials(encryptedCredentials);
        }

        // save DataRepositoryConfiguration
        DataRepositoryConfiguration savedDataRepositoryConfiguration = dataRepositoryConfigurationRepository.save(dataRepositoryConfiguration);

        // Check if the returned object is not null
        if (null != savedDataRepositoryConfiguration) {

            // Set DataRepositoryConfigurationRepository as entity in response object
            return Response.ok().entity(savedDataRepositoryConfiguration).build();

        } else {
            // Handle where DataRepositoryConfigurationRepository is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "DataRepositoryConfigurations not found");
        }
    }


    /**
     * update DataRepositoryConfigurationRepository
     * @param dataRepositoryConfiguration
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{dataRepositoryConfigurationId}"  )
    @Operation(summary = "Update DataRepositoryConfigurationRepository",
        tags = {"DataRepositoryConfigurations"},
        description = "Update DataRepositoryConfigurationRepository",
        responses = {
            @ApiResponse(description = "DataRepositoryConfigurations", content = @Content(schema = @Schema(implementation = DataRepositoryConfiguration.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response addDataRepositoryConfiguration(
        @Parameter(description = "ID of DataRepositoryConfiguration that needs to be updated", required = true)  @Valid @PathVariable("dataRepositoryConfigurationId") String dataRepositoryConfigurationId,
        @Parameter(description = "DataRepositoryConfigurations object to update",required = true) @Valid @RequestBody DataRepositoryConfiguration dataRepositoryConfiguration) throws Exception {

        // set DataRepositoryConfigurationRepository
        dataRepositoryConfiguration.setId(dataRepositoryConfigurationId);

        dataRepositoryConfiguration.setUpdatedAt(new Date());

        if (dataRepositoryConfiguration.getCredentials() != null) {
            // encrypt the credentials
            String encryptedCredentials = pbeEncryption
                    .encrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), dataRepositoryConfiguration.getCredentials().getBytes());


            // set the value back
            dataRepositoryConfiguration.setCredentials(encryptedCredentials);
        }

        // updated DataRepositoryConfiguration
        DataRepositoryConfiguration dataRepositoryConfigurationSaved = dataRepositoryConfigurationRepository.save(dataRepositoryConfiguration);

        // Check if the returned object is not null
        if (null != dataRepositoryConfigurationSaved) {

            // Set DataRepositoryConfigurationRepository as entity in response object
            return Response.ok().entity(dataRepositoryConfigurationSaved).build();

        } else {
            // Handle where DataRepositoryConfigurationRepository is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "DataRepositoryConfigurations not fod");
        }
    }


    /**
     * Returns all dataRepositoryconfigurations by category
     * @param category
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "category/{category}")
    @Operation(summary = "Returns all dataRepositoryconfigurations by Category",
        tags = {"DataRepositoryConfigurations"},
        description = "Returns all dataRepositoryconfigurations  by category",
        responses = {
            @ApiResponse(description = "DataRepositoryConfigurations", content = @Content(schema = @Schema(implementation = DataRepositoryConfiguration.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    
    public Response getDataRepositoryConfigurationsByCategory(@Parameter(description = "data repository configuration list by category", required = true)  @Valid @PathVariable("category") String category) throws Exception {
    
            
            List<DataRepositoryConfiguration> dataRepositoryConfigurationList =  dataRepositoryConfigurationRepository.getByCategory(category);
    
            if (dataRepositoryConfigurationList!=null) {
    
                
                return Response.ok().entity(dataRepositoryConfigurationList).build();
    
            } else {
                
                throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "data repository configurations not found");
            }
    
        }


    /**
     * Returns all dataRepositoryconfigurations:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping( )
    @Operation(summary = "Returns all dataRepositoryconfigurations",
        tags = {"DataRepositoryConfigurations"},
        description = "Returns all dataRepositoryconfigurations",
        responses = {
            @ApiResponse(description = "DataRepositoryConfigurations", content = @Content(schema = @Schema(implementation = DataRepositoryConfiguration.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAllDataRepositoryConfigurations() throws Exception {

        // Retrieve all dataRepositoryconfigurations
        List<DataRepositoryConfiguration> dataRepositoryConfigurationList = dataRepositoryConfigurationRepository.findAll();

        // Check if the returned object is not null
        if (null != dataRepositoryConfigurationList) {

            // Set DataRepositoryConfigurationRepository as entity in response object
            return Response.ok().entity(dataRepositoryConfigurationList).build();

        } else {
            // Handle where DataRepositoryConfigurationRepository is not provided
            throw new ApiException(404, "DataRepositoryConfigurations not found");
        }
    }


    

}


