import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';


@NgModule({
  declarations: [MainComponent, AddComponent, ReceivedComponent, SendedComponent],
  imports: [
    CommonModule,
    FormsModule,
    MessageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MomentModule
  ],
  exports:[
    MainComponent, 
    AddComponent, 
    ReceivedComponent, 
    SendedComponent
  ]
})
export class MessageModule { }
