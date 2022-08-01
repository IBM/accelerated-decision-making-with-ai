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

import {Injectable, Injector} from '@angular/core';
import {StoreService} from '../store/store.service';
import {Observable} from 'rxjs';
import {User} from '../../models';
import {pluck} from 'rxjs/operators';
import {Router} from '@angular/router';
import {STORE_KEY_LOGIN_TIME, STORE_KEY_TOKEN, STORE_KEY_TOKEN_EXPIRATION_TIME, STORE_KEY_USER} from '../../constants';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private injector: Injector,
              private storeService: StoreService) { }

  /**
   * Get the current user.
   *
   * @example
   * ``` typescript
   *
   * ```
   *
   * @returns   Returns an observable object of the current user.
   */
  public getCurrentUser(): Observable<User> {
    return this.storeService.changes.pipe(pluck(STORE_KEY_USER));
  }

  /**
   * Check if the JWT token of the current user has expired.
   *
   * @example
   * ``` typescript
   *
   * ```
   *
   * @returns   Returns if the JWT is has expired.
   */
  public isTokenExpired(): boolean {
    const expire = this.storeService.state.tokenExpirationTime;
    if (expire) {
      return expire * 1000 <= Date.now();
    } else {
      return true;
    }
  }

  public getToken() {
    const token = this.storeService.state.token;
    if (token) {
      return token;
    }
    return null;
  }

  public processToken() {
    const token = this.getToken();
    if (!isNotNullOrUndefined(token)) {
      const errorMessage = 'Token is undefined';
      this.clearSession(errorMessage);
    }

    const expired = this.isTokenExpired();
    if (expired) {
      const errorMessage = 'Token has expired';
      this.clearSession(errorMessage);
    }
  }

  /**
   * Clear the current session
   *
   * @param error Error message
   */
  public clearSession(error?: string) {
    const router = this.injector.get(Router);
    this.storeService.delete(STORE_KEY_USER);
    this.storeService.delete(STORE_KEY_LOGIN_TIME);
    this.storeService.delete(STORE_KEY_TOKEN);
    this.storeService.delete(STORE_KEY_TOKEN_EXPIRATION_TIME);
    this.storeService.clear();
    if (error) {
      const  queryParams = { queryParams: { error } };
      router.navigate(['login'], queryParams );
    } else {
      router.navigate(['login'] );
    }
  }

  /**
   *
   * @param user Logged in user
   * @param token JWT token
   * @param tokenExpirationTime Time when token expires
   */
  public processLogin(user: User, token: any, tokenExpirationTime: number) {
    this.storeService.update(STORE_KEY_USER, user);
    this.storeService.update(STORE_KEY_LOGIN_TIME, Date.now());
    this.storeService.update(STORE_KEY_TOKEN, token);
    this.storeService.update(STORE_KEY_TOKEN_EXPIRATION_TIME, tokenExpirationTime);
  }

  public getUserRole(accessTokenPayload: any): any {
    const admaiScopeId = 'admai_';
    const admaiScopes = accessTokenPayload.scope;
    return admaiScopes.split(' ').find(admaiScope => {
      return admaiScope.indexOf(admaiScopeId) !== -1;
    });
  }

  public canActivate(): boolean {
    let error = null;
    let canActivate = true;

    const token = this.getToken();
    if (!isNotNullOrUndefined(token)) {
      // error = 'Token is undefined';
      canActivate = false;
    }

    const expired = this.isTokenExpired();
    if (canActivate && expired) {
      error = 'Token has expired';
      canActivate = false;
    }

    if (!canActivate) {
      this.clearSession(error);
    }
    return canActivate;
  }
}

