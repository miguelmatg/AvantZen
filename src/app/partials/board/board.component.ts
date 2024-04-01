import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  BoardSquare,
  Config,
  Game,
  Player,
  Settings,
  SpecialTurn,
  Versus,
} from './board.interface';
import { CSS_PROPERTIES, TypeSquare } from './board.enum';
import { DiceRollerComponent } from '../dice-roller/dice-roller.component';
import { SettingsComponent } from '../settings/settings.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DiceRollerComponent, SettingsComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, AfterViewInit {
  @Input() private readonly settings: Settings = {} as Settings;

  game: Game = {} as Game;
  startTime = 3;
  turnPlayer: number = 0;
  currentPlayer: Player = {} as Player;
  result: any;
  transitionTime: number = CSS_PROPERTIES.ANIMATION_TIME;
  movingPiece: boolean = false;

  TypeSquare = TypeSquare;

  specialTurn: SpecialTurn = {
    active: false,
    title: '',
    description: '',
  };

  versus: Versus[] = [];
  inBattle: boolean = false;
  battleTurn: number = 0;

  loadedGame: boolean = false;
  // Posicionar jugadores
  // Comenzar partida

  constructor(private elementRef: ElementRef) {}
  // Cargar las opciones del tablero y los jugadores
  ngOnInit(): void {
    this.showModalByID('settings');
  }

  ngAfterViewInit() {
    const boardDiv = this.elementRef.nativeElement.querySelector('.board');

    // Observar las mutaciones en el div "board"
    const observer = new MutationObserver((mutationsList) => {
      // Verificar si las mutaciones incluyen los elementos deseados
      const elementsAdded = mutationsList.some(
        (mutation) => mutation.addedNodes.length > 0
      );

      // Si se han agregado elementos, ejecutar la función
      if (elementsAdded) {
        this.formatSquares();
        // Desconectar el observador para evitar fugas de memoria
        observer.disconnect();
      }
    });

    // Configurar y empezar a observar las mutaciones en el div "board"
    observer.observe(boardDiv, { childList: true, subtree: true });
  }

  // Al cambiar el tamaño se recalculan las posiciones
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (this.loadedGame) {
      this.formatSquares();
    }
  }

  // Crea el tablero con las opciones por defecto
  async createBoard(config: Config) {
    // Peticion a la API
    this.httpRequestDemo(config).then((game) => {
      this.loadedGame = true;
      this.game = game;
    });
  }

  // Carga los jugadores con una cuenta atrás cuando se ha terminado de cargar el tablero
  init(config: Config) {
    this.closeModalByID('settings');

    // Dibujar tablero
    this.createBoard(config).then(async () => await this.countDown());
  }

  // Cuenta atrás e inicio del juego
  async countDown() {
    const dialog = document.getElementById('countdown-container');

    if (dialog) dialog.style.display = 'block';

    const interval = setInterval(async () => {
      this.startTime--;

      if (this.startTime <= 0) {
        clearInterval(interval);
        await this.startGame();
      }
    }, 1000);
  }

  // Inicio del juego
  async startGame() {
    this.changePlayerTurn();
    const dialog = document.getElementById('countdown-container');

    if (dialog) dialog.style.display = 'none';

    this.newTurn();
  }

  // Cambia el jugador actual con el turno que exista
  async changePlayerTurn() {
    this.currentPlayer = this.game.players[this.turnPlayer];
  }

  // Activa la animación del turno y abre la modal del nuevo turno
  newTurn() {
    this.movingPiece = false;
    this.openTurnModal();
  }

  // Abre la modal del turno
  openTurnModal() {
    const dialog: any = document.getElementById('your-turn');
    dialog.showModal();
  }

  // Cuando se obtiene el resultado del dado, se cierra la modal, se mueve al jugador y da comienzo al siguiente turno
  async setResult(event: number) {
    const dialog: any = document.getElementById('your-turn');
    dialog.close();

    this.movePlayerTo(event);
  }

  async setResultRetroZen(event: number) {
    this.closeModalByID(TypeSquare.RetroZen);

    this.movePlayerTo(event * -1);
  }

  // Se desactiva la animación de turno (parpadeo)
  // Espera a que termine la animación de mover el jugador
  // Cambia de jugador y comienza el nuevo turno
  nextTurn() {
    this.movingPiece = true;

    this.result = 0;

    this.nextPlayer();

    this.changePlayerTurn();
    this.newTurn();
  }

  // Pasa al siguiente jugador, si no hay más, vuelve al primero
  nextPlayer() {
    this.turnPlayer =
      this.turnPlayer + 1 >= this.game.players.length ? 0 : this.turnPlayer + 1;
  }

  // Mueve el jugador actual las posiciones pasadas y formatea las fichas
  async movePlayerTo(positions: number) {
    const index = this.getIndexByNick(this.currentPlayer.nickName);

    this.movingPiece = true;

    var movePositions = positions;

    if (this.game.players[index].squardPosition + positions < 0) {
      this.game.players[index].squardPosition = 0;
    } else if (
      this.game.players[index].squardPosition + positions >
      this.game.board.length
    ) {
      this.game.players[index].squardPosition = this.game.board.length - 1;
    } else {
      this.game.players[index].squardPosition += movePositions;
    }

    await this.formatSquares();
    setTimeout(async () => {
      // Ejecutar funcion de la casilla
      await this.game.board[this.game.players[index].squardPosition].function();
    }, this.transitionTime * 1000);
  }

  // Formatea las fichas
  // Las coloca en el centro de la casilla
  async formatSquares() {
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
      const square = squares[position.squard];
      const squareOpts = square.getBoundingClientRect();

      var { x, y, width, height } = squareOpts;
      const maxWidth = width + x - CSS_PROPERTIES.border;
      x += CSS_PROPERTIES.border;
      y += CSS_PROPERTIES.border;

      var rigth = 0;
      var bottom = 0;

      position.el.forEach((player: any, index: number) => {
        let indexPlayer = this.getIndexByNick(player.nickName);

        if (index > 0) {
          if (x + CSS_PROPERTIES.playerW * 2 < maxWidth) {
            x += CSS_PROPERTIES.playerW;
          } else {
            x = squareOpts.x + CSS_PROPERTIES.border;
            y += CSS_PROPERTIES.playerH;
          }
        }

        this.game.players[indexPlayer].positionX = x;
        this.game.players[indexPlayer].positionY = y;

        if (rigth < x) rigth = x;
        if (bottom < x) bottom = y;
      });

      // Obtener el final de las casillas
      var endXSquare = squareOpts.x + squareOpts.width;
      var endYSquare = squareOpts.y + squareOpts.height;

      // Restar un borde, el otro lo cuenta del inicio
      endXSquare -= CSS_PROPERTIES.border;
      endYSquare -= CSS_PROPERTIES.border;

      // Sumar el ancho de la ficha, ya que tanto la x como la y es del inicio
      const piecesX = rigth + CSS_PROPERTIES.playerW;
      const piecesY = bottom + CSS_PROPERTIES.playerH;

      // Calcular diferencia y dividir entre dos para obtener la mitad
      const plusX = (endXSquare - piecesX) / 2;
      const plusY = (endYSquare - piecesY) / 2;

      // Sumar las posiciones para posicionarlas en la mitad
      position.el.forEach((player: any) => {
        let indexPlayer = this.getIndexByNick(player.nickName);

        this.game.players[indexPlayer].positionX += plusX;
        this.game.players[indexPlayer].positionY += plusY;
      });
    });
  }

  // Obtiene el index del jugador a través de su nick
  getIndexByNick(nickName: string) {
    return this.game.players.findIndex(
      (player) => player.nickName === nickName
    );
  }

  // Simula la obtencion de las reglas del juego con las settings generadas
  async httpRequestDemo(config: Config): Promise<Game> {
    let board: BoardSquare[] = [];

    // Añadir las casillas
    const start: BoardSquare = {
      typeSquare: TypeSquare.Start,
      function: this.getSpecialSquare(TypeSquare.Start),
    };
    const normal: BoardSquare = {
      typeSquare: TypeSquare.Normal,
      function: this.getSpecialSquare(TypeSquare.Normal),
    };
    const finish: BoardSquare = {
      typeSquare: TypeSquare.Finish,
      function: this.getSpecialSquare(TypeSquare.Finish),
    };

    // Añadir las casillas normales
    board = board.concat(
      Array(
        config.settings.totalSquares - config.settings.specialSquares - 2
      ).fill(normal)
    );

    // Calcular casillas especiales por tipo, hay 4 tipos
    const specialSquares = config.settings.specialSquares / 4;

    // Añadir casillas de avance
    for (let i = 0; i < specialSquares; i++) {
      board = board.concat({
        typeSquare: TypeSquare.AvantZen,
        function: this.getSpecialSquare(TypeSquare.AvantZen),
      });
    }

    // Añadir casillas de batalla
    for (let i = 0; i < specialSquares; i++) {
      board = board.concat({
        typeSquare: TypeSquare.BatallZen,
        function: this.getSpecialSquare(TypeSquare.BatallZen),
      });
    }

    // Añadir casillas de retroceso
    for (let i = 0; i < specialSquares; i++) {
      board = board.concat({
        typeSquare: TypeSquare.RetroZen,
        function: this.getSpecialSquare(TypeSquare.RetroZen),
      });
    }

    // Añadir casillas de suerte
    for (let i = 0; i < specialSquares; i++) {
      board = board.concat({
        typeSquare: TypeSquare.SuertZen,
        function: this.getSpecialSquare(TypeSquare.SuertZen),
      });
    }

    board = this.shuffle(board);

    // Añadir casillas de inicio y fin
    board.unshift(start);
    board.push(finish);

    return {
      board,
      settings: config.settings,
      players: this.shuffle(config.players),
      salaID: 'prueba',
    };
  }

  // Nuevo turno para retroceder
  retroZen() {
    this.specialTurn.active = true;
    this.specialTurn.title = `!${TypeSquare.RetroZen}¡`;
    this.specialTurn.description =
      'Lanza el dado y retrocede las casillas del numero que salga';

    this.showModalByID(TypeSquare.RetroZen);
  }

  battleZen_dado_select_opp() {
    this.specialTurn.active = true;
    this.specialTurn.title = `!${TypeSquare.BatallZen}¡`;
    this.specialTurn.description =
      'Selecciona un oponente, quien lance el dado con el numero más alto avanzará las casillas correspondientes.';

    this.versus = [{ nickName: this.currentPlayer.nickName, result: 0 }];

    this.showModalByID(TypeSquare.BatallZen);
  }

  selectOpponent(nickName: string) {
    this.versus.length = 1;
    this.versus.push({ nickName, result: 0 });
  }

  setResultVersus(tirada: number, player: number) {
    this.versus[player].result = tirada;

    if (this.battleTurn + 1 < this.versus.length) {
      this.battleTurn++;
    } else {
      // Mostrar ganador de la batalla
      setTimeout(() => {
        const winner = this.versus.reduce((max, current) => {
          return current.result > max.result ? current : max;
        });

        const indexPlayer = this.getIndexByNick(winner.nickName);

        this.currentPlayer = this.game.players[indexPlayer];

        this.movePlayerTo(winner.result);

        this.resetBattleZen_dado_select_opp();
      }, this.transitionTime * 1000);
      // Sumarle las casillas
      // Pasar de turno
    }
  }

  // Finaliza la batalla y reinicia los parametros
  resetBattleZen_dado_select_opp() {
    this.versus = [];
    this.inBattle = false;
    this.battleTurn = 0;

    this.closeModalByID(TypeSquare.BatallZen);

    this.newTurn();
  }

  finalBattle() {
    this.specialTurn.active = true;
    this.specialTurn.title = `!${TypeSquare.Finish}¡`;
    this.specialTurn.description =
      '¡Batalla Final! Juegate la victoria contra el jugador que va en ultima posición';

    // Copiar el array de jugadores antes de ordenarlo
    const playersCopy = [...this.game.players];

    // Ordenar la copia del array de jugadores por la posición squardPosition
    playersCopy.sort((a, b) => b.squardPosition + a.squardPosition);

    console.log(playersCopy);

    const player = playersCopy[0];

    this.versus = [
      { nickName: this.currentPlayer.nickName, result: 0 },
      { nickName: player.nickName, result: 0 },
    ];

    this.showModalByID(TypeSquare.Finish);
  }

  setResultFinalBattle(tirada: number, player: number) {
    this.versus[player].result = tirada;

    if (this.battleTurn + 1 < this.versus.length) {
      this.battleTurn++;
    } else {
      // Si gana el de la posicion 0, termina el juego
      const winner = this.versus.reduce((max, current) => {
        return current.result > max.result ? current : max;
      });
      if (this.versus[0].nickName === winner.nickName) {
        console.log('Ha ganado la partida');
      } else {
        setTimeout(() => {
          const indexPlayer = this.getIndexByNick(winner.nickName);

          this.currentPlayer = this.game.players[indexPlayer];

          this.movePlayerTo(winner.result);

          this.resetBattleZen_dado_select_opp();
        }, this.transitionTime * 1000);
      }
    }
    // Si no, le cuenta las posiciones al otro
  }

  // Abre el dialog por el nombre de la casilla especial
  showModalByID(modalName: string) {
    const id = `dialog_${modalName}`;
    const dialog: any = document.getElementById(id);
    dialog.showModal();
  }

  // Cierra el dialog por el nombre de la casilla especial
  closeModalByID(modalName: string) {
    const id = `dialog_${modalName}`;
    const dialog: any = document.getElementById(id);
    dialog.close();
  }

  // Obtiene las funciones de forma aleatoria para cada casilla por su tipo
  getSpecialSquare(specialSquare: string): Function {
    const dados_vs_select = () => {
      this.battleZen_dado_select_opp();
    };
    const bully = () => {
      this.nextTurn();
    };
    const trivial = () => {
      this.nextTurn();
    };
    const ruleta = () => {
      this.nextTurn();
    };
    const dadoExtra = () => {
      this.nextTurn();
    };

    const turnoRetrocede = () => {
      this.retroZen();
    };

    const turnoExtra = () => {
      this.specialTurn.active = true;
      this.specialTurn.title = '¡Turno Extra!';
      this.specialTurn.description = '¡Obtienes un turno extra!';

      this.newTurn();
    };

    const finishBattle = () => {
      this.finalBattle();
    };

    const passTurn = () => {
      this.nextTurn();
    };

    const functions: any = {
      Start: [passTurn],
      Normal: [passTurn],
      BatallZen: [dados_vs_select],
      SuertZen: [dados_vs_select, turnoRetrocede, turnoExtra],
      RetroZen: [turnoRetrocede],
      AvantZen: [turnoExtra],
      Finish: [finishBattle],
    };

    if (!specialSquare) return passTurn;

    const random = Math.floor(Math.random() * functions[specialSquare].length);
    const key = Object.keys(functions[specialSquare])[random];

    return functions[specialSquare][key];
  }

  // Mezcla cualquier array
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

  // Funciones de casillas especiales
}
