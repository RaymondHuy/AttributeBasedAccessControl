/// <reference path="../../models/app_setting.ts" />
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SelectItem, Message, ConfirmationService } from 'primeng/primeng';

import { AppSetting } from '../../models/app_setting';
@Component({
    selector: 'privacy_checking',
    template: require('./privacy_checking.component.html'),
    providers: [ConfirmationService]
})
export class PrivacyComponent {

    //#region Subject
    private users: any[];
    private user_property_names: any[] = [];
    private selected_user: any;
    //#endregion

    //#region Resource
    private collection_names: SelectItem[] = [];
    private collection_selected_name: string;

    private resource_fields: SelectItem[] = [];
    private resource_selected_field: string;
    private resource_values: string;
    private resource_operators: SelectItem[] = [];
    private resource_selected_operator: string;

    private condition_result: string = "";
    //#endregion

    //#region environment
    private environment_field: string;
    private environment_value: string;
    private environment_object: string;
    private environment_result: string;
    //#endregion

    //#region result
    private result: any[] = [];
    private result_property_names: any[] = [];
    //#endregion
    private json_helper: any;
    private msgs: Message[] = [];

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {
        this.json_helper = JSON;
        this.resource_operators.push({ label: 'Equals', value: 'Equals' });
        this.resource_operators.push({ label: 'GreaterThan', value: 'GreaterThan' });
        this.resource_operators.push({ label: 'LessThan', value: 'LessThan' });

    }

    ngOnInit() {
        var that = this;
        this.http.get(AppSetting.API_ENDPOINT + 'accounts/').subscribe(data => {
            let jsonObject: any = data.json()[0];
            for (var property in jsonObject) {
                that.user_property_names.push(property);
            }
            that.users = data.json();
        })
        this.http.get(AppSetting.API_ENDPOINT + 'collections/').subscribe(data => {
            let collections: any[] = data.json();
            for (var name of collections) {
                that.collection_names.push({ label: name, value: name });
            }
            that.collection_selected_name = collections[0];
            that.onSelectCollectionName(collections[0]);
        })
    }

    private onSelectCollectionName(collectionSelected: string) {
        var that = this;
        this.resource_fields = [];
        this.http.get(AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(data => {
            let jsonObject: any = data.json();
            for (var property in jsonObject) {
                that.resource_fields.push({ label: property, value: property });
            }
        })
    }

    and_click() {
        this.condition_result += " AND ";
    }

    or_click() {
        this.condition_result += " OR ";
    }

    not_click() {
        this.condition_result += "NOT( ";
    }

    open_bracket_click() {
        this.condition_result += "(";
    }

    private close_bracket_click() {
        this.condition_result += " )";
    }

    private add_condition() {
        if (!this.resource_selected_field)
            this.resource_selected_field = this.resource_fields[0].value;

        if (!this.resource_selected_operator)
            this.resource_selected_operator = this.resource_operators[0].value;

        let expression: string = this.resource_selected_operator + '('
            + this.resource_selected_field + ', ' + this.resource_values + ')';

        if (this.condition_result)
            this.condition_result += expression;
        else this.condition_result = expression;
    }

    private clear_condition() {
        this.condition_result = null;
    }

    private add_environment_field() {
        if (!this.environment_result)
            this.environment_result = "\"" + this.environment_field + "\" : \"" + this.environment_value + "\"";
        else
            this.environment_result += ", \"" + this.environment_field + "\" : \"" + this.environment_value + "\"";

        this.environment_object = "{ " + this.environment_result + " }";

        this.environment_field = this.environment_value = null;
    }

    private clear_environment() {
        this.environment_object = "";
        this.environment_result = "";
    }

    private submit() {
        if (!this.selected_user) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'You have not selected user' });
            return;
        }
        let environment = "{ " + this.environment_result + " }";
        let command = {
            "UserID": this.selected_user._id,
            "ResourceName": this.collection_selected_name,
            "ResourceCondition": this.condition_result,
            "Environment": environment,
            "Action": "read"
        };
        this.result = [];
        this.result_property_names = [];
        let that = this;
        this.http.post(AppSetting.API_ENDPOINT + 'privacy/check/', JSON.stringify(command), this.options).subscribe(
            data => {
                that.result = data.json();
                let jsonObject: any = data.json()[0];
                for (var property in jsonObject) {
                    that.result_property_names.push(property);
                }
            },
            error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
            }
        );
    }
}