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

import com.ibm.pmai.models.core.Location;
import com.ibm.pmai.models.core.LocationData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationDataRepository extends JpaRepository<LocationData, String> {
    List<LocationData> getById(String id);
    List<LocationData> getByLocation_AdminLevelAndExecutorList_IdAndLocation_Country(String adminLevel, String executorId,String country);
    List<LocationData> getByLocation_AdminLevelAndExecutorList_Id(String adminLevel, String executorId);
    List<LocationData> getByLocation_AdminLevel(String adminLevel);
    List<LocationData> getByExecutorList_Id(String executorId);
    List<LocationData> getByLocation_AdminLevelAndExecutorList_IdAndLocation_CountryAndLocation_AdminLevelList_levelName(String adminLevel, String executorId,String country,String levelName);

    List<LocationData> getByLocation_CountryAndExecutorList_Id(String country,String executorId);
    List<LocationData> getByLocation_AdminLevelList_levelNameAndExecutorList_Id(String levelname,String executorId);
    List<LocationData> getByExecutorList_IdAndLocation_CountryAndLocation_AdminLevelList_levelName(String executorId,String country, String levelname);

    List<LocationData> getByLocation_AdminLevelAndExecutorList_IdAndLocation_AdminLevelList_levelName(String adminLevel, String executorId,String levelName);


}
