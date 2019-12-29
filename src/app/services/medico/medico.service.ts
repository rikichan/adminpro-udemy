import { Injectable } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }


  cargarMedicos(desde: number = 0) {
    let url = `${URL_SERVICIOS}/medico?desde=${desde}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalMedicos = resp.total;
        return resp.medicos;
      }
      ));
  }

  buscarMedico(termino: string) {
    let url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;
    return this.http.get(url).pipe(
      map((resp: any) => resp.medicos));
  }

  borrarMedico(id: string) {
    let url = `${URL_SERVICIOS}/medico/${id}?token=${this._usuarioService.token}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        swal('Médico borrado', 'El médico ha sido eliminado correctamente', 'success');
        return true;
      }));
  }

  guardarMedico(medico: Medico) {
    let url = `${URL_SERVICIOS}/medico`;

    if (medico._id) {
      // Actualiza
      url += `/${medico._id}?token=${this._usuarioService.token}`;
      return this.http.put(url, medico)
        .pipe(
          map((resp: any) => {
            swal('Médico actualizado', medico.nombre, 'success');
            return resp.medico;
          }));
    }
    else {
      // creando
      url += `?token=${this._usuarioService.token}`;
      return this.http.post(url, medico).pipe(
        map((resp: any) => {
          swal('Médico creado', medico.nombre, 'success');
          return resp.medico;
        }));
    }
  }

  cargaMedico(id: string) {
    let url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => resp.medico));
  }

}
