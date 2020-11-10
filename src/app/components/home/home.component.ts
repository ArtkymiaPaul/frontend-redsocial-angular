import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public title:string;

  constructor() {
    this.title = "Bienvenido a Red Social";
   }

  ngOnInit(): void {
    console.log("Se ha cargado componente home");
  }

}
