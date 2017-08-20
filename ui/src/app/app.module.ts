import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MetadataComponent} from './metadata/metadata.component';
import {JobsService} from "./jobs.service";
import {DashboardComponent} from './dashboard/dashboard.component';
import { HostsComponent } from './hosts/hosts.component';

@NgModule({
  declarations: [
    AppComponent,
    MetadataComponent,
    DashboardComponent,
    HostsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [JobsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
