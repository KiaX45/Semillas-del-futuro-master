import type {concert} from "../../lib/Logic/concerts";
import type {money} from "../../lib/Logic/Buying";

export type Statistic = {
    concierto: concert;
    compradores: money[];
    gananciasTotales: number;
    numeroDeVentas: number;
    numeroDeCompradores: number;
    totalNequi: number;
    totalPSE: number;
    totalTargeta: number;
    totalVipComprados: number;
    totalPlataComprados:number;
    totalGeneralComprados: number;
    totalOroComprados: number;
    conteinerId: string;
}