import { Component, OnInit } from '@angular/core';
import {Factura} from './models/factura';
import {ClienteService} from '../clientes/cliente.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'

})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva Factura';
  factura:Factura= new Factura();

  constructor(private  clienteService: ClienteService,
              private activatedRoute: ActivatedRoute
              ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=>{ //obtiene de la url los siguientes parametros...
      let clienteId = +params.get('clienteId'); //..id (configurado en path en app.module.ts
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente)
    });
  }

}
