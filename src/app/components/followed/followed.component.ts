import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import {User} from '../../models/user';
import {Follow} from '../../models/follow';
import {UserService} from '../../services/user.service';
import {FollowService} from '../../services/follow.service';

@Component({
  selector: 'rs-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css']
})
export class FollowedComponent implements OnInit {
  public title:string;
  public identity:User;
  public token:string;
  public url:string;
  public followUserOver:string;
  public page:number;
  public next_page:number;
  public prev_page:number;
  public total: number;
  public pages:number;
  public users:User[];
  public status:string;
  public follows:string[];
  public followed;
  public userPageId;
  public user: User;

  constructor(
    private service:UserService,
    private followService:FollowService,
    private _route:ActivatedRoute,
    private _router:Router
  ) { 
    this.title = "Seguidores de";
    this.url = GLOBAL.url;
    this.identity = this.service.getIdentity();
    this.token = this.service.getToken();
    this.followUserOver = "";
  }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage(){
    this._route.params.subscribe(params => {
      let userId = params['id'];
      this.userPageId =  userId;
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
      

      console.log('prev_page',this.prev_page);
      console.log('next_page',this.next_page);
      this.getUser(userId, page);
    });
  }

  getFollows(id:string, page:number){
    this.followService.getFollowed(this.token,id,page).subscribe(
      response=>{
        if(!response.follows){
          this.status = "error";
        }else{
          console.log(response);
          
          this.total = response.total;
          this.followed = response.follows;
          this.pages = response.pages;
          this.follows = response.users_following;
          console.log(this.follows);
          if(page > this.pages){
            this._router.navigate(['/gente',1]);
          }
          
        }
      },
      error =>{
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    );
  }

  

  mouseEnter(user_id:string){
    this.followUserOver = user_id;
  }

  mouseLeave(user_id){
    this.followUserOver = "";
  }

  followUser(followed){
    let follow:Follow;
    follow = {
      _id : "",
      user: this.identity._id,
      followed
    };

    this.followService.addFollow(this.token, follow)
    .subscribe(
      response =>{
        if(!response.follow){
          this.status = 'error';
        }else{
          this.status = 'success';
          this.follows.push(followed);
        }
      },
      error=>{
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    );

  }

  unfollowUser(followed){
    this.followService.deleteFollow(this.token, followed)
    .subscribe(
      response =>{
        let search = this.follows.indexOf(followed);
        if(search != -1){
          this.follows.splice(search,1);
        }
      },
      error=>{
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    );
  }

  getUser(id:string,page:number = 1){
    this.service.getUser(id)
    .subscribe(
      response=>{
        if(response.user){
          this.user = response.user;
          //Devolver listado de usuarios
          this.getFollows(id, page);
        }else{
          this._router.navigate(['/home']);
        }
        
      },
      error=>{
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    );
  }
}
