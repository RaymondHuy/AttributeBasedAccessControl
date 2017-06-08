import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';

import { PrivacyComponent } from './components/privacy_access_control/privacy_checking.component';
import { PolicyReviewComponent } from './components/privacy_access_control/policy_review.component';
import { AccessControlPolicyFormCreateComponent } from './components/privacy_access_control/access_control_form_create.component';
import { AccessControlDetailComponent } from './components/privacy_access_control/access_control_detail.component';
import { PrivacyPolicyFormCreateComponent } from './components/privacy_access_control/privacy_policy_form_create.component';
import { PrivacyPolicyDetailComponent } from './components/privacy_access_control/privacy_policy_detail.component';
import { PrivacyDomainComponent } from './components/privacy_access_control/privacy_domain_form_create.component';
import { PolicyManagementComponent } from './components/privacy_access_control/policy_management';
import { SubPrivacyPolicyFormCreateComponent } from './components/privacy_access_control/sub_privacy_policy_form_create.component';

import {
    ButtonModule, GrowlModule, DropdownModule, AutoCompleteModule, InputTextModule, DataTableModule,
    SharedModule, InputTextareaModule, MessagesModule, PanelModule, AccordionModule, FieldsetModule, ConfirmDialogModule
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
        PrivacyDomainComponent,
        PolicyManagementComponent,
        SubPrivacyPolicyFormCreateComponent,
        PrivacyPolicyDetailComponent,
        AccessControlDetailComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'privacy_checking', component: PrivacyComponent },
            { path: 'policy_review', component: PolicyReviewComponent },
            { path: 'access_control_policy', component: AccessControlPolicyFormCreateComponent },
            { path: 'access_control_detail/:id', component: AccessControlDetailComponent },
            { path: 'privacy_policy', component: PrivacyPolicyFormCreateComponent },
            { path: 'privacy_policy_detail/:id', component: PrivacyPolicyDetailComponent },
            { path: 'sub_privacy_policy', component: SubPrivacyPolicyFormCreateComponent },
            { path: 'privacy_domain', component: PrivacyDomainComponent },
            { path: 'policy_management', component: PolicyManagementComponent },
            { path: '**', redirectTo: 'home' },
        ]),
        FormsModule,
        ButtonModule,
        GrowlModule,
        DropdownModule,
        AutoCompleteModule, InputTextareaModule, MessagesModule, AccordionModule,
        InputTextModule, DataTableModule, SharedModule, PanelModule, FieldsetModule, ConfirmDialogModule
    ]
})
export class AppModule {
}
