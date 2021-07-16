import { Component, Inject, OnInit } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoService } from 'src/app/_service/signo.service';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente: Paciente;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService,
    private signoService: SignoService,
  ) { }

  ngOnInit(): void {

    this.paciente = { ...this.data }

  }

  operar() {

    this.pacienteService.registrar(this.paciente).subscribe(() => {

      this.pacienteService.listar().subscribe(data => {

        this.pacienteService.setPacientecambio(data);
        this.pacienteService.setPacienteActualCambio(this.paciente);
        this.signoService.setMensajeCambio("SE REGISTRÓ. POR FAVOR SELECCIONE EL NUEVO PACIENTE.");
        
      });
    });
    
    this.cerrar();
  }

  cerrar() {

    this.dialogRef.close();
    
  }

}
