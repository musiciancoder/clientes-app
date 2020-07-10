import {Component, OnInit} from '@angular/core';
import {Factura} from './models/factura';
import {ClienteService} from '../clientes/cliente.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import {FacturaService} from './services/factura.service';
import {Producto} from './models/producto';
import {ItemFactura} from './models/item-factura';
import {MatAutocompleteSelectedEvent} from '@angular/material';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'

})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl(); //unido a los input del formulario
  productosFiltrados: Observable<Producto[]>;

  constructor(private  clienteService: ClienteService,
              private facturaService: FacturaService,
              private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => { //obtiene de la url los siguientes parametros...
      let clienteId = +params.get('clienteId'); //..id (configurado en path en app.module.ts
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : []) // cuando hagamos click en el input para que tire un erray vacio la segunda vez que hacemos click y borre lo que ya estaba
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined { //para mostrar el nombre del producto que hemos seleccionado en la casilla html
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void { //para que lo que hemos escrito en el html se reconozca como item en la factura y poder asi mostrar toda la linea (Producto, precio, cantidad, total) en el html
    let producto = event.option.value as Producto; //pasamos lo que se escibe en formulario a producto
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue(''); //volvemos a dejar en vacio
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;

      }
      return item;
    });
  }

  existeItem(id: number): boolean { //preguntar si el item que estamos seleccionando ya esta seleccionado con anterioridad
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void { // incrementa cantidad de ese tipo de item en la factura
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad; // item.cantidad = item.cantidad +1

      }
      return item;
    });
  }

}
