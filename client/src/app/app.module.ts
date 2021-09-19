//modulos de angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from "./material.module";
import { FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//componentes y modulos base
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { PanelComponent } from './components/panel/panel.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ViewAcademicComponent } from './components/view-academic/view-academic.component';
import { ViewReportsComponent } from './components/view-reports/view-reports.component';
import { ViewElectionsComponent } from './components/view-elections/view-elections.component';
import { ViewManagementComponent } from './components/view-management/view-management.component'

//sub componentes
import { ObservationsForm } from './components/view-academic/view-academic.component';
import { GradesTableComponent } from './components/view-reports/grades-table/grades-table.component';
import { GraphBehaviourComponent } from './components/view-reports/graph-behaviour/graph-behaviour.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PanelComponent,
    ViewProfileComponent,
    ViewAcademicComponent,
    ViewReportsComponent,
    ViewElectionsComponent,
    ViewManagementComponent,
    ObservationsForm,
    GradesTableComponent,
    GraphBehaviourComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
