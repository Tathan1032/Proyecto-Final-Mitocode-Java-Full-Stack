import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Signo } from '../_model/signo';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignoService extends GenericService<Signo>{

  private signoCambio: Subject<Signo[]> = new Subject<Signo[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor( protected http: HttpClient ) { 

    super(http,  `${environment.HOST}/signos`);    

  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignoCambio(){
    return this.signoCambio.asObservable();
  }

  setSignoCambio(lista: Signo[]){
    this.signoCambio.next(lista)
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje)
  }

}