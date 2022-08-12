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

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import AppID from 'ibmcloud-appid-js';
import { LOGIN_CONSTANTS, SNACK_BAR_LONG_DURATION } from '../../constants';
import { UserService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  appid = new AppID();
  errorStyle = 'hide';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    if (this.userService.isTokenExpired()) {
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {
    try {
      await this.appid.init({
        clientId: 'f7ddf77c-3c32-413d-b532-44ae14440a68',
        discoveryEndpoint:
          'https://us-south.appid.cloud.ibm.com/oauth/v4/480b9852-5f3b-4b89-a624-1a6b8125cf46/.well-known/openid-configuration',
      });
    } catch (e) {
      this.errorMessage = e.message;
      this.errorStyle = 'show';
    }
  }

  async redirectToSSO() {
    try {
      const tokens = await this.appid.signin();
      let userRole = null;
      if (isNotNullOrUndefined(tokens)) {
        userRole = this.userService.getUserRole(tokens.accessTokenPayload);
      }
      if (isNotNullOrUndefined(userRole)) {
        const decodeIDTokens = tokens.idTokenPayload;
        decodeIDTokens['type'] = userRole;
        this.userService.processLogin(
          decodeIDTokens,
          tokens.accessToken,
          decodeIDTokens.exp
        );
      } else {
        this.snackBar.open(
          LOGIN_CONSTANTS.USER_ROLE_MISSING,
          LOGIN_CONSTANTS.CLOSE,
          {
            duration: SNACK_BAR_LONG_DURATION,
          }
        );
      }
      await this.router.navigate(['']);
    } catch (e) {
      this.errorMessage = e.message;
      this.errorStyle = 'show';
    }
  }
}
