import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rs-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public title:string;

  constructor() { 
    this.title = "Registrate";
  }

  ngOnInit(): void {
    console.log('Componente de register cargado.....');
  }
}
