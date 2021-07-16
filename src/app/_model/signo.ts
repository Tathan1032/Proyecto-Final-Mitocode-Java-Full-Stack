import { Paciente } from "./paciente";

export class Signo {
    idSigno: number;
    fecha: string;
    temperatura: string;
    pulso: string;
    ritmo: string;
    paciente: Paciente;
}