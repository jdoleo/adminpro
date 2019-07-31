import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  cargando: boolean = false;

  constructor(
    public medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {

    this.medicoService.cargarMedicos().subscribe(medicos => this.medicos = medicos );

  }

  buscarMedico(termino: string) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedico( termino )
        .subscribe( medicos => this.medicos = medicos);
  }

  borrarMedico( medico: Medico) {
    this.medicoService.borrarMedico(medico._id)
        .subscribe( () => this.cargarMedicos() );
  }


}
