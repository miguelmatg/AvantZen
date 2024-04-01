import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from '../../partials/board/board.component';

@Component({
  selector: 'app-game-template',
  standalone: true,
  imports: [RouterOutlet, BoardComponent],
  templateUrl: './game-template.component.html',
  styleUrl: './game-template.component.scss',
})
export class GameTemplateComponent {
  roomName: string = 'Nombre de la sala';
}
