export interface TimeFrame {
  turno: Turno;
  horario_corte: HorarioCorte[];
}

export interface Turno {
  inicio: string;
  fin: string;
}

export interface HorarioCorte {
  horario: string;
  mismo_dia: boolean;
  dia_anterior: boolean;
}
