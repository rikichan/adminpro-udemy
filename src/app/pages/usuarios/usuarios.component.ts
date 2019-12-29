import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';

import { fromEvent } from 'rxjs';
import { map, debounceTime, tap } from 'rxjs/operators';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

// import swal from 'sweetalert';

declare var swal: any;

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

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion.subscribe(resp => this.cargarUsuarios());

    const input = document.getElementById('buscarUsuario');
    fromEvent(input, 'input')
      .pipe(
        tap(() => this.cargando = true),
        // Tomamos las letras ingresadas en el input
        map((k: KeyboardEvent) => {
          return k.target['value'];
        }),
        // Seleccionamos un tiempo en milisegundos antes de continuar la ejecución luego de que se presionó la última letra, si hay cambios en el input vuelve a empezar a contar
        debounceTime(1500),
        // Ahora si ejecutamos la busqueda del usuario con el total de letras en el input
        // luego de que se dejara de escribir por 1,5 segundos
      ).subscribe(val => {
        if (val !== '') {
          this._usuarioService.buscarUsuarios(val)
            .subscribe((usuarios: Usuario[]) => {
              this.usuarios = usuarios;
              this.cargando = false;
            });
        } else {
          this.cargarUsuarios();
          return;
        }
      });
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde)
      .subscribe((resp: any) => {

        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;

      });
  }

  cambiarDesde(valor: number) {

    let desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios()

  }


  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title: '¿Estas seguro?',
      text: `Esta a punto de borrar ${usuario.nombre}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((borrar) => {

        console.log(borrar)
        if (borrar) {
          this._usuarioService.borrarUsuario(usuario._id)
            .subscribe((borrado: boolean) => {
              console.log(borrado);

              this.totalRegistros--;

              if (this.desde === this.totalRegistros) {
                this.desde -= 5;
              }

              this.cargarUsuarios();
            });
        }
      });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
      .subscribe();

  }


  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  // buscarUsuario(termino: string) {
  //   if (termino.length <= 0) {
  //     this.cargarUsuarios();
  //     return;
  //   }

  //   this.cargando = true;

  //   this._usuarioService.buscarUsuarios(termino)
  //     .subscribe((usuarios: Usuario[]) => {

  //       this.usuarios = usuarios;
  //       this.cargando = false;

  //     });
  // }



}
