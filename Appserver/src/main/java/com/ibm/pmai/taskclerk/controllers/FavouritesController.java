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

import com.ibm.pmai.models.core.Favourite;
import com.ibm.pmai.models.repositories.FavouriteRepository;
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
 * Favourite Controller is used to manage all the interactions needed to manager favourite as well do any related additions and updates
 */
@Hidden
@RestController
@RequestMapping("/api/favourite")
public class FavouritesController {


    /**
     * Favourite repository declaration
     */
    private FavouriteRepository favouriteRepository;

    /**
     * Logger declaration
     */
    private static final Logger logger = LoggerFactory.getLogger(FavouritesController.class);

    /**
     * Favourite controller
     * @param favouriteRepository
     */
    @Autowired
    public FavouritesController(FavouriteRepository favouriteRepository) {
        this.favouriteRepository = favouriteRepository;
    }

    /**
     * Returns Favourite
     * @param id
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(value = "/{id}"  )
    @Operation(summary = "Find Favourite by Favourite id",
        tags = {"Favourite"},
        description = "Returns a Favourite ",
        responses = {
            @ApiResponse(description = "Favourite", content = @Content(schema = @Schema(implementation = Favourite.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response findById(@Parameter(description = "id of a Favourite to be  retrieved",required = true) @Valid @PathVariable String id) throws Exception {

        // Retrieve Favourite by id
        Favourite favourite = favouriteRepository.getOne(id);

        // Check if the returned object is not null
        if (null != favourite) {

            // Set Favourite as entity in response object
            return Response.ok().entity(favourite).build();

        } else {
            // Handle where Favourite is not provided
            throw new ApiException(404, "Favourite not found");
        }
    }


    /**
     * Save Favourite
     * @param favourite
     * @return {@link Response}
     * @throws Exception
     */
    @PostMapping(  )
    @Operation(summary = "Save Favourite",
        tags = {"Favourite"},
        description = "Save Favourite",
        responses = {
            @ApiResponse(description = "Favourite", content = @Content(schema = @Schema(implementation = Favourite.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response add(@Parameter(description = "Favourite object to be saved",required = true) @Valid @RequestBody Favourite favourite) throws Exception {


        // set audit details: created and updated at values
        favourite.setAuditValues();

        // save Favourite
        Favourite savedFavourite = favouriteRepository.save(favourite);

        // Check if the returned object is not null
        if (null != savedFavourite) {

            // Set Favourite as entity in response object
            return Response.ok().entity(savedFavourite).build();

        } else {
            // Handle where Favourite is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Favourite not fod");
        }
    }


    /**
     * update Favourite
     * @param favourite
     * @return {@link Response}
     * @throws Exception
     */
    @PutMapping (value = "/{favouriteId}"  )
    @Operation(summary = "Update Favourite",
        tags = {"Favourite"},
        description = "Update Favourite",
        responses = {
            @ApiResponse(description = "Favourite", content = @Content(schema = @Schema(implementation = Favourite.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response update(
        @Parameter(description = "ID of Favourite that needs to be updated", required = true)  @Valid @PathVariable("favouriteId") String favouriteId,
        @Parameter(description = "Favourite object to update",required = true) @Valid @RequestBody Favourite favourite) throws Exception {

        // set Favourite
        favourite.setId(favouriteId);


        // set audit details: created and updated at values
        favourite.setAuditValues();

        // updated Favourite
        Favourite favouriteSaved = favouriteRepository.save(favourite);

        // Check if the returned object is not null
        if (null != favouriteSaved) {

            // Set Favourite as entity in response object
            return Response.ok().entity(favouriteSaved).build();

        } else {
            // Handle where Favourite is not save - most probably due to bad request
            throw new ApiException(Response.Status.BAD_REQUEST.getStatusCode(), "Favourite not fod");
        }
    }

    /**
     * Returns all favourite:  TODO: ADD PAGINATION
     * @return {@link Response}
     * @throws Exception
     */
    @GetMapping(   )
    @Operation(summary = "Returns all favourite",
        tags = {"Favourite"},
        description = "Returns all favourite ",
        responses = {
            @ApiResponse(description = "Favourite", content = @Content(schema = @Schema(implementation = Favourite.class))),
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Authorization information is missing or invalid."),
            @ApiResponse(responseCode = "5XX", description = "Unexpected error."),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "405", description = "Validation exception")
        })
    public Response retrieveAll() throws Exception {

        // Retrieve all favourite
        List<Favourite> favourites = favouriteRepository.findAll();

        // Check if the returned object is not null
        if (null != favourites) {

            // Set Favourite as entity in response object
            return Response.ok().entity(favourites).build();

        } else {
            // Handle where Favourite is not provided
            throw new ApiException(404, "Favourite not found");
        }
    }

}

