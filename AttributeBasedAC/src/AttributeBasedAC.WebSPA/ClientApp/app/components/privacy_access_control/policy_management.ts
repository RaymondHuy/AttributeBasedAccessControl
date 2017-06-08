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


    private msgs: Message[] = [];
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private confirmationService: ConfirmationService) {
        
    }

    ngOnInit() {
        this.init_access_control();
        this.init_privacy();
    }

    init_access_control() {
        this.access_controls = [];
        this.http.get(AppSetting.API_ENDPOINT + 'AccessControlPolicy/').subscribe(data => {
            let jsonObject: any = data.json();
            for (let data of jsonObject) {
                this.access_controls.push(new AccessControl(data.policyId, data.description, data.collectionName, data.ruleCombining, data.target, data.action));
            }
        });
    }

    init_privacy() {
        this.privacy_policy = [];
        this.http.get(AppSetting.API_ENDPOINT + 'PrivacyPolicy/').subscribe(data => {
            let jsonObject: any = data.json();
            for (let data of jsonObject) {
                this.privacy_policy.push(new PrivacyPolicy(data.policyId, data.description, data.collectionName, data.target));
            }
        });
    }

    delete_access_control(policy: any) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.http.delete(AppSetting.API_ENDPOINT + 'AccessControlPolicy?policyID=' + policy.PolicyID, this.options).subscribe(data => {
                    this.msgs = [];
                    this.msgs.push({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
                    this.init_access_control();
                });
            }
        });
    }

    delete_privacy_policy(policy: any) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.http.delete(AppSetting.API_ENDPOINT + 'PrivacyPolicy?policyID=' + policy.PolicyID, this.options).subscribe(data => {
                    this.msgs = [];
                    this.msgs.push({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
                    this.init_privacy();
                });
            }
        });
    }
}