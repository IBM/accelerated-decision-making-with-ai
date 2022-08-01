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

import React from 'react';
import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
import HomepageTemplate from 'gatsby-theme-carbon/src/templates/Homepage';
import homepageStyles from './Homepage.module.scss';

import Carbon from '../../images/banner-image.png';

const FirstLeftText = () => <p>Accelerated Decision Making with AI </p>;

const FirstRightText = () => (
  <p>
      Our team has proposed, and begun work demonstrating the capability of Machine Learning in the optimization of the models produced by domain experts, beginning first with an application from the Malaria Modeling Community.
      Harnessing our platform for execution of models at scale with trust and transparency, we have already demonstrated that for a region in western Kenya, the published results for a recommended intervention policy should be re-considered as they appear to be inferred from a local optimum in the policy space.
  </p>
);

const BannerText = () => (
    <div className={homepageStyles.homepageBannerTextContainer}>
        <h2 className={homepageStyles.homepageBannerText}>Accelerated Decision Making with AI
            <span className={homepageStyles.homepageBannerTextAbbreviation}></span>
        </h2>
    </div>
);

const customProps = {
  Banner: <HomepageBanner renderText={BannerText} image={Carbon} />,
  FirstCallout: (
    <HomepageCallout
      backgroundColor="#061f80"
      color="white"
      leftText={FirstLeftText}
      rightText={FirstRightText}
    />
  ),
  SecondCallout: null,
};

// spreading the original props gives us props.children (mdx content)
function ShadowedHomepage(props) {
  return <HomepageTemplate {...props} {...customProps} />;
}

export default ShadowedHomepage;
