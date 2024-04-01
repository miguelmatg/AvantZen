export interface Settings {
  turnDuration: number; // En segundos
  totalSquares: number;
  specialSquares: number; // Debe ser multiplo de 5 (por cada tipo de casilla, sin contar las normales)
  iaPlayers: number;
  pjPlayers: number;
  isPrivate: boolean;
  password: string | null;
}

export interface BoardSquare {
  typeSquare: String; // Normales - AvantZen - BatallZen - RetroZen SuertZen
  function: Function;
}

export interface Game {
  settings: Settings;
  board: BoardSquare[];
  players: Player[];
  salaID: string;
}

export interface Player {
  IA: Boolean;
  nickName: string;
  pieceColor: string;
  squardPosition: number;
  positionX: number;
  positionY: number;
}

export interface HTML_Squard {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Functions {
  TipoBatalla: {
    Dados: Function;
    Bully: Function;
    Trivial: Function;
  };
  TipoSuertZen: {
    Ruleta: Function;
    DadoExtra: Function;
    TurnoExtra: Function;
  };
  TipoRetroZen: {
    Ruleta: Function;
    DadoExtra: Function;
    TurnoExtra: Function;
  };
  TipoAvantZen: {
    Ruleta: Function;
    DadoExtra: Function;
    TurnoExtra: Function;
  };
}

export interface SpecialTurn {
  active: boolean;
  title: string;
  description: string;
}

export interface Versus {
  nickName: string;
  result: number;
}

export interface Config {
  settings: Settings;
  players: Player[];
}
