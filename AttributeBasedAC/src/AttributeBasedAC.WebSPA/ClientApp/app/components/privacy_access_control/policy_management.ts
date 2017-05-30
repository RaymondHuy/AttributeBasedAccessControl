import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SelectItem, Message, ConfirmationService } from 'primeng/primeng';

import { AppSetting } from '../../models/app_setting';
import { AccessControl } from '../../models/access_control_rule.model';
import { PrivacyPolicy } from '../../models/privacy_rule.model';

@Component({
    selector: 'access_control_management',
    template: require('./policy_management.html'),
    providers: [ConfirmationService]
})

export class PolicyManagementComponent {
    private access_controls: AccessControl[] = [];
    private privacy_policy: PrivacyPolicy[] = [];

    constructor(private http: Http) {
        
    }

    ngOnInit() {
        this.http.get(AppSetting.API_ENDPOINT + 'AccessControlPolicy/').subscribe(data => {
            let jsonObject: any = data.json();
            for (let data of jsonObject) {
                this.access_controls.push(new AccessControl(data.policyId, data.description, data.collectionName, data.ruleCombining));
            }
        });

        this.http.get(AppSetting.API_ENDPOINT + 'PrivacyPolicy/').subscribe(data => {
            let jsonObject: any = data.json();
            console.log(jsonObject);
            for (let data of jsonObject) {
                this.privacy_policy.push(new PrivacyPolicy(data.policyId, data.description, data.collectionName));
            }
        });
    }
}