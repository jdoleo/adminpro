import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.models';
import Swal from 'sweetalert2';



declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor(
    public router: Router,
    public usuarioSerivce: UsuarioService ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || ''; // Si no encuentra el Key email le pondra blanco ('')

    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }
  }

  // Inicialización del plugin de google
  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '482054463652-c0u1lnskvirfg8ckbmtjqd3rpd6aphgq.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));

    });
  }

  attachSignin( element ) {

    this.auth2.attachClickHandler( element, {}, (googleUser) => {
       // const profile = googleUser.getBasicProfile();
       // console.log(profile);
       const token = googleUser.getAuthResponse().id_token;

       this.usuarioSerivce.loginGoogle( token )
       .subscribe( () => window.location.href = '#/dashboard');

       console.log( token );

    });
  }

  ingresar( forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this.usuarioSerivce.login( usuario, forma.value.recuerdame )
                       .subscribe( correcto => {
                        this.router.navigate(['/dashboard']);
                       }
                      //  , err => {
                      //    Swal.fire('Login Error', err.error.mensaje, 'error' );
                      //  }
                       );

    // console.log(forma.valid);
    // console.log(forma.value);
    // this.router.navigate([ '/dashboard' ]);
  }

}
