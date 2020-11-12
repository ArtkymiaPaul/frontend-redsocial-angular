import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'rs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  public title:string;
  public message:Message;
  public identity:User;
  public token:string;
  public url:string;
  public status:string;
  public follows;
  public formAdd:FormGroup;

  constructor(
    private messageService:MessageService,
    private followService:FollowService,
    private _route: ActivatedRoute,
    private _router:Router,
    private userService:UserService
  ) {
    this.identity = userService.getIdentity();
    this.url = GLOBAL.url;
    this.token = userService.getToken();
    this.title = "Enviar mensaje";
   }

  ngOnInit(): void {
    console.log("Se ha cargado el componente add");
    this.formAdd = new FormGroup({
      text: new FormControl(null, Validators.required),
      receiver: new FormControl(null)
    });
    this.getMyFollows();
  }

  getMyFollows(){
    this.followService.getMyFollows(this.token)
    .subscribe(
      response=>{
        this.follows = response.follows;
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  onSubmit(){
    this.messageService.addMessage(this.token, this.formAdd.value)
    .subscribe(
      response=>{
        if(response.message){
          this.status = "success";
          this.formAdd.reset();
        }
      },
      error=>{
        this.status = "error";
        console.log(<any>error);
      }
    );
  }

}
