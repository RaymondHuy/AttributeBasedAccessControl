import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';

import { PrivacyComponent } from './components/privacy_access_control/privacy_checking.component';
import { PolicyReviewComponent } from './components/privacy_access_control/policy_review.component';
import { AccessControlPolicyFormCreateComponent } from './components/privacy_access_control/privacy_rule.component';
import { PrivacyPolicyFormCreateComponent } from './components/privacy_access_control/privacy_policy_form_create.component';
import { PrivacyDomainComponent } from './components/privacy_access_control/privacy_domain_form_create.component';

import {
    ButtonModule, GrowlModule, DropdownModule, AutoCompleteModule, InputTextModule, DataTableModule,
    SharedModule, InputTextareaModule, MessagesModule, PanelModule, AccordionModule, FieldsetModule
} from 'primeng/primeng';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        PrivacyComponent,
        PolicyReviewComponent,
        AccessControlPolicyFormCreateComponent,
        PrivacyPolicyFormCreateComponent,
        PrivacyDomainComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'privacy_checking', component: PrivacyComponent },
            { path: 'policy_review', component: PolicyReviewComponent },
            { path: 'privacy_rule', component: AccessControlPolicyFormCreateComponent },
            { path: 'privacy_policy', component: PrivacyPolicyFormCreateComponent },
            { path: 'privacy_domain', component: PrivacyDomainComponent },
            { path: '**', redirectTo: 'home' },
        ]),
        FormsModule,
        ButtonModule,
        GrowlModule,
        DropdownModule,
        AutoCompleteModule, InputTextareaModule, MessagesModule, AccordionModule,
        InputTextModule, DataTableModule, SharedModule, PanelModule, FieldsetModule
    ]
})
export class AppModule {
}
