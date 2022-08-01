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

module.exports = {
  siteMetadata: {
    title: 'ADMAI',
    description: 'Accelerated Decision Making with Artificial Intelligence',
    keywords: 'policy,ai,malaria,interventions,worldwide,tracker, decision-making, decision',
  },
  pathPrefix: `/accelerated-decision-making-with-ai`,
  plugins: [
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Carbon Design Gatsby Theme',
        short_name: 'Gatsby Theme Carbon',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#0062ff',
        display: 'browser',
      },
    },
    {
      resolve: 'gatsby-theme-carbon',
      options: {
        mediumAccount: 'carbondesign',
        // repository: {
        //   baseUrl:
        //     'https://github.com/IBM/accelerated-decision-making-with-ai',
        //   subDirectory: '/Website',
        //   branch: 'main',
        // },
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
          trackingId: 'UA-175179057-1',
          anonymize: true,
      },
    },
  ],
};
