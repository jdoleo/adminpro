import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.models';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public usuarioService: UsuarioService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
        .subscribe( resp => this.cargarUsuarios());
  }

  mostarModal( id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe( (resp: any) => {

      console.log(resp);
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });

  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuario(termino)
        .subscribe((usuarios: Usuario[]) => {
          this.usuarios = usuarios;
          this.cargando = false;
        });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire('No puede borrar usuario', 'No se puede borrara si mismo', 'error');
      return;
    }

    Swal.fire(
      {
        title: '¿Estas seguro?',
        text: 'Esta a punto de borrar a' + usuario.nombre,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }
    ).then(borrar => {
      console.log(borrar);

      if (borrar) {
        this.usuarioService.borrarUsuario( usuario._id)
        .subscribe( borrado => {
          console.log(borrado);
          this.cargarUsuarios();
        });

      }
    });
  }

  guardarUsuario( usuario: Usuario) {
    this.usuarioService.actualizarUsuario( usuario )
    .subscribe();
  }

}
