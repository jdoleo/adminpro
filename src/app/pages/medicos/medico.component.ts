import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { MedicoService, HospitalService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// ActivatedRoute usado para leer parametros del url o ruta


@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService) {

      activatedRoute.params.subscribe( params => {

        const id = params.id;

        if (id !== 'nuevo') {
          this.cargarMedico( id );
        }

      });
    }

  ngOnInit() {
    this.hospitalService.cargarHospitales()
        .subscribe( (resp: any) => this.hospitales = resp.hospitales );

    this.modalUploadService.notificacion
        .subscribe((resp: any) => {
          console.log(resp);
          this.medico.img = resp.medico.img;
        });
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico( id )
        .subscribe( medico => {

          this.medico = medico;
          this.medico.hospital = medico.hospital._id;
        });

  }

  guardarMedico( f: NgForm ) {

    if ( f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico)
                      .subscribe( medico => {

                      this.medico._id = medico._id;
                      this.router.navigate(['/medico', medico._id]);
                      this.cambioHospital( this.medico.hospital );

                      });
  }

  cambioHospital( id: string ) {
    this.hospitalService.obtenerHospital( id )
        .subscribe( (resp: any) => this.hospital = resp.hospital );

  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);

  }

}
