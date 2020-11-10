import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {UserService} from '../../services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { User } from 'src/app/models/user';
import { Publication } from 'src/app/models/publication';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PublicationService } from 'src/app/services/publication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'rs-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public newPubForm: FormGroup;
  public identity:User;
  public token:string;
  public stats:JSON;
  public url:string;
  public status:string;
  public publication:Publication;

  //output
  @Output() sended = new EventEmitter();

  constructor(
    private userService:UserService,
    private publicationService:PublicationService,
    private _route:ActivatedRoute,
    private _router:Router
  ) { 
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.stats = this.userService.getStats();
    this.url = GLOBAL.url;
    this.publication = {
      _id:"",
      text:"",
      file:null,
      created_at:"",
      user:this.identity._id
    }
  }

  ngOnInit(): void {
    this.newPubForm = new FormGroup({
      text: new FormControl(null,Validators.required),
      created_at: new FormControl(null),
      _id: new FormControl(null),
      file: new FormControl(null)
    });
    this.newPubForm.patchValue(this.publication);
    console.log('Sidebar', "Componente sidebar fue cargado");
    console.log('form', this.newPubForm.value);
  }

  onSubmit(){
    this.publicationService.addPublication(this.token, this.newPubForm.value)
    .subscribe(
      response=>{
        if(response.publication){
          this.publication = response.publication;
          this.status = "success";
          this.newPubForm.reset();
          this._router.navigate(['/timeline']);
        }else{
          this.status = "error";
        }
      },
      error=>{
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    )
  }

  sendPublication(event){
    this.sended.emit({send:'true'});
  }

}
