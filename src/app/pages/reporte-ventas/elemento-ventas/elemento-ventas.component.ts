import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-elemento-ventas',
  templateUrl: './elemento-ventas.component.html',
  styleUrls: ['./elemento-ventas.component.css']
})
export class ElementoVentasComponent implements OnInit {

  //Variables
  periodo: string="Anuales";
  

  constructor() { 

  }

  ngOnInit() {
    
  }

}
