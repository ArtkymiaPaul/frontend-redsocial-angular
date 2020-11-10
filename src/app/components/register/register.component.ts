import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'rs-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public title:string;
  public status:string;
  private email_pattern:RegExp;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private service: UserService
  ) { 
    this.title = "Registrate";
    this.email_pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(null,Validators.required),
      surname: new FormControl(null,Validators.required),
      nick: new FormControl(null,Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern(this.email_pattern)]),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit():void{
    if(this.registerForm.valid){
      console.log('Submit', this.registerForm);
      this.service.register(this.registerForm.value)
      .subscribe(
        response => {
          if(response.user && response.user._id){
            this.status = 'success';
            this.registerForm.reset();
          }else{
            this.status = 'error';
          }
        },
        error =>{
          console.log(<any>error);
        }
      );
    }else{
      console.log('Este formulario es invalido');
    }
  }
}
