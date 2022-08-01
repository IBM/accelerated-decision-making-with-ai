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

package com.ibm.pmai.models.repositories;

import com.ibm.pmai.models.core.Contact;
import com.ibm.pmai.models.core.Executor;
import com.ibm.pmai.models.core.Location;
import com.ibm.pmai.models.core.LocationData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, String> {
    List<Location> getById(String id);
    List<Location> getByAdminLevelAndCountry(String adminLevel, String country);
    List<Location> getByAdminLevel(String adminLevel);
    List<Location> getByAdminLevelAndCountryAndAdminLevelList_levelName(String adminLevel, String country,String levelName);

    List<Location> getByCountry(String country);
    List<Location> getByAdminLevelList_levelName(String levelName);
    List<Location> getByAdminLevelAndAdminLevelList_levelName(String adminLevel, String levelName);
    List<Location> getByCountryAndAdminLevelList_levelName(String country,String levelName);

}
