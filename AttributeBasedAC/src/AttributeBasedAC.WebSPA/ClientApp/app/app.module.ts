import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { studentsComponent } from './components/students/students.component';

import { PrimeComponent } from './components/prime/prime.component';
import { PrivacyComponent } from './components/privacy_access_control/privacy_checking.component';
import { PolicyReviewComponent } from './components/privacy_access_control/policy_review.component';
import { AccessControlPolicyFormCreateComponent } from './components/privacy_access_control/privacy_rule.component';
import { PrivacyPolicyFormCreateComponent } from './components/privacy_access_control/privacy_policy_form_create.component';
import {
    ButtonModule, GrowlModule, DropdownModule, AutoCompleteModule, InputTextModule, DataTableModule,
    SharedModule, InputTextareaModule, MessagesModule
} from 'primeng/primeng';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        studentsComponent,
        PrimeComponent,
        PrivacyComponent,
        PolicyReviewComponent,
        AccessControlPolicyFormCreateComponent,
        PrivacyPolicyFormCreateComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'students', component: studentsComponent }, 
            { path: 'prime', component: PrimeComponent },
            { path: 'privacy_checking', component: PrivacyComponent },
            { path: 'policy_review', component: PolicyReviewComponent },
            { path: 'privacy_rule', component: AccessControlPolicyFormCreateComponent },
            { path: 'privacy_policy', component: PrivacyPolicyFormCreateComponent },
            { path: '**', redirectTo: 'home' },
        ]),
        FormsModule,
        ButtonModule,
        GrowlModule,
        DropdownModule,
        AutoCompleteModule, InputTextareaModule, MessagesModule,
        InputTextModule, DataTableModule, SharedModule
    ]
})
export class AppModule {
}
