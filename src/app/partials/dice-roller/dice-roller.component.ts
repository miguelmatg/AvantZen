import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dice-roller',
  standalone: true,
  imports: [],
  templateUrl: './dice-roller.component.html',
  styleUrl: './dice-roller.component.scss',
})
export class DiceRollerComponent {
  rolling: boolean = false;
  animationDuration: number = 2000; // Duración de la animación en milisegundos
  result: number = 0;
  seeResultTime: number = 2000;

  @Output() eventRoll = new EventEmitter<number>();

  rollDice() {
    this.rolling = true;

    // Simula un tiempo de espera antes de mostrar el resultado
    setTimeout(() => {
      this.result = Math.floor(Math.random() * 6) + 1;

      setTimeout(() => {
        this.eventRoll.emit(this.result);

        this.rolling = false;
        this.result = 0;
      }, this.seeResultTime);
    }, this.animationDuration);
  }
}
