import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {UserService} from '../../services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { User } from 'src/app/models/user';
import { Publication } from 'src/app/models/publication';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PublicationService } from 'src/app/services/publication.service';
import { ActivatedRoute, Router } from '@angular/router';
import {UploadService} from '../../services/upload.service';

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
  public filesToUpload: Array<File>;

  //output
  @Output() sended = new EventEmitter();

  constructor(
    private userService:UserService,
    private publicationService:PublicationService,
    private uploadService:UploadService,
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

  onSubmit(event){
    this.publicationService.addPublication(this.token, this.newPubForm.value)
    .subscribe(
      response=>{
        if(response.publication){
          //this.publication = response.publication;
          
          

          if(this.filesToUpload && this.filesToUpload.length){
            //Subir Imagen
            this.uploadService.makeFileRequest(`${this.url}/upload-image-pub/${response.publication._id}`,[],this.filesToUpload,this.token,'image')
            .then((result:any)=>{
              this.status = "success";
              this.publication.file = result.image;
              this.newPubForm.reset();
              this._router.navigate(['/timeline']);
              this.sended.emit({send:'true'});
            });
          }else{
            this.status = "success";
            this._router.navigate(['/timeline']);
            this.newPubForm.reset();
            this.sended.emit({send:'true'});
          }
          
          
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

  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;

  }

  sendPublication(event){
    this.sended.emit({send:'true'});
  }

}
