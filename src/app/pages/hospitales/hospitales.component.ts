import { Component, OnInit } from '@angular/core';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { HospitalService } from '../../services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[];
  cargando: boolean = false;
  totalRegistros: number = 0;

  constructor(public hospitalService: HospitalService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion
        .subscribe( resp => this.cargarHospitales());
  }

  mostarModal( id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  buscarHospital( termino: string ) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this.hospitalService.buscarHospital(termino)
        .subscribe((hospitales: Hospital[]) => {
          this.hospitales = hospitales;
          this.cargando = false;
        });
  }

  crearHospital() {
    // const swalWithBootstrapButtons = Swal.mixin({
    //   customClass: {
    //     confirmButton: 'btn btn-success',
    //     cancelButton: 'btn btn-danger'
    //   },
    //   buttonsStyling: false,
    // });

    Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (hospital: string) => {

        if ( !hospital || hospital.length === 0 ) {
          return;
        }

        this.hospitalService.crearHospital(hospital)
        .subscribe( () => this.cargarHospitales());
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  }

  cargarHospitales() {

    this.cargando = true;

    this.hospitalService.cargarHospitales()
    .subscribe( (resp: any) => {

      console.log(resp);
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }

  guardarHospital( hospital: Hospital ) {
    this.hospitalService.actualizarHospital( hospital )
    .subscribe();
  }

  borrarHospital( hospital: Hospital ) {
    Swal.fire(
      {
        title: '¿Estas seguro?',
        text: 'Esta a punto de borrar a' + hospital.nombre,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }
    ).then(borrar => {
      console.log(borrar);

      if (borrar) {
        this.hospitalService.borrarHospital( hospital._id)
        .subscribe( borrado => {
          console.log(borrado);
          this.cargarHospitales();
        });
      }
    });
  }

}
