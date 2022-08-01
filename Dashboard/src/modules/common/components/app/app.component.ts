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

import {AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {ApiService, CacheService, DataService, UserService} from '../../services';
import {Observable} from 'rxjs';
import {User} from '../../models';
import {USER_ROLES} from '../../constants';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
  links = [
    { title: 'Overview', path: '/overview'},
    { title: 'How to', path: '/how-to'},
    { title: 'Feedback', path: '/feedback'},
  ];
  activeNgbNav;
  completedRequestsNotification = {popOverMsg: `<b>Experiments</b><br><a href='/experiments'>ab1234</a><i>`
    + ` completed on Mar 4, 2021 1223hrs EAT</i><br><br><b>Results</b><br><a href='/results'>cd5678</a><i>`
    + ` completed on Mar 4, 2021 0907hrs EAT</i><br><br><b>Models</b><br><i>New malaria model onboarded on Mar 4, 2021 0814hrs EAT, </i>`
    + `<a href='/models'>model</a>`,
    disabledButton: false, noOfNotifications: 3};
  userPop = {msg: ``, icon: ``};
  locationStats = 0;
  modelStats = 0;
  algorithmStats = 0;
  private subscribeLocationStats: any;
  private subscribeModelStats: any;
  private subscribeAlgorithmStats: any;
  private subscribeDomain: any;
  private subscribeAuthenticated: any;

  loggedIn = false;
  user: Observable<User>;
  subscribeUser: any;
  private who: User;

  constructor(public router: Router,
              private cacheService: CacheService,
              private userService: UserService,
              private dataService: DataService,
              private apiService: ApiService,
              private changeDetector: ChangeDetectorRef) {
    this.user = this.userService.getCurrentUser();
    if (!this.userService.isTokenExpired()) {
      this.loggedIn = true;
    }
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        const indexOf = event.url.indexOf('/', 1);
        if (indexOf === -1) {
          const indexOfQueryParams = event.url.indexOf('?', 0);
          if (indexOfQueryParams === -1) {
            this.activeNgbNav = event.url;
          } else {
            this.activeNgbNav = event.url.substring(0, indexOfQueryParams);
          }
        } else {
          this.activeNgbNav = event.url.substring(0, indexOf);
        }
      });
  }
  ngOnInit() {
    if (this.loggedIn) {
      this.loadStats();
    }
    this.subscribeUser = this.user.subscribe(whoami => {
      if (!isNotNullOrUndefined(whoami)) { return; }
      this.who = whoami;
      this.setTabs(whoami.type, '/overview');
      this.apiService.setDomain('covid19');
      // this.router.navigate(['overview']);
      this.userPop = {msg: ``
          + `` + whoami.name + `<br>` + `<hr>`
          + `` + USER_ROLES[whoami.type] + `<br>` + `<hr>`
          + `` + `<a href='/logout'>Log Out</a>` + ``
          + ``, icon: whoami.name.charAt(0).toUpperCase()};
    });
    this.subscribeDomain = this.dataService.domainObservable.subscribe(domain => {
      if (!isNotNullOrUndefined(domain)) { return; }
      const overviewUrl = (domain === 'malaria') ? '/overview' : '/overview';
      this.setTabs(this.who.type, overviewUrl);
      this.router.navigate([overviewUrl]);
      this.apiService.setDomain(domain);
    });
    this.subscribeAuthenticated = this.dataService.authenticatedObservable.subscribe(authenticated => {
      if (!isNotNullOrUndefined(authenticated) || !authenticated) { return; }
      this.loadStats();
    });
  }
  ngOnDestroy() {
    if (this.subscribeLocationStats) {
      this.subscribeLocationStats.unsubscribe();
    }
    if (this.subscribeModelStats) {
      this.subscribeModelStats.unsubscribe();
    }
    if (this.subscribeAlgorithmStats) {
      this.subscribeAlgorithmStats.unsubscribe();
    }
    if (this.subscribeUser) {
      this.subscribeUser.unsubscribe();
    }
    if (this.subscribeDomain) {
      this.subscribeDomain.unsubscribe();
    }
    if (this.subscribeAuthenticated) {
      this.subscribeAuthenticated.unsubscribe();
    }
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  private loadStats() {
    this.subscribeLocationStats = this.cacheService.getLocationStats().subscribe(data => this.locationStats = data);
    this.subscribeModelStats = this.cacheService.getModelStats().subscribe(data => this.modelStats = data);
    this.subscribeAlgorithmStats = this.cacheService.getAlgorithmStats().subscribe(data => this.algorithmStats = data);
  }

  public logout() {
    this.userService.clearSession();
    this.loggedIn = false;
  }

  private setTabs(type: string, overviewUrl: string) {
    this.links = (type === 'admai_admin') ? [
      { title: 'Overview', path: overviewUrl},
      { title: 'Algorithms', path: '/algorithms'},
      { title: 'Models', path: '/models'},
      { title: 'Experiments', path: '/experiments'},
      { title: 'Results', path: '/results'},
      { title: 'Apis', path: '/swagger'},
      { title: 'How to', path: '/how-to'},
      { title: 'Feedback', path: '/feedback'},
    ] : (type === 'admai_ds') ? [
      { title: 'Overview', path: overviewUrl},
      { title: 'Algorithms', path: '/algorithms'},
      { title: 'Models', path: '/models'},
      { title: 'Experiments', path: '/experiments'},
      { title: 'Results', path: '/results'},
      { title: 'Apis', path: '/swagger'},
      { title: 'How to', path: '/how-to'},
      { title: 'Feedback', path: '/feedback'},
    ] : (type === 'admai_ms') ? [
      { title: 'Overview', path: overviewUrl},
      { title: 'Models', path: '/models'},
      // { title: 'Algorithms', path: '/algorithms'},
      { title: 'Experiments', path: '/experiments'},
      { title: 'Results', path: '/results'},
      { title: 'Apis', path: '/swagger'},
      { title: 'How to', path: '/how-to'},
      { title: 'Feedback', path: '/feedback'},
    ] : (type === 'admai_dm') ? [
      { title: 'Overview', path: overviewUrl},
      { title: 'Models', path: '/models'},
      { title: 'Experiments', path: '/experiments'},
      { title: 'Results', path: '/results'},
      { title: 'How to', path: '/how-to'},
      { title: 'Feedback', path: '/feedback'},
    ] : [
      { title: 'Overview', path: overviewUrl},
      { title: 'How to', path: '/how-to'},
      { title: 'Feedback', path: '/feedback'},
    ];
  }
}
