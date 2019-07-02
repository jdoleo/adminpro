import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.models';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp;

  constructor( public usuarioService: UsuarioService ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar( usuario: Usuario) {

    this.usuario.nombre = usuario.nombre;

    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }

    this.usuarioService.actualizarUsuario( this.usuario ).subscribe();

  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  cambiarImagen() {

    this.usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );

  }

}
