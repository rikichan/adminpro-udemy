import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {



    // primera forma de llamar a la promesa
    // promesa.then(
    //   () => console.log('Termino!'),
    //   () => console.log('Error')
    // );

    // segunda forma promesa
    // promesa.then(
    //   // () => console.log('Termino!') sin parametro menaje...OK del resolve
    //   mensaje => console.log('Termino!', mensaje)
    // ).catch(error => console.error('error en la prmesa', error));

    this.contarTres().then(
      mensaje => console.log('Termino!', mensaje)
    ).catch(error => console.error('error en la prmesa', error));


  }

  ngOnInit() {
  }

  contarTres(): Promise<boolean> {

    return new Promise((resolve, reject) => {

      let contador = 0;

      let intervalo = setInterval(() => {

        contador += 1;
        console.log(contador);

        if (contador === 3) {
          resolve(true);
          // reject('dio error');
          clearInterval(intervalo);
        }

      }, 1000);

    });

  }

}
