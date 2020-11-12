import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import {User} from '../../models/user';
import {Follow} from '../../models/follow';
import {UserService} from '../../services/user.service';
import {FollowService} from '../../services/follow.service';

@Component({
  selector: 'rs-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public title:string;
  public user:User;
  public status:string;
  public identity: User;
  public token:string;
  public stats:JSON;
  public url;
  public followed:boolean;
  public following:boolean;
  public followUserOver:string;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private userService:UserService,
    private followService:FollowService,

  ) { 
    this.title = "Perfil",
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.following = false;
    this.followed = false;
  }

  ngOnInit(): void {
    console.log("Cargado el componente Profile");
    this.loadPage();
  }

  loadPage(){
    this._route.params
    .subscribe( params =>{
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    }
    );
  }

  getUser(id:string){
    this.userService.getUser(id)
    .subscribe(
      response => {
        if(response.user){
          console.log(response);
          this.user = response.user;

          if(response.following && response.following._id){
            this.following = true;
          }else{
            this.following = false;
          }

          if(response.followed && response.followed._id){
            this.followed = true;
          }else{
            this.followed = false;
          }


        }else{
          this.status = "error";
        }
      },
      error=>{
        console.log(<any>error);
        this._router.navigate(['/perfil',this.identity._id]);
      }
    );
  }

  getCounters(id:string){
    this.userService.getCounters(id)
    .subscribe(
      response =>{
        console.log('counters',response);
        this.stats = response;
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  followUser(followed){
    let follow:Follow;
    follow = {
      _id:null,
      user: this.identity._id,
      followed
    };
    this.followService.addFollow(this.token,follow)
    .subscribe(
      response=>{
        this.following = true;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  unfollowUser(followed){
    this.followService.deleteFollow(this.token,followed)
    .subscribe(
      response=>{
        this.following = false;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  mouseEnter(user_id){
    this.followUserOver = user_id;
  }

  mouseLeave(){
    this.followUserOver = "";
  }

}
