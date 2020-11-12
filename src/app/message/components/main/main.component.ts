import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rs-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public title:string;

  constructor(

  ) {
    this.title = "Mensajes privados";
   }

  ngOnInit(): void {
    console.log("Se ha cargado el componente main");
  }

}
