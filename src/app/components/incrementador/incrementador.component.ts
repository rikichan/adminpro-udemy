import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: ['./incrementador.component.css']
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') textProgress: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChanges(newValue: number) {

    // Vanilla JS
    // let elemHTML: any = document.getElementsByName('progreso')[0]; // el getElemntsByName me devuelve o es un array



    if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    // elemHTML.value = this.progreso;

    this.textProgress.nativeElement.value = this.progreso;

    this.cambioValor.emit(this.progreso);

  }

  cambiarValor(valor: number) {

    if (this.progreso >= 100 && valor > 0) {
      this.progreso = 100
      return
    }

    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      return
    }

    this.progreso = this.progreso + valor;

    this.cambioValor.emit(this.progreso);


    // asignar el foco luego de imitir el evento... se activa el input
    this.textProgress.nativeElement.focus();
  }



}
