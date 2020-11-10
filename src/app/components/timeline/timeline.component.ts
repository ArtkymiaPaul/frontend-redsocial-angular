import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Publication} from '../../models/publication';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';
import { User } from 'src/app/models/user';
import { PublicationService } from 'src/app/services/publication.service';

declare let $:any;
@Component({
  selector: 'rs-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  public identity:User;
  public token:string;
  public title:string;
  public status:string;
  public page:number;
  public url:string;
  public total:number;
  public pages:number;
  public noMore:boolean
  public itemsPerPage:number;
  public publications:Publication[];

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private userService:UserService,
    private publicationService:PublicationService
  ) {
    this.title= "Timeline";
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
    this.noMore = false;
   }

  ngOnInit(): void {
    console.log("Timeline cargado correctamente");
    this.getPublications(this.page);
  }

  getPublications(page:number, adding:boolean = false){
    this.publicationService.getPublications(this.token, page)
    .subscribe(
      response=>{
        if(response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.itemsPerPage;

          if(!adding){
            this.publications = response.publications;
          }else{
            let arrayA = this.publications;
            let arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
            $("html, body").animate({
              scrollTop: $('body').prop("scrollHeight")
            },500);
          }


          if(page > this.pages){
            //this._router.navigate(['/home']);
          }
        }else{
          this.status="error";
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

  viewMore(){
    
    this.page ++;
    this.getPublications(this.page,true);
    if(this.publications.length == this.total){
      this.noMore = true;
    }
    
  }

  refresh(event){
    this.page = 1;
    this.noMore = false;
    this.getPublications(this.page);
  }

}
