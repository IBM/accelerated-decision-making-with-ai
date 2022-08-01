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

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { SwaggerUIBundle } from 'swagger-ui-dist';
import {environment} from '../../../../environments/environment';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import { UserService } from 'src/modules/common/services/user/user.service';

@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.scss']
})
export class ApisComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.openApi();
  }

  private openApi() {
    const ui = SwaggerUIBundle({
      dom_id: '#swagger-ui',
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: environment.swaggerDocsUrl + '/api/v3/api-docs',
      operationsSorter: 'alpha',
      requestInterceptor: (request) => {
          let authHeader: string;
          const token = this.userService.getToken();

          if (!this.userService.isTokenExpired() && isNotNullOrUndefined(token)) {
            authHeader = `Bearer ${token}`;
          } else {
            this.userService.clearSession();
          }
          request.headers.Authorization = authHeader;
          return request;
        }
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
