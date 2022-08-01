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

import java.util.ArrayList;
import java.util.Arrays;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibm.pmai.models.core.DataRepositoryConfiguration;
import com.ibm.pmai.models.core.ExecutionEnvironmentCommand;
import com.ibm.pmai.models.core.Executor;
import com.ibm.pmai.models.core.ExecutorRequirement;
import com.ibm.pmai.models.core.ExecutorType;
import com.ibm.pmai.models.core.OptimizationEnvelope;
import com.ibm.pmai.models.repositories.DataRepositoryConfigurationRepository;
import com.ibm.pmai.models.repositories.ExecutionEnvironmentCommandRepository;
import com.ibm.pmai.models.repositories.ExecutorRepository;
import com.ibm.pmai.models.repositories.ExecutorRequirementRepository;
import com.ibm.pmai.models.repositories.ExecutorTypeRepository;
import com.ibm.pmai.models.repositories.OptimizationEnvelopeRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.utils.Constants;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * Executor Controller is used to manage all the interactions needed to manager executor as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/executor")
public class ExecutorController {


    /**
     * Executor repository declaration
     */
    private ExecutorRepository executorRepository;

    /**
     * ExecutorType repository declaration
     */
    private ExecutorTypeRepository executorTypeRepository;


    /**
     * ApplicationConfigurations repository declaration
     */
    private ApplicationConfigurations applicationConfigurations;


    /**
     * DataRepositoryConfigurations repository declaration
     */
    private DataRepositoryConfigurationRepository dataRepositoryConfigurationRepository;

    /**
     * ExecutionEnvironmentCommand repository declaration
     */
    private ExecutionEnvironmentCommandRepository executionEnvironmentCommandRepository;

    /**
     * ExecutorRequirement repository declaration
     */
    private ExecutorRequirementRepository executorRequirementRepository;

    private OptimizationEnvelopeRepository optimizationEnvelopeRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(ExecutorController.class);

    /**
     * Executor controller
     * @param executorRepository
     */
    @Autowired
    public ExecutorController(ExecutionEnvironmentCommandRepository executionEnvironmentCommandRepository,DataRepositoryConfigurationRepository dataRepositoryConfigurationRepository,ApplicationConfigurations applicationConfigurations,ExecutorRepository executorRepository,ExecutorTypeRepository executorTypeRepository, ExecutorRequirementRepository executorRequirementRepository, OptimizationEnvelopeRepository optimizationEnvelopeRepository) {
        this.executorRepository = executorRepository;
        this.executorTypeRepository = executorTypeRepository;
        this.applicationConfigurations = applicationConfigurations;
        this.dataRepositoryConfigurationRepository =  dataRepositoryConfigurationRepository;
        this.executionEnvironmentCommandRepository = executionEnvironmentCommandRepository;
        this.executorRequirementRepository = executorRequirementRepository;
        this.optimizationEnvelopeRepository = optimizationEnvelopeRepository;
    }

    /**
     * Returns Executor
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find Executor by Executor id",
        tags = {"Executor"},
        description = "Returns a Executor ",
        responses = {
            @ApiResponse(description = "Executor", content = @Content(schema = @Schema(implementation = Executor.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a Executor to be  retrieved",required = true) @Valid @PathVariable String id,
       @RequestParam(value = "executorType", required = true, defaultValue = "MODEL") Constants.EXECUTOR_TYPES executorTypes) throws Exception {

        // Retrieve Executor by id
        List<Executor> executor = executorRepository.getByIdAndExecutorType_Type(id,executorTypes.toString());

        // Check if the returned object is not null
        if (null != executor) {

            // Set Executor as entity in response object
            return Response.ok().entity(executor.get(0)).build();

        } else {
            // Handle where Executor is not provided
            throw new ApiException(404, "Executor not found");
        }
    }


    /**
     * Save Executor
     * @param executor
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save Executor",
        tags = {"Executor"},
        description = "Save Executor",
        responses = {
            @ApiResponse(description = "Executor", content = @Content(schema = @Schema(implementation = Executor.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "Executor object to be saved",required = true) @Valid @RequestBody Executor executor,@RequestParam(value = "executorType", required = true, defaultValue = "MODEL") Constants.EXECUTOR_TYPES executorTypes) throws Exception {
        // Initialise
        ExecutorType executorType =null;

        // Check if user has passed if not set a new one
        if (executor.getExecutorType()==null) {
            executorType = new ExecutorType();

            // set timestamp
            executorType.setAuditValues();
        }


        if (executor.getDataRepositoryConfiguration()==null || executor.getDataRepositoryConfiguration().getId()==null) {
            DataRepositoryConfiguration dataRepositoryConfiguration = dataRepositoryConfigurationRepository.getByName(applicationConfigurations.getDefaultDataRepo());
            executor.setDataRepositoryConfiguration(dataRepositoryConfiguration);
        }

        if (executor.getExecutionEnvironmentCommand()==null ||executor.getExecutionEnvironmentCommand().getId()==null) {
            ExecutionEnvironmentCommand executionEnvironmentCommand = executionEnvironmentCommandRepository.getByEnvironmentCommandName(applicationConfigurations.getEnvironmentCommandName());
            executor.setExecutionEnvironmentCommand(executionEnvironmentCommand);
        }

        executorType.setType(executorTypes.toString());
        executorType.setName(executorTypes.toString());

        // set executor type
        executor.setExecutorType(executorType);

        // set audit details: created and updated at values
        executor.setAuditValues();

        // Save executor requirements for the executor of type environment
        List<ExecutorRequirement> executorRequirementList = executor.getExecutorRequirement();
        if (executorRequirementList != null && !executorRequirementList.isEmpty()) {
            List<ExecutorRequirement> executorRequirementListIds=   new ArrayList<>();
            for (ExecutorRequirement executorRequirement: executorRequirementList) {
                executorRequirement.setAuditValues();
                ExecutorRequirement savedExecutorRequirement;

                // save OptimizationEnvelope first
                OptimizationEnvelope optimizationEnvelope = executorRequirement.getOptimizationEnvelope();
                if (optimizationEnvelope != null) {
                    OptimizationEnvelope savedOptimizationEnvelope;
                    if (optimizationEnvelope.getId() != null && !optimizationEnvelope.getId().isEmpty()) {
                        savedOptimizationEnvelope = optimizationEnvelopeRepository.save(optimizationEnvelope);
                    } else {
                        savedOptimizationEnvelope = optimizationEnvelopeRepository.save(optimizationEnvelope);
                    }
                    executorRequirement.setOptimizationEnvelope(savedOptimizationEnvelope);
                }

                if (executorRequirement.getId() == null || executorRequirement.getId().isEmpty())
                    savedExecutorRequirement = executorRequirementRepository.save(executorRequirement);
                else  {
                    savedExecutorRequirement = executorRequirementRepository.getOne(executorRequirement.getId());
                    if (savedExecutorRequirement == null)
                        savedExecutorRequirement = executorRequirementRepository.save(executorRequirement);
                }
                executorRequirementListIds.add(savedExecutorRequirement);
            }

            executor.setExecutorRequirement(executorRequirementListIds);
        }

        // save Executor
        Executor savedExecutor = executorRepository.save(executor);
        

        // Check if the returned object is not null
        if (null != savedExecutor) {
            // Set Executor as entity in response object
            return Response.ok().entity(savedExecutor).build();

        } else {
            // Handle where Executor is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Executor not fod");
        }
    }


    /**
     * Get Executor By List
     * @param executors
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping( "/list" )
    @Operation(summary = "Get Executor By List/Array of Executor ID",
        tags = {"Executor"},
        description = "Save Executor",
        responses = {
            @ApiResponse(description = "Executor", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getListOfExecutorsIn(@Parameter(description = "List of executor ids in arrays",required = true) @Valid @RequestBody String[] executors) throws Exception {

        // get list of executors
       List<Executor> executorList=executorRepository.getByIds(Arrays.asList(executors));


        // Check if the returned object is not null
        if (null != executorList) {

            // Set Executor as entity in response object
            return Response.ok().entity(executorList).build();

        } else {
            // Handle where Executor is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Executor not fod");
        }
    }


    /**
     * update Executor
     * @param executor
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{executorId}"  )
    @Operation(summary = "Update Executor",
        tags = {"Executor"},
        description = "Update Executor",
        responses = {
            @ApiResponse(description = "Executor", content = @Content(schema = @Schema(implementation = Executor.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of Executor that needs to be updated", required = true)  @Valid @PathVariable("executorId") String executorId,
        @RequestParam(value = "executorType", required = true, defaultValue = "MODEL") Constants.EXECUTOR_TYPES executorTypes,
        @Parameter(description = "Executor object to update",required = true) @Valid @RequestBody Executor executor) throws Exception {

        // set Executor
        executor.setId(executorId);

        ExecutorType executorType =null;

        // Check if user has passed if not set a new one
        if (executor.getExecutorType()==null) {
            executorType = new ExecutorType();

            // set timestamp
            executorType.setAuditValues();
        } else{
          Optional<ExecutorType> optionalExecutorType= executorTypeRepository.findById(executor.getExecutorType().getId());
            executorType = optionalExecutorType.get();

        }

        if (executor.getDataRepositoryConfiguration()==null || executor.getDataRepositoryConfiguration().getId()==null) {
            DataRepositoryConfiguration dataRepositoryConfiguration = dataRepositoryConfigurationRepository.getByName(applicationConfigurations.getDefaultDataRepo());
            executor.setDataRepositoryConfiguration(dataRepositoryConfiguration);
        }

        if (executor.getExecutionEnvironmentCommand()==null ||executor.getExecutionEnvironmentCommand().getId()==null) {
            ExecutionEnvironmentCommand executionEnvironmentCommand = executionEnvironmentCommandRepository.getByEnvironmentCommandName(applicationConfigurations.getEnvironmentCommandName());
            executor.setExecutionEnvironmentCommand(executionEnvironmentCommand);
        }

        executorType.setType(executorTypes.toString());
        executorType.setName(executorTypes.toString());

        // set executor type
        executor.setExecutorType(executorType);

        // set audit details: created and updated at values
        executor.setAuditValues();

        // Save executor requirements for the executor of type environment
        List<ExecutorRequirement> executorRequirementList = executor.getExecutorRequirement();
        if (executorRequirementList != null && !executorRequirementList.isEmpty()) {
            List<ExecutorRequirement> executorRequirementListIds=   new ArrayList<>();
            for (ExecutorRequirement executorRequirement: executorRequirementList) {
                ExecutorRequirement savedExecutorRequirement;

                // save OptimizationEnvelope first
                OptimizationEnvelope optimizationEnvelope = executorRequirement.getOptimizationEnvelope();
                if (optimizationEnvelope != null) {
                    OptimizationEnvelope savedOptimizationEnvelope;
                    if (optimizationEnvelope.getId() != null && !optimizationEnvelope.getId().isEmpty()) {
                        savedOptimizationEnvelope = optimizationEnvelopeRepository.save(optimizationEnvelope);
                    } else {
                        savedOptimizationEnvelope = optimizationEnvelopeRepository.save(optimizationEnvelope);
                    }
                    executorRequirement.setOptimizationEnvelope(savedOptimizationEnvelope);
                }

                if (executorRequirement.getId() == null || executorRequirement.getId().isEmpty()) {
                    executorRequirement.setAuditValues();
                    savedExecutorRequirement = executorRequirementRepository.save(executorRequirement);
                } else  {
                    savedExecutorRequirement = executorRequirementRepository.getOne(executorRequirement.getId());
                    if (savedExecutorRequirement == null)
                        savedExecutorRequirement = executorRequirementRepository.save(executorRequirement);
                    else 
                        savedExecutorRequirement = executorRequirementRepository.save(executorRequirement);

                }
                executorRequirementListIds.add(savedExecutorRequirement);
            }

            executor.setExecutorRequirement(executorRequirementListIds);
        }

        // updated Executor
        Executor executorSaved = executorRepository.save(executor);

        // Check if the returned object is not null
        if (null != executorSaved) {

            // Set Executor as entity in response object
            return Response.ok().entity(executorSaved).build();

        } else {
            // Handle where Executor is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Executor not fod");
        }
    }



    /**
     * update Executor
     * @param executor
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "postexecutor/{executorId}"  )
    @Operation(summary = "Add post executor to an existing executor",
        tags = {"Executor"},
        description = "Update Executor",
        responses = {
            @ApiResponse(description = "Executor", content = @Content(schema = @Schema(implementation = Executor.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response addPostExecutor(
        @Parameter(description = "ID of Executor that needs to be updated", required = true)  @Valid @PathVariable("executorId") String executorId,
        @RequestParam(value = "executorType", required = true, defaultValue = "MODEL") Constants.EXECUTOR_TYPES executorTypes,
        @Parameter(description = "Executor object to update",required = true) @Valid @RequestBody Executor executor) throws Exception {

        ExecutorType executorType =null;

        // Check if user has passed if not set a new one
        if (executor.getExecutorType()==null) {
            executorType = new ExecutorType();

            // set timestamp
            executorType.setAuditValues();
        } else{
            Optional<ExecutorType> optionalExecutorType= executorTypeRepository.findById(executor.getExecutorType().getId());
            executorType = optionalExecutorType.get();

        }
        executorType.setType(executorTypes.toString());
        executorType.setName(executorTypes.toString());

        // set executor type
        executor.setExecutorType(executorType);

        // set audit details: created and updated at values
        executor.setAuditValues();

        // updated Executor
        Executor executorSaved = executorRepository.save(executor);

        // Retrieve Executor by id
        Executor executorModel = executorRepository.getOne(executorId);

        executorModel.getDefaultPostExecutor().add(executorSaved);

        // updated Executor
        Executor updateSaved = executorRepository.save(executorModel);

        // Check if the returned object is not null
        if (null != updateSaved) {

            // Set Executor as entity in response object
            return Response.ok().entity(updateSaved).build();

        } else {
            // Handle where Executor is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Executor not found");
        }
    }


    /**
     * Returns all executor:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all executor",
        tags = {"Executor"},
        description = "Returns all executor ",
        responses = {
            @ApiResponse(description = "Executor", content = @Content(schema = @Schema(implementation = Executor.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all executor
        List<Executor> executors = executorRepository.findAll();

        // Check if the returned object is not null
        if (null != executors) {

            // Set Executor as entity in response object
            return Response.ok().entity(executors).build();

        } else {
            // Handle where Executor is not provided
            throw new ApiException(404, "Executor not found");
        }
    }
    /**
     * Returns Executor
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/executorType"  )
    @Operation(summary = "Find Executor by Executor id",
        tags = {"Executor"},
        description = "Returns a Executor ",
        responses = {
            @ApiResponse(description = "Executor", content = @Content(schema = @Schema(implementation = Executor.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findByExecutorType(
                             @RequestParam(value = "executorType", required = true, defaultValue = "MODEL") Constants.EXECUTOR_TYPES executorTypes) throws Exception {

        // Retrieve Executor by id
        List<Executor> executorList = executorRepository.getByExecutorType_Type(executorTypes.toString());

        // Check if the returned object is not null
        if (null != executorList) {

            // Set Executor as entity in response object
            return Response.ok().entity(executorList).build();

        } else {
            // Handle where Executor is not provided
            throw new ApiException(404, "Executor not found");
        }
    }

}

