import { Pipe, PipeTransform, PACKAGE_ROOT_URL } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/img';

    if ( !img ) {
      return url + '/usuarios/xxx'; // para que muestre la pimage de No Image
    }

    if ( img.indexOf('https') >= 0) {
      return img;
    }

    switch ( tipo ) {

      case 'usuario':
         url += '/usuarios/' + img;
         break;

        case 'medico':
             url += '/medicos/' + img;
             break;

        case 'hospital':
            url += '/hospitales/' + img;
            break;
        default:
          console.log('Tipo de imagten no existe: usuario, medico, hospital');
          url += '/usuarios/xxx';
    }

    return url;
  }

}
