import { Component, OnInit, DoCheck } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from './models/user';
import {UserService} from './services/user.service';
import {GLOBAL} from './services/global';


@Component({
  selector: 'rs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck{
  public title:string;
  public identity:User;
  public url:string;

  constructor(
    private services:UserService,
    private _route: ActivatedRoute,
    private _router:Router
    ){
      this.title = "Red Social"
      this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this.services.getIdentity();
    console.log('identity-log',this.identity);
  }

  ngDoCheck(){
    this.identity = this.services.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }

}
