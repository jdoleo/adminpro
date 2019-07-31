import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital: Hospital;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService
  ) {
    this.token = localStorage.getItem('token');
  }

  cambiarImagen( archivo: File, id: string ) {

    this.subirArchivoService.subirArchivo( archivo, 'hospitales', id )
    .then( (resp: any) => {

      this.hospital.img = resp.hospital.img;
      Swal.fire('Imagen Actualizada', this.hospital.nombre, 'success');

      // this.guardarStorage( id, this.token, this.hospital );
    })
    .catch( resp => {
      console.log( resp );
    });

  }

  cargarHospitales() {
    const url = URL_SERVICIOS + '/hospital';
    return this.http.get(url);
  }

  obtenerHospital(	id:	string	) {
    const url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url);
  }

  borrarHospital(	id:	string	) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url )
    .pipe(map( resp => {
      Swal.fire('Hospital borrado', 'El hospital a sido borrado correctamente de la base de datos','success');
      return true;
    }));

  }

  crearHospital(	nombre:	string	) {
    const url = URL_SERVICIOS + '/hospital?token=' + this.token;
    return this.http.post( url, { nombre } )
    .pipe(map( (resp: any) => {
      Swal.fire('Hospital creado', nombre, 'success');
      return resp.hospital;
    }));

  }

  buscarHospital(	termino:	string	) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get( url )
    .pipe(map( (resp: any) => resp.hospitales ));
  }

  actualizarHospital(	hospital:	Hospital	) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this.token;

    return this.http.put( url, hospital).pipe(map( (resp: any) => {
      Swal.fire('Hospital actualizado', hospital.nombre, 'success');
      return true;
    }));
  }

}
