import { Component, EventEmitter, Output } from '@angular/core';
import { Config, Player, Settings } from '../board/board.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  @Output() eventStartGame = new EventEmitter<Config>();

  settings: Settings;
  players: Player[] = [];
  newPlayer: Player;

  colors: string[] = [
    '#CD6155',
    '#9B59B6',
    '#2980B9',
    '#1ABC9C',
    '#27AE60',
    '#F1C40F',
    '#E67E22',
    '#145A32',
    '#95A5A6',
    '#34495E',
  ];

  constructor() {
    this.settings = {
      turnDuration: 30,
      totalSquares: 10,
      specialSquares: 4,
      iaPlayers: 0,
      pjPlayers: 3,
      isPrivate: false,
      password: 'password',
    };

    this.newPlayer = {
      IA: false,
      nickName: '',
      pieceColor: this.colors[0],
      positionX: 0,
      positionY: 0,
      squardPosition: 0,
    };

    this.loadPlayers();
  }

  startGame() {
    this.eventStartGame.emit({
      settings: this.settings,
      players: this.players,
    });
  }

  addPlayer() {
    if (!this.newPlayer.nickName) return;

    if (!this.newPlayer.pieceColor) return;

    // Comprobar si el nickname existe
    const existNickName = this.players.filter((player) => {
      return (
        player.nickName.toLowerCase() ===
          this.newPlayer.nickName.toLowerCase() ||
        player.pieceColor === this.newPlayer.pieceColor
      );
    });

    if (existNickName.length > 0) return;

    this.players.push({
      ...this.newPlayer,
    });
    this.resetNewPlayer();
  }

  resetNewPlayer() {
    this.newPlayer.IA = false;
    this.newPlayer.nickName = '';
    this.newPlayer.pieceColor = this.colors[0];
  }

  loadPlayers() {
    this.players = [
      {
        IA: false,
        nickName: 'miguel',
        pieceColor: '#3498DB',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'luisita',
        pieceColor: '#F4D03F',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'lolica',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
    ];

    this.startGame();
  }

  delPlayer(nickName: string) {
    const index = this.players.findIndex(
      (player) => player.nickName === nickName
    );

    if (index >= 0) {
      this.players.splice(index, 1);
    }
  }
}
