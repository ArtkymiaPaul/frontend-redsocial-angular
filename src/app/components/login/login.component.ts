import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'rs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm:FormGroup;
  public title:string;
  private email_pattern: RegExp;
  public status:string;
  public identity:any;
  public token:any;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private service:UserService
  ) { 
    this.title = "Identificate";
    this.email_pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(this.email_pattern)]),
      password: new FormControl(null,Validators.required)
    });
  }

  onSubmit():void{
    //loguear al usuario y conseguir sus datos
    this.service.signup(this.loginForm.value)
    .subscribe(
      response =>{
        this.identity = response.user;
        console.log('identity',this.identity);
        if(!this.identity || !this.identity._id){
          this.status = "error";
        }else{
          //Persistir datos del usuarios
          localStorage.setItem('identity',JSON.stringify(this.identity));
          //Conseguir el token
          this.getToken();
        }
        
      },
      error =>{
        let errorMessage = <any>error;
        if(errorMessage != null){
          this.status = "error";
        }
      }
    );
  }

  getToken(){
    this.service.signup(this.loginForm.value, 'true')
    .subscribe(
      response =>{
        this.token = response.token;
        console.log('token',this.token);
        if(this.token.length <= 0){
          this.status = "error";
        }else{
          //Persistir token del usuario
          localStorage.setItem('token',this.token);
          //Conseguir los contadores o estadisticas del usuario
          this.getCounters();
          
        }
        
      },
      error =>{
        let errorMessage = <any>error;
        if(errorMessage != null){
          this.status = "error";
        }
      }
    );
  }

  getCounters(){
    this.service.getCounters()
    .subscribe(
      response =>{
        localStorage.setItem('stats',JSON.stringify(response));
        this.status = "success";
        if(response.following.length <= 0){

        }
        this._router.navigate(['/']);
      },
      error=>{
        console.error('getCounters',error);
      }
    );
  }

}
