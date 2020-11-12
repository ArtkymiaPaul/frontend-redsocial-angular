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
  selector: 'rs-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css']
})
export class SendedComponent implements OnInit {
  public title:string;
  public message:Message;
  public identity:User;
  public token:string;
  public url:string;
  public status:string;
  public messages:Message[];
  public formAdd:FormGroup;
  public page:number;
  public pages:number;
  public total:number;
  public  next_page:number;
  public prev_page:number;

  constructor(
    private messageService:MessageService,
    private followService:FollowService,
    private _route: ActivatedRoute,
    private _router:Router,
    private userService:UserService
  ) {
    this.title = "Mensajes enviados";
    this.identity = userService.getIdentity();
    this.url = GLOBAL.url;
    this.token = userService.getToken();
    this.page = 1;
    this.next_page =1;
    this.prev_page = 1;
   }

  ngOnInit(): void {
    console.log("Se ha cargado el componente sended");
    this.actualPage();
  }

  getMessages(token:string, page:number){
    this.messageService.getEmmitMessages(token,page)
    .subscribe(
      response=>{
        if(response.messages){
          this.messages = response.messages;
          this.total = response.total;
          this.pages = response.pages;
        }
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  actualPage(){
    this._route.params.subscribe(params => {
      let userId = params['id'];
      let page:number = params['page'];
      this.page = page;

      if(!params['page']){
        this.page = 1;
      }
      this.next_page = Number(this.page)+ Number(1);
      this.prev_page = this.page-1;
      
      if(this.prev_page <= 0){
        this.prev_page = 1;
      }
      

      this.getMessages(this.token, this.page);
    });
  }

}
