import { Component, OnInit } from '@angular/core';
import {Factura} from './models/factura';
import {ClienteService} from '../clientes/cliente.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import {FacturaService} from './services/factura.service';
import {Producto} from './models/producto';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'

})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva Factura';
  factura:Factura= new Factura();

  autocompleteControl = new FormControl(); //unido a los input del formulario
  productosFiltrados: Observable<Producto[]>;

  constructor(private  clienteService: ClienteService,
              private facturaService: FacturaService,
              private activatedRoute: ActivatedRoute
              ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=>{ //obtiene de la url los siguientes parametros...
      let clienteId = +params.get('clienteId'); //..id (configurado en path en app.module.ts
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente)
    });
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value=> typeof value ==='string'? value: value.nombre),
        flatMap(value => value? this._filter(value):[]) // cuando hagamos click en el input para que tire un erray vacio la segunda vez que hacemos click y borre lo que ya estaba
      );
  }
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto):string | undefined{
    return producto? producto.nombre: undefined;
  }


}
