import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Signo } from 'src/app/_model/signo';
import { SignoService } from 'src/app/_service/signo.service';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { MatDialog } from '@angular/material/dialog';
import { PacienteDialogoComponent } from '../paciente-dialogo/paciente-dialogo.component';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();
  signo : Signo;

  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;

  constructor(
    private signoService: SignoService,
    private pacienteService: PacienteService,
    public route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.signo = new Signo();

    this.form = new FormGroup( {
      'id' : new FormControl(0),
      pacienteActual: new FormControl(''),
      fecha: new FormControl(new Date()),
      'pulso' : new FormControl(''),
      'ritmo' : new FormControl(''),
      'temperatura' : new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    });

    if(!this.edicion){

      this.pacienteService.getPacienteCambio().subscribe(data => {
        
        this.listarPacientes();

      }); 

      this.pacienteService.getPacienteActualCambio().subscribe(paciente => {

        this.pacienteSeleccionado = paciente;

        this.form = new FormGroup( {
          'id' : new FormControl(0),
          pacienteActual: new FormControl(paciente),
          fecha: new FormControl(new Date()),
          'pulso' : new FormControl(''),
          'ritmo' : new FormControl(''),
          'temperatura' : new FormControl('')
        });
        
      });

    }
      
  }

  initForm() {

    if (this.edicion) {

      this.signoService.listarPorId(this.id).subscribe(data => {

        let id = data.idSigno;
        this.pacientes.push(data.paciente);
        this.pacienteSeleccionado = data.paciente
        let fecha = data.fecha;
        let pulso = data.pulso;
        let ritmo = data.ritmo;
        let temperatura = data.temperatura;

        this.form = new FormGroup({

          'id': new FormControl(id),
          pacienteActual : new FormControl(this.pacienteSeleccionado),
          fecha: new FormControl(fecha),
          'pulso': new FormControl(pulso),
          'ritmo': new FormControl(ritmo),
          'temperatura' : new FormControl(temperatura)
          
        });
      });
    }
    else{

      this.listarPacientes();

    }

  }

  listarPacientes() {

    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
    
  }

  operar() {

    this.signo.idSigno = this.form.value['id'];
    this.signo.paciente = this.pacienteSeleccionado;
    this.signo.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    this.signo.pulso = this.form.value['pulso'];
    this.signo.ritmo = this.form.value['ritmo'];
    this.signo.temperatura = this.form.value['temperatura'];

    if (this.signo != null && this.signo.idSigno > 0) {
      
      this.signoService.modificar(this.signo).pipe(switchMap(() => {
        return this.signoService.listar();
      })).subscribe(data => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio("SE MODIFICÓ EL SIGNO VITAL.");
      });

    } else {

      this.signoService.registrar(this.signo).pipe(switchMap(() => {
        return this.signoService.listar();
      })).subscribe(data => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio("SE REGISTRÓ EL SIGNO VITAL.");
      });

    }

    this.router.navigate(['/pages/signo']);
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  abrirDialogo(paciente?: Paciente) {

    this.dialog.open(PacienteDialogoComponent, {
      width: '250px',
      data: paciente
    });

  }

}
