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

const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
if (!process.env.MAPBOX_API_KEY) {
    console.error('All the required environment variables were not provided!');
    process.exit(-1);
 }

const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   mapbox_api_key: "${process.env.MAPBOX_API_KEY}",
   identityServiceUrl: '',
   swaggerDocsUrl: '',
   taskClerkServiceUrl: '',
   AVAILABLE_ADMIN1_GEOJSON: ['KEN', 'UGA', 'TZA'],
   AVAILABLE_ADMIN1_ISO2_GEOJSON: ['US']
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
        console.log(err);
   } else {
        console.log(`Wrote variables to ${targetPath}`);
   }
});
