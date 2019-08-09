import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) {}

  canActivate(): Promise<boolean> | boolean {

    const token = this.usuarioService.token;
    const payload = JSON.parse( atob( token.split('.')[1] ));

    const expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva( payload.exp );
  }

  verificaRenueva( fechaExp: number): Promise<boolean> {
    return new Promise( (resolve, reject) => {

      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      // 1 Horas, 60 Minutos, 60 Sec * 1000 Ms (Tiempo que falta para que el token expire)
      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000) );

      if (tokenExp.getTime() > ahora.getTime() ) {
        resolve( true);
      } else {
        this.usuarioService.renuevaToken()
            .subscribe( () => {
              resolve( true );
            }, () => {
              this.router.navigate(['/login']);
              reject( false );
            });
      }

    });

  }

  expirado( fechaExp: number) {
    const ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }
  }
}
