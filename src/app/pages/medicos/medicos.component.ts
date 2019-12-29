import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/service.index';
import { Medico } from 'src/app/models/medico.model';
import { fromEvent } from 'rxjs';
import { map, debounceTime, tap } from 'rxjs/operators';
declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  cargando: boolean = false;

  constructor(
    public _medicoService: MedicoService,

  ) { }

  ngOnInit() {
    this.cargarMedicos();

    // this._modalUploadService.notificacion.subscribe(() => this.cargarHospitales());

    const input = document.getElementById('buscarMedico');
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
          this._medicoService.buscarMedico(val)
            .subscribe((medicos: Medico[]) => {
              this.medicos = medicos;
              this.cargando = false;
            });
        } else {
          this.cargando = false;
          this.cargarMedicos();
          return;
        }
      });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    if (desde >= this._medicoService.totalMedicos) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }


  cargarMedicos() {
    this._medicoService.cargarMedicos(this.desde)
      .subscribe(medicos => this.medicos = medicos);
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Estas seguro?',
      text: `Esta a punto de borrar ${medico.nombre}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((borrar) => {
        if (borrar) {
          this._medicoService.borrarMedico(medico._id)
            .subscribe((borrado: boolean) => {
              this._medicoService.totalMedicos--;

              if (this.desde === this._medicoService.totalMedicos) {
                this.desde -= 5;
              }
              this.cargarMedicos();
            });
        }
      });
  }

}
