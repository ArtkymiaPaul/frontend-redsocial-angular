import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';

@Component({
  selector: 'rs-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  public userEditForm: FormGroup;
  public title:string;
  public identity:User;
  public user:User;
  public token:string;
  public status:string;
  private email_pattern:RegExp;
  public filesToUpload: Array<File>;
  public url:string;

  constructor(
    private service:UserService,
    private imageService: UploadService,
    private _route:ActivatedRoute,
    private _router:Router
  ) { 
    this.title = "Actualizar mis datos";
    this.email_pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    this.user = this.service.getIdentity();
    this.identity = this.user;
    this.token = this.service.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.userEditForm = new FormGroup({
      name: new FormControl(null,Validators.required),
      surname: new FormControl(null,Validators.required),
      nick: new FormControl(null,Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern(this.email_pattern)]),
      _id: new FormControl(null),
      image: new FormControl(null)
    });
    this.userEditForm.patchValue(this.user);
  }

  onSubmit(){
    console.log(this.userEditForm.value);
    this.service.updateUser(this.userEditForm.value)
    .subscribe(
      responde =>{
        if(!responde.user){
          this.status = "error";
        }else{
          this.status = "success";
          localStorage.setItem('identity',JSON.stringify(responde.user));
          this.identity = this.userEditForm.value;
          //Subida de imagen de usuario
          this.imageService.makeFileRequest(`${this.url}/upload-image-user/${this.user._id}`,[],this.filesToUpload,this.token, 'image')
          .then((result:any)=>{
            console.log('image-result',result);
            this.user.image = result.user.image;
            localStorage.setItem('identity',JSON.stringify(this.user));
          });
        }
      },
      error =>{
        let errorMessage = <any>error;
        console.log('Error User-edit',errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    );
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
