import { AfterViewInit, Component, HostListener, Input } from '@angular/core';
import {
  BoardSquare,
  Game,
  HTML_Squard,
  Player,
  Settings,
} from './board.interface';
import { CSS_PROPERTIES, TypeSquare } from './board.enum';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements AfterViewInit {
  @Input() private readonly settings: Settings = {} as Settings;

  game: Game = {} as Game;

  ngAfterViewInit() {
    this.createBoard().then(() => this.init());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.printPlayers();
  }

  async createBoard() {
    // Las settings se envian al servidor y este responde con el tablero rellenado
    const settings: Settings = {
      turnDuration: 30,
      totalSquares: 50,
      specialSquares: 20,
      iaPlayers: 1,
      pjPlayers: 2,
      isPrivate: false,
      password: null,
    };

    // Peticion a la API
    this.httpRequestDemo(settings).then((game) => {
      this.game = game;
    });
  }

  init() {
    window.addEventListener('load', () => {
      // Cargar jugadores

      this.loadPlayers();
    });
  }

  loadPlayers() {
    const players: Player[] = [
      {
        IA: false,
        nickName: 'miguelmatg',
        pieceColor: '#3498DB',
        squardPosition: 9,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'Federico de Albacete',
        pieceColor: '#F4D03F',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'aitortilla',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'aitortilla2',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'aitortilla3',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'aitortilla4',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'aitortilla5',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'aitortilla6',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
      {
        IA: false,
        nickName: 'aitortilla7',
        pieceColor: '#F39C12',
        squardPosition: 0,
        positionX: 0,
        positionY: 0,
      },
    ];

    this.game.players = players;

    this.printPlayers();
  }

  printPlayers() {
    this.game.players.forEach((player, index) => {
      const element =
        document.getElementsByClassName('board-square')[player.squardPosition];
      const { x, y, width, height } = element.getBoundingClientRect();
      const casilla: HTML_Squard = { x, y, width, height };
      this.movePlayerTo(index, casilla);
    });
  }

  movePlayerTo(playerIndex: number, position: HTML_Squard) {
    // Calcular coordenadas del centro de la casilla

    const centerX =
      position.x + position.width / 2 - CSS_PROPERTIES.playerW / 2;
    const centerY =
      position.y + position.height / 2 - CSS_PROPERTIES.playerH / 2;

    // Mover al centro de la casilla
    this.game.players[playerIndex].positionX = centerX;
    this.game.players[playerIndex].positionY = centerY;

    this.formatSquares();

    // Calcular la posicion que quede libre
    // var posx = centerX;
    // var posy = centerY;

    // // Obtener los jugadores que existan en esa posicion
    // const playersOnPosition = this.game.players.filter((player) => {
    //   return (
    //     player.positionX === posx &&
    //     player.positionY === posy &&
    //     player.nickName !== this.game.players[playerIndex].nickName
    //   );
    // });

    // if (playersOnPosition.length === 0) {
    //   this.game.players[playerIndex].positionX = posx;
    //   this.game.players[playerIndex].positionY = posy;
    //   return;
    // }

    // // Comprobar si la primera posicion existe
    // var positioned = false;
    // var dir = ['der', 'arr', 'izq', 'abj'];
    // var func: { [key: string]: Function } = {
    //   der: (x: number, y: number): { x: number; y: number } => {
    //     x = x + CSS_PROPERTIES.playerW + CSS_PROPERTIES.space;
    //     return { x, y };
    //   },
    //   arr: (x: number, y: number): { x: number; y: number } => {
    //     y = y - CSS_PROPERTIES.playerH - CSS_PROPERTIES.space;
    //     return { x, y };
    //   },
    //   izq: (x: number, y: number): { x: number; y: number } => {
    //     x = x - CSS_PROPERTIES.playerW - CSS_PROPERTIES.space;
    //     return { x, y };
    //   },
    //   abj: (x: number, y: number): { x: number; y: number } => {
    //     y = y + CSS_PROPERTIES.playerH + CSS_PROPERTIES.space;
    //     return { x, y };
    //   },
    // };

    // while (!positioned) {

    //   // Comprobar si la siguiente posición a la derecha es válida, si no, poner abajo de la primera

    // }

    // var currentPosition = 0;
    // var lap = 1;
    // var repeated = 0;

    // while (!positioned) {
    //   console.log(playerIndex, lap, currentPosition);
    //   if (currentPosition > 3) {
    //     // Se hace una vuelta
    //     lap++;
    //     // Si ya se ha repetido, volver a hacer la vuelta
    //     if (lap >= repeated) currentPosition = 0;
    //   }

    //   const { x, y } = func[dir[currentPosition]](posx, posy);

    //   posx = x;
    //   posy = y;

    //   // Si no existe nada en esta posicion asignar, si no, continuar
    //   const exist = this.game.players.filter((player) => {
    //     return (
    //       player.positionX === posx &&
    //       player.positionY === posy &&
    //       player.nickName !== this.game.players[playerIndex].nickName
    //     );
    //   });

    //   if (exist.length == 0) {
    //     positioned = true;

    //     this.game.players[playerIndex].positionX = posx;
    //     this.game.players[playerIndex].positionY = posy;
    //   }

    //   // Si la vuelta
    //   if (lap >= repeated) {
    //     currentPosition++;
    //   } else {
    //     repeated++;
    //   }
    // }
  }

  formatSquares() {
    // Obtener las posiciones de las casillas en las que hayan jugadores
    const positionsActives = this.game.players.reduce((acc: any, el) => {
      if (acc[el.squardPosition.toString()]) {
        acc[el.squardPosition.toString()].el.push(el);
      } else {
        acc[el.squardPosition.toString()] = {
          squard: el.squardPosition,
          el: [el],
        };
      }

      return acc;
    }, {});

    // Obtener todas las casillas
    const squares = document.getElementsByClassName('board-square');

    Object.values(positionsActives).forEach((position: any) => {
      // Calcular filas y columnas necesarias

      const square = squares[position.squard];
      var { x, y, width, height } = square.getBoundingClientRect();

      const pieceX =
        CSS_PROPERTIES.playerW + CSS_PROPERTIES.space + CSS_PROPERTIES.border;
      const pieceY = CSS_PROPERTIES.playerH;

      const piecesPerRow = Math.floor(width / pieceX);
      const piecesPerColumn = Math.floor(position.el.length / piecesPerRow);

      var player = 0;

      var newY = y + CSS_PROPERTIES.border;
      for (let i = 0; i < piecesPerColumn; i++) {
        var newX = x + CSS_PROPERTIES.space;
        newY += i === 0 ? 0 : pieceY + CSS_PROPERTIES.space;
        for (let l = 0; l < piecesPerRow; l++) {
          let index = this.getIndexByNick(position.el[player].nickName);

          newX += l === 0 ? 0 : pieceX;

          this.game.players[index].positionX = newX;
          this.game.players[index].positionY = newY;

          player++;
        }

        // Volver a x y y*i
      }

      // const objectSize = Math.min(
      //   width / objectsPerRow,
      //   height / objectsPerColumn
      // );
      // console.log(objectSize, objectsPerRow, objectsPerColumn);
    });
  }

  getIndexByNick(nickName: string) {
    return this.game.players.findIndex(
      (player) => player.nickName === nickName
    );
  }

  async httpRequestDemo(settings: Settings): Promise<Game> {
    let board: BoardSquare[] = [];

    // Añadir las casillas normales
    const start: BoardSquare = { typeSquare: TypeSquare.Start };
    const normal: BoardSquare = { typeSquare: TypeSquare.Normal };
    const avantzen: BoardSquare = { typeSquare: TypeSquare.AvantZen };
    const batallzen: BoardSquare = { typeSquare: TypeSquare.BatallZen };
    const retrozen: BoardSquare = { typeSquare: TypeSquare.RetroZen };
    const suertzen: BoardSquare = { typeSquare: TypeSquare.SuertZen };
    const finish: BoardSquare = { typeSquare: TypeSquare.Finish };

    board = board.concat(
      Array(settings.totalSquares - settings.specialSquares - 2).fill(normal)
    );
    board = board.concat(Array(settings.specialSquares / 4).fill(avantzen));
    board = board.concat(Array(settings.specialSquares / 4).fill(batallzen));
    board = board.concat(Array(settings.specialSquares / 4).fill(retrozen));
    board = board.concat(Array(settings.specialSquares / 4).fill(suertzen));

    board = this.shuffle(board);

    board.unshift(start);
    board.push(finish);

    return {
      board,
      settings,
      players: [],
      salaID: 'prueba',
    };
  }

  shuffle<T>(array: T[]): T[] {
    // Copiamos el array para no modificar el original
    const shuffledArray = array.slice();

    // Algoritmo de Fisher-Yates
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }
}
