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

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ibm.cloud.objectstorage.services.s3.model.PutObjectResult;
import com.ibm.pmai.models.core.DataRepositoryConfiguration;
import com.ibm.pmai.models.core.Executor;
import com.ibm.pmai.models.core.ExecutorRequirement;
import com.ibm.pmai.models.core.Location;
import com.ibm.pmai.models.core.LocationData;
import com.ibm.pmai.models.core.MetadataDetails;
import com.ibm.pmai.models.repositories.DataRepositoryConfigurationRepository;
import com.ibm.pmai.models.repositories.ExecutorRepository;
import com.ibm.pmai.models.repositories.LocationDataRepository;
import com.ibm.pmai.models.repositories.LocationRepository;
import com.ibm.pmai.models.repositories.MetadataDetailsRepository;
import com.ibm.pmai.taskclerk.configurations.ApplicationConfigurations;
import com.ibm.pmai.taskclerk.exceptions.ApiException;
import com.ibm.pmai.taskclerk.utils.PBEEncryption;
import com.ibm.pmai.taskclerk.utils.Utils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * LocationData Controller is used to manage all the interactions needed to manager location data as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/locationData")
public class LocationDataController {


    /**
     * LocationData repository declaration
     */
    private LocationDataRepository locationDataRepository;


    /**
     * Location repository declaration
     */
    private LocationRepository locationRepository;


    /**
     * MetadataDetailsRepository repository declaration
     */
    private MetadataDetailsRepository metadataDetailsRepository;

    /**
     * Executor repository declaration
     */
    private ExecutorRepository executorRepository;


    /**
     * DataRepositoryConfigurations repository declaration
     */
    private DataRepositoryConfigurationRepository dataRepositoryConfigurationRepository ;


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
    private static final Logger logger = LoggerFactory.getLogger(LocationDataController.class);

    /**
     * locationData controller
     * @param locationDataRepository
     */
    @Autowired
    public LocationDataController(MetadataDetailsRepository metadataDetailsRepository,LocationRepository locationRepository,PBEEncryption pbeEncryption, LocationDataRepository locationDataRepository, ExecutorRepository executorRepository, DataRepositoryConfigurationRepository dataRepositoryConfigurationRepository, ApplicationConfigurations applicationConfigurations ) {
        this.locationDataRepository = locationDataRepository;
        this.executorRepository =executorRepository;
        this.dataRepositoryConfigurationRepository = dataRepositoryConfigurationRepository;
        this.applicationConfigurations = applicationConfigurations;
        this.pbeEncryption =pbeEncryption;
        this.locationRepository = locationRepository;
        this.metadataDetailsRepository = metadataDetailsRepository;
    }

    /**
     * Returns locationData
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}")
    @Operation(summary = "Find locationData by locationData id",
        tags = {"LocationData"},
        description = "Returns a LocationData ",
        responses = {
            @ApiResponse(description = "LocationData", content = @Content(schema = @Schema(implementation = LocationData.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a locationData to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve locationData by id
        Optional<LocationData> locationData = locationDataRepository.findById(id);

        // Check if the returned object is not null
        if (null != locationData & locationData.isPresent()) {

            // Set locationData as entity in response object
            return Response.ok().entity(locationData.get()).build();
        } else {
            // Handle where locationData is not provided
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


    /**
     * Save locationData
     * @param locationData
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping()
    @Operation(summary = "Save locationData",
        tags = {"LocationData"},
        description = "Save locationData",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response saveLocation(  @RequestBody LocationData locationData ) throws Exception {


        // set audit details: created and updated at values
        locationData.setAuditValues();

        // save locationData
        LocationData savedLocation= locationDataRepository.save(locationData);

        // Check if the returned object is not null
        if (null != savedLocation) {

            // Set locationData as entity in response object
            return Response.ok().entity(savedLocation).build();

        } else {
            // Handle where locationData is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


    /**
     * update locationData
     * @param locationData
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{locationId}")
    @Operation(summary = "Update locationData",
        tags = {"LocationData"},
        description = "Update locationData",
        responses = {
            @ApiResponse(description = "LocationData", content = @Content(schema = @Schema(implementation = LocationData.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response updateLocation(
        @Parameter(description = "Id of locationData that needs to be updated", required = true)  @Valid @PathVariable("locationId") String locationId,
        @Parameter(description = "LocationData object to update",required = true) @Valid @RequestBody LocationData locationData) throws Exception {

        // set locationData id
        locationData.setId(locationId);

        // set audit details: created and updated at values
        locationData.setAuditValues();

        // updated locationData
        LocationData updatedLocation = locationDataRepository.save(locationData);

        // Check if the returned object is not null
        if (null != updatedLocation) {

            // Set contect as entity in response object
            return Response.ok().entity(updatedLocation).build();

        } else {
            // Handle where locationData is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


    /**
     * update locationData
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping (value = "/{locationId}/{executorId}/{iso2code}")
    @Operation(summary = "Verify location data and Upload locationData",
        tags = {"LocationData"},
        description = "Verify location data and Upload locationData",
        responses = {
            @ApiResponse(description = "LocationData", content = @Content(schema = @Schema(implementation = LocationData.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response verifyAndUploadLocationData(
        @Parameter(description = "Id of location that needs to be updated with locationData", required = true)  @Valid @PathVariable("locationId") String locationId,
        @Parameter(description = "Id of executor that needs to be updated", required = true)  @Valid @PathVariable("executorId") String executorId,
        @Parameter(description = "ISO2 code in caps of the location to be verified", required = true)  @Valid @PathVariable("iso2code") String iso2code) throws Exception {

        Executor executor = executorRepository.getOne(executorId);

        Location location= locationRepository.getOne(locationId);

        List<ExecutorRequirement> executorRequirements = executor.getExecutorRequirement();
        if (executorRequirements == null || executorRequirements.isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Model lacks requements");
        }
        executorRequirements.removeIf(er -> (!er.getCategory().equalsIgnoreCase("data")));
        if (executorRequirements.isEmpty() || executorRequirements.get(0).getValue() == null || executorRequirements.get(0).getValue().isEmpty()) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Model lacks data requements");
        }

        String dataUrl = executorRequirements.get(0).getValue() + "casedata/csv/" + iso2code + "/?startDate=2020-01-01";
        if (!Utils.validateLocationData(dataUrl)) {
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Model data for location " + iso2code + " missing");
        }

        LocationData locationData = new LocationData();


        MetadataDetails metadataDetails = new MetadataDetails();
        metadataDetails.setKey(locationId+"."+executorRequirements.get(0).getDescription());
        metadataDetails.setName(executorRequirements.get(0).getDescription());
        metadataDetails.setContentType("url");
        metadataDetails.setAuditValues();
        metadataDetails.setLocationId(locationId);
        metadataDetails.setExecutorId(executorId);

        List<MetadataDetails> metadataDetailst1= locationData.getMetadataDetailsList();
        if (metadataDetailst1==null)
            metadataDetailst1 = new ArrayList<>();
        metadataDetailsRepository.save(metadataDetails);
        metadataDetailst1.add(metadataDetails);

        locationData.setMetadataDetailsList(metadataDetailst1);

        List<Executor> executorList =locationData.getExecutorList();
        if (executorList==null)
            executorList = new ArrayList<>();
        executorList.add(executor);
        locationData.setExecutorList(executorList);

        locationData.setLocation(location);

        LocationData locationSaved=  locationDataRepository.save(locationData);

        // Check if the returned object is not null
        // && executor.getDefaultPostExecutor() != null && !executor.getDefaultPostExecutor().isEmpty()
        if (null != locationSaved) {
            if (!executor.isActive()) {
                executor.setActive(true);
                executorRepository.save(executor);
            }

            // Set contect as entity in response object
            return Response.ok().entity(locationSaved).build();

        } else {
            // Handle where locationData is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }

    /**
     * update locationData
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping (value = "/{locationId}/{executorId}/{datarepositoryid}",consumes = {"multipart/form-data"})
    @Operation(summary = "Upload locationData",
        tags = {"LocationData"},
        description = "Upload locationData",
        responses = {
            @ApiResponse(description = "LocationData", content = @Content(schema = @Schema(implementation = LocationData.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response uploadLocationData(
        @Parameter(description = "Id of locationData that needs to be updated", required = true)  @Valid @PathVariable("locationId") String locationId,
        @Parameter(description = "Id of executor that needs to be updated", required = true)  @Valid @PathVariable("executorId") String executorId,
        @Parameter(description = "Id of executor that needs to be updated", required = true)  @Valid @PathVariable("datarepositoryid") String datarepositoryid,
        @RequestPart(value = "file", required = false) MultipartFile multipartFile ) throws Exception {

        Executor executor = executorRepository.getOne(executorId);

        Location location= locationRepository.getOne(locationId);

        LocationData locationData = new LocationData();

        DataRepositoryConfiguration dataRepositoryConfiguration= dataRepositoryConfigurationRepository.getOne(datarepositoryid);
        // decrypt credentials
        String decryptedCredentials = pbeEncryption
            .decrypt(applicationConfigurations.getAuthenticationEncryptionKey().toCharArray(), dataRepositoryConfiguration.getCredentials());

        JsonObject jsonObject = new JsonParser().parse(decryptedCredentials).getAsJsonObject();

        String fileName =  multipartFile.getOriginalFilename();
        String contentType =  multipartFile.getContentType();
        InputStream inputStream = new ByteArrayInputStream(multipartFile.getBytes());

        PutObjectResult putObjectResult = Utils.putObject(jsonObject.get("apikey").getAsString(),jsonObject.get("resource_instance_id").getAsString(),jsonObject.get("endpointUrl").getAsString()
            ,jsonObject.get("bucketName").getAsString(),jsonObject.get("bucketRegion").getAsString(),jsonObject.get("iamEndpoint").getAsString(),contentType,multipartFile.getInputStream(),locationId+"."+fileName);

        MetadataDetails metadataDetails =new MetadataDetails();
        metadataDetails.setKey(locationId+"."+fileName);
        metadataDetails.setName(fileName);
        metadataDetails.setContentType(contentType);
        metadataDetails.setAuditValues();
        metadataDetails.setDataRepositoryConfiguration(dataRepositoryConfiguration);

        try {
            // String text = IOUtils.toString(inputStream, StandardCharsets.UTF_8.name());
            // JsonArray jsonArray = new JsonParser().parse(text).getAsJsonArray();

            // JsonObject jsonObject1 = jsonArray.get(0).getAsJsonObject();
            // String startDate=jsonObject1.get("day0").getAsString();
            // String maxDays=jsonObject1.get("days").getAsString();
            metadataDetails.setStartDate("");
            metadataDetails.setMaxDays("");
        }catch (Exception e){
            logger.info(e.getMessage());
        }

        metadataDetails.setLocationId(locationId);
        metadataDetails.setExecutorId(executorId);

        List<MetadataDetails> metadataDetailst1= locationData.getMetadataDetailsList();
        if (metadataDetailst1==null)
            metadataDetailst1 = new ArrayList<>();
        metadataDetailsRepository.save(metadataDetails);
        metadataDetailst1.add(metadataDetails);

        locationData.setMetadataDetailsList(metadataDetailst1);

        List<Executor> executorList =locationData.getExecutorList();
        if (executorList==null)
            executorList = new ArrayList<>();
        executorList.add(executor);
        locationData.setExecutorList(executorList);

        locationData.setLocation(location);

        LocationData locationSaved=  locationDataRepository.save(locationData);

        // Check if the returned object is not null
        if (null != locationSaved) {

            // Set contect as entity in response object
            return Response.ok().entity(locationSaved).build();

        } else {
            // Handle where locationData is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }
    @RequestMapping(value = "/doUpload", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public Response upload( @RequestPart(value = "file", required = true ) MultipartFile file) {

        logger.info(file.getOriginalFilename());
        return Response.ok().entity("").build();
    }


    /**
     * Returns all location data:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping( )
    @Operation(summary = "Returns all location data",
        tags = {"LocationData"},
        description = "Returns all location data ",
        responses = {
            @ApiResponse(description = "LocationData", content = @Content(schema = @Schema(implementation = LocationData.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAllLocations() throws Exception {

        // Retrieve all location data
        List<LocationData> locationList = locationDataRepository.findAll();

        // Check if the returned object is not null
        if (null != locationList) {

            // Set content as entity in response object
            return Response.ok().entity(locationList).build();

        } else {
            // Handle where locationData is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }

    /**
     *
     * @param adminlevel
     * @param country
     * @param levelname
     * @return
     * @throws Exception
     */
    @GetMapping(value = "/{adminlevel}/{executorId}/{country}/{levelname}")
    @Operation(summary = "Find location data",
        tags = {"LocationData"},
        description = "Returns a LocationData ",
        responses = {
            @ApiResponse(description = "Location", content = @Content(schema = @Schema(implementation = Location.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getLocationDataByAdminLevelAndCountry(
        @Parameter(description = "admin level",required = false) @Valid @PathVariable String adminlevel,

        @Parameter(description = "executorId",required = true) @Valid @PathVariable String executorId,

        @Parameter(description = "country",required = false) @Valid @PathVariable String country,

        @Parameter(description = "levelname",required = false) @Valid @PathVariable String levelname) throws Exception {

        List<LocationData> locationData =null;

        if (levelname.equalsIgnoreCase("null")&& adminlevel.equalsIgnoreCase("null") && country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByExecutorList_Id(executorId);
        else if (levelname.equalsIgnoreCase("null")&& !adminlevel.equalsIgnoreCase("null") && country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByLocation_AdminLevelAndExecutorList_Id(adminlevel,executorId);
        else if (levelname.equalsIgnoreCase("null")&& adminlevel.equalsIgnoreCase("null") && !country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByLocation_CountryAndExecutorList_Id(country,executorId);
        else if (!levelname.equalsIgnoreCase("null")&& adminlevel.equalsIgnoreCase("null") && country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByLocation_AdminLevelList_levelNameAndExecutorList_Id(levelname,executorId);
        else if (!levelname.equalsIgnoreCase("null")&& adminlevel.equalsIgnoreCase("null") && !country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByExecutorList_IdAndLocation_CountryAndLocation_AdminLevelList_levelName(executorId,country,levelname);
        else if (levelname.equalsIgnoreCase("null")&& !adminlevel.equalsIgnoreCase("null") && !country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByLocation_AdminLevelAndExecutorList_IdAndLocation_Country(adminlevel,executorId,country);
        else if (!levelname.equalsIgnoreCase("null")&& !adminlevel.equalsIgnoreCase("null") && !country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByLocation_AdminLevelAndExecutorList_IdAndLocation_CountryAndLocation_AdminLevelList_levelName(adminlevel,executorId,country,levelname);
        else if (levelname.equalsIgnoreCase("null")&& !adminlevel.equalsIgnoreCase("null") && country.equalsIgnoreCase("null") && !executorId.equalsIgnoreCase("null"))
            locationData = locationDataRepository.getByLocation_AdminLevelAndExecutorList_IdAndLocation_AdminLevelList_levelName(adminlevel,executorId,levelname);

        // Check if the returned object is not null
        if (null != locationData) {

            // Set location as entity in response object
            return Response.ok().entity(locationData).build();
        } else {
            // Handle where location is not provided
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "No matching combination to the values passed");
        }
    }

    @GetMapping(value = "/{adminlevel}")
    @Operation(summary = "Find location data",
            tags = {"LocationData"},
            description = "Returns a LocationData ",
            responses = {
                    @ApiResponse(description = "Location", content = @Content(schema = @Schema(implementation = Location.class))),
                    @ApiResponse(responseCode = "200", description = "OK"),
                    @ApiResponse(responseCode = "400", description = "Invalid request"),
                    @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
                    @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
                    @ApiResponse(responseCode = "404", description = "Not found"),
                    @ApiResponse(responseCode = "405", description = "Validation exception")
            })
    public Response getLocationDataByAdminLevel(
            @Parameter(description = "admin level",required = false) @Valid @PathVariable String adminlevel) throws Exception {

        List<LocationData> locationData = locationDataRepository.getByLocation_AdminLevel(adminlevel);

        // Check if the returned object is not null
        if (null != locationData) {

            // Set location as entity in response object
            return Response.ok().entity(locationData).build();
        } else {
            // Handle where location is not provided
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "No matching combination to the values passed");
        }
    }
}
