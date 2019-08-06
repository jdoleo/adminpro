import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ModalUploadService } from '../components/modal-upload/modal-upload.service';


import {
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  AdminGuard,
  LoginGuardGuard,
  SubirArchivoService,
  MedicoService
 } from './service.index';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    AdminGuard,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadService,
    MedicoService
  ]
})
export class ServiceModule { }
