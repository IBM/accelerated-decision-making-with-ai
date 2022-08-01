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

import {AppComponent} from './app/app.component';
import {HomeComponent} from './home/home.component';
import {ChartComponent} from './chart/chart.component';
import {MapComponent} from './map/map.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {LoaderComponent} from './loader/loader.component';
import {SimpleMapComponent} from './simple-map/simple-map.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';

export * from './app/app.component';
export * from './home/home.component';
export * from './chart/chart.component';
export * from './map/map.component';
export * from './confirm-dialog/confirm-dialog.component';
export * from './loader/loader.component';
export * from './simple-map/simple-map.component';
export * from './login/login.component';
export * from './logout/logout.component';

export const COMPONENT_DECLARATIONS = [
  AppComponent,
  HomeComponent,
  ChartComponent,
  MapComponent,
  ConfirmDialogComponent,
  LoaderComponent,
  SimpleMapComponent,
  LoginComponent,
  LogoutComponent,
];

export const ENTRY_COMPONENT_DECLARATIONS = [
  ConfirmDialogComponent
];
