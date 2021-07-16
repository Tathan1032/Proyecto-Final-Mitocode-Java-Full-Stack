import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Rol } from 'src/app/_model/rol';
import { MenuService } from 'src/app/_service/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  rol: Rol[];
  nombreRol: string;
  nombreUsuario: string;

  constructor( private menuService: MenuService ) { }

  ngOnInit(): void {

    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    const helper = new JwtHelperService();

    let decodedToken = helper.decodeToken(token);

    this.nombreUsuario = decodedToken.user_name;

    this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {

      data.forEach(menu => this.rol = menu.roles);
      
      this.rol.forEach( rol => this.nombreRol = this.nombreRol != null ? this.nombreRol + " - " + rol.descripcion : rol.descripcion )

    });

  }

}
