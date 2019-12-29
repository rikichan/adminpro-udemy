import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/service.index';

import { fromEvent } from 'rxjs';
import { map, debounceTime, tap } from 'rxjs/operators';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Hospital } from 'src/app/models/hospital.model';

// import swal from 'sweetalert';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe(() => this.cargarHospitales());

    const input = document.getElementById('buscarHospital');
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
          this._hospitalService.buscarHospital(val)
            .subscribe((hospitales: Hospital[]) => {
              this.hospitales = hospitales;
              this.cargando = false;
            });
        } else {
          this.cargarHospitales();
          return;
        }
      });
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalService.cargarHospitales(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.hospitales = resp.hospitales;
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
    this.cargarHospitales();
  }


  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarUsuario(hospital)
      .subscribe();

  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  borrarHospital(hospital: Hospital) {

    swal({
      title: '¿Estas seguro?',
      text: `Esta a punto de borrar ${hospital.nombre}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((borrar) => {

        console.log(borrar)
        if (borrar) {
          this._hospitalService.borrarHospital(hospital._id)
            .subscribe((borrado: boolean) => {
              this.totalRegistros--;

              if (this.desde === this.totalRegistros) {
                this.desde -= 5;
              }

              this.cargarHospitales();
            });
        }
      });
  }


  crearHospital() {
    swal("Ingrese nombre del hospital:", {
      content: "input",
    })
      .then((hospital: string) => {

        if (!hospital || hospital.length === 0) {
          return;
        }

        this._hospitalService.crearHospital(hospital)
          .subscribe(() => {
            this.cargarHospitales();
            swal(`Hospital creado: ${hospital}`);
          })
      });
  }

}
