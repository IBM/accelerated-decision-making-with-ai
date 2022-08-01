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

import com.ibm.pmai.models.core.AdminLevel;
import com.ibm.pmai.models.core.Location;
import com.ibm.pmai.models.repositories.AdminLevelRepository;
import com.ibm.pmai.models.repositories.LocationRepository;
import com.ibm.pmai.taskclerk.exceptions.ApiException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


/**
 * Location Controller is used to manage all the interactions needed to manager locations as well do any related additions and updates
 */
@RestController
@RequestMapping("/api/location")
public class LocationsController {


    /**
     * Location repository declaration
     */
    private LocationRepository locationRepository;


    /**
     * Location repository declaration
     */
    private AdminLevelRepository adminLevelRepository;


    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(LocationsController.class);

    /**
     * location controller
     * @param locationRepository
     */
    @Autowired
    public LocationsController(AdminLevelRepository adminLevelRepository,LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
        this.adminLevelRepository =adminLevelRepository;
    }

    /**
     * Returns location
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}")
    @Operation(summary = "Find location by location id",
        tags = {"Location"},
        description = "Returns a Location ",
        responses = {
            @ApiResponse(description = "Location", content = @Content(schema = @Schema(implementation = Location.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a location to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve location by id
        Optional<Location> location = locationRepository.findById(id);

        // Check if the returned object is not null
        if (null != location & location.isPresent()) {

            // Set location as entity in response object
            return Response.ok().entity(location.get()).build();
        } else {
            // Handle where location is not provided
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


    /**
     * Save location
     * @param location
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping()
    @Operation(summary = "Save location",
        tags = {"Location"},
        description = "Save location",
        responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response saveLocation(  @RequestBody Location location ) throws Exception {


        // set audit details: created and updated at values
        location.setAuditValues();

        List<AdminLevel> adminLevelList=   location.getAdminLevelList();

        List<AdminLevel> adminLevelListIds=   new ArrayList<>();
        for (AdminLevel adminLevel: adminLevelList) {
            AdminLevel adminLevel1=adminLevelRepository.getByLevelName(adminLevel.getLevelName());
            if (adminLevel1==null) {
                AdminLevel adminLevel2 = adminLevelRepository.save(adminLevel);
                adminLevelListIds.add(adminLevel2);
            } else
                adminLevelListIds.add(adminLevel1);
        }

        location.setAdminLevelList(adminLevelListIds);

        // save location
        Location savedLocation= locationRepository.save(location);

        // Check if the returned object is not null
        if (null != savedLocation) {

            // Set location as entity in response object
            return Response.ok().entity(savedLocation).build();

        } else {
            // Handle where location is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


    /**
     * update location
     * @param location
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{locationId}")
    @Operation(summary = "Update location",
        tags = {"Location"},
        description = "Update location",
        responses = {
            @ApiResponse(description = "Location", content = @Content(schema = @Schema(implementation = Location.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response updateLocation(
        @Parameter(description = "Id of location that needs to be updated", required = true)  @Valid @PathVariable("locationId") String locationId,
        @Parameter(description = "Location object to update",required = true) @Valid @RequestBody Location location) throws Exception {

        // set location id
        location.setId(locationId);

        // set audit details: created and updated at values
        location.setAuditValues();

        // updated location
        Location updatedLocation = locationRepository.save(location);

        // Check if the returned object is not null
        if (null != updatedLocation) {

            // Set contect as entity in response object
            return Response.ok().entity(updatedLocation).build();

        } else {
            // Handle where location is not saved - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }

    /**
     * Returns all locations:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping( )
    @Operation(summary = "Returns all locations",
        tags = {"Location"},
        description = "Returns all locations ",
        responses = {
            @ApiResponse(description = "Location", content = @Content(schema = @Schema(implementation = Location.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAllLocations() throws Exception {

        // Retrieve all locations
        List<Location> locationList = locationRepository.findAll();

        // Check if the returned object is not null
        if (null != locationList) {

            // Set content as entity in response object
            return Response.ok().entity(locationList).build();

        } else {
            // Handle where location is not saved - most probably due to bad request
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
    @GetMapping(value = "/{adminlevel}/{country}/{levelname}")
    @Operation(summary = "Find location by location id",
        tags = {"Location"},
        description = "Returns a Location ",
        responses = {
            @ApiResponse(description = "Location", content = @Content(schema = @Schema(implementation = Location.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response getByAdminLevelAndCountry(
        @Parameter(description = "admin level",required = false) @Valid @PathVariable String adminlevel,
        @Parameter(description = "country",required = false) @Valid @PathVariable String country,
        @Parameter(description = "levelname",required = false) @Valid @PathVariable String levelname) throws Exception {



        List<Location> location =null;
        if (!adminlevel.equalsIgnoreCase("null")&&levelname.equalsIgnoreCase("null") && country.equalsIgnoreCase("null") )
            location = locationRepository.getByAdminLevel(adminlevel);
        else if (!country.equalsIgnoreCase("null") && !adminlevel.equalsIgnoreCase("null") && !levelname.equalsIgnoreCase("null"))
            location = locationRepository.getByAdminLevelAndCountryAndAdminLevelList_levelName(adminlevel,country,levelname);
        else if (!country.equalsIgnoreCase("null") && !adminlevel.equalsIgnoreCase("null") && levelname.equalsIgnoreCase("null"))
            location = locationRepository.getByAdminLevelAndCountry(adminlevel,country);
        else if (country.equalsIgnoreCase("null") && !adminlevel.equalsIgnoreCase("null") && !levelname.equalsIgnoreCase("null"))
            location = locationRepository.getByCountry(country);
        else if (!country.equalsIgnoreCase("null") && !adminlevel.equalsIgnoreCase("null") && levelname.equalsIgnoreCase("null"))
            location = locationRepository.getByAdminLevelList_levelName(levelname);
        else if (country.equalsIgnoreCase("null") && !adminlevel.equalsIgnoreCase("null") && !levelname.equalsIgnoreCase("null"))
            location = locationRepository.getByAdminLevelAndAdminLevelList_levelName(adminlevel,levelname);
        else if (!country.equalsIgnoreCase("null") && adminlevel.equalsIgnoreCase("null") && !levelname.equalsIgnoreCase("null"))
            location = locationRepository.getByCountryAndAdminLevelList_levelName(country,levelname);
        else
            location = locationRepository.findAll();



        // Check if the returned object is not null
        if (null != location) {
            // Set location as entity in response object
            return Response.ok().entity(location).build();
        } else {
            // Handle where location is not provided
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Not found");
        }
    }


}
