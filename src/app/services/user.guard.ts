import { Injectable } from '@angular/core';
import {Router,CanActivate} from '@angular/router';
import { identity } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {

    constructor(
        private _router:Router,
        private userService:UserService
    ){

    }

    canActivate(){
        let identity:User = this.userService.getIdentity();

        if(identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')){
            return true;
        }else{
            this._router.navigate(['/login']);
            return false;
        }
    }
}
