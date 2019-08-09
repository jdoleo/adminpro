import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.models';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[];

  constructor(public activatedRoute: ActivatedRoute, public http: HttpClient) {

    activatedRoute.params.subscribe(params => {
      this.buscar(params.termino);
    });

  }

  ngOnInit() {
  }

  buscar(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.http.get( url )
    .subscribe( (resp: any) => {

      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;
      this.usuarios = resp.usuarios;
    });

  }

}
