import { Component, OnInit } from '@angular/core';
import {FacturaService} from './services/factura.service';
import {Factura} from './models/factura';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'

})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo: string = 'Factura';

  constructor(private facturaService: FacturaService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => { // obtener el id de la ruta (sin llamada al backend)
      let id = +params.get('id');
      this.facturaService.getFactura(id).subscribe(factura => this.factura = factura);

    });
  }

}
