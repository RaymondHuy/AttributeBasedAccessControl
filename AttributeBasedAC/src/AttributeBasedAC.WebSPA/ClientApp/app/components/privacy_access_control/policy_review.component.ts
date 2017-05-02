import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SelectItem, Message, ConfirmationService } from 'primeng/primeng';

import { AppSetting } from '../../models/app_setting';

@Component({
    selector: 'policy_review',
    template: require('./policy_review.component.html')
})
export class PolicyReviewComponent {

    private collection_names: SelectItem[] = [];
    private collection_selected_name: string;

    //#region resource
    private resource_fields: SelectItem[] = [];
    private resource_selected_field: string;
    private constant_resource_value: string;
    private resource_values: string;
    private resource_result: string;
    private resource_result_temp: string;
    //#endregion

    private actions: SelectItem[] = [];
    private selected_action: string;

    private policy_types: SelectItem[] = [];
    private selected_policy_type: string;

    //#region subject
    private subject_fields: SelectItem[] = [];
    private selected_subject_field: string;
    private constant_subject_value: string;
    private subject_result: string;
    private subject_result_temp: string;
    //#endregion

    //#region environment
    private environment_field: string;
    private constant_environment_value: string;
    private environment_result: string;
    private environment_result_temp: string;
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
    }

    ngOnInit() {
        var that = this;
        this.http.get(AppSetting.API_ENDPOINT + 'collections/').subscribe(data => {
            let collections: any[] = data.json();
            for (var name of collections) {
                that.collection_names.push({ label: name, value: name });
            }
            that.collection_selected_name = collections[0];
            that.onSelectCollectionName(collections[0]);
        });
        this.http.get(AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(data => {
            let jsonObject: any = data.json();
            for (var property in jsonObject) {
                if (that.selected_subject_field === undefined)
                    that.selected_subject_field = property;
                that.initialize_fields(property, jsonObject, "", that.subject_fields);
            }
        });

        this.actions.push({ label: 'read', value: 'read' });
        this.actions.push({ label: 'create', value: 'create' });
        this.actions.push({ label: 'update', value: 'update' });
        this.actions.push({ label: 'delete', value: 'delete' });
        this.selected_action = this.actions[0].value;

        this.policy_types.push({ label: 'Access Control', value: 'Access Control' });
        this.policy_types.push({ label: 'Privacy', value: 'Privacy' });
        this.selected_policy_type = this.policy_types[0].value;
    }

    private onSelectCollectionName(collectionSelected: string) {
        var that = this;
        this.resource_fields = [];
        this.http.get(AppSetting.API_ENDPOINT + 'structure/?collectionName=' + collectionSelected).subscribe(data => {
            let jsonObject: any = data.json();
            for (var property in jsonObject) {
                if (that.resource_selected_field === undefined)
                    that.resource_selected_field = property;
                that.initialize_fields(property, jsonObject, "", that.resource_fields);
            }
        })
    }

    private initialize_fields(property: any, jsonObject: any, prefix: string, container: SelectItem[]) {

        let object = jsonObject[property];
        if (typeof object === 'object' && !Array.isArray(object)) {
            for (var sub_property in object) {
                if (prefix == '')
                    this.initialize_fields(sub_property, object, prefix + property, container);
                else this.initialize_fields(sub_property, object, prefix + '.' + property, container);
            }
        }
        else {
            if (prefix == '')
                container.push({ label: property, value: property });
            else container.push({ label: prefix + '.' + property, value: prefix + '.' + property });
        }
    }

    private add_subject_field() {
        if (!this.subject_result_temp)
            this.subject_result_temp = "\"" + this.selected_subject_field + "\" : \"" + this.constant_subject_value + "\"";
        else
            this.subject_result_temp += ", \"" + this.selected_subject_field + "\" : \"" + this.constant_subject_value + "\"";

        this.subject_result = "{ " + this.subject_result_temp + " }";

        this.constant_subject_value = null;
    }

    private add_resource_field() {
        if (!this.resource_result_temp)
            this.resource_result_temp = "\"" + this.resource_selected_field + "\" : \"" + this.constant_resource_value + "\"";
        else
            this.resource_result_temp += ", \"" + this.resource_selected_field + "\" : \"" + this.constant_resource_value + "\"";

        this.resource_result = "{ " + this.resource_result_temp + " }";

        this.constant_resource_value = null;
    }

    private add_environment_value() {
        if (!this.environment_result_temp)
            this.environment_result_temp = "\"" + this.environment_field + "\" : \"" + this.constant_environment_value + "\"";
        else
            this.environment_result_temp += ", \"" + this.environment_field + "\" : \"" + this.constant_environment_value + "\"";

        this.environment_result = "{ " + this.environment_result_temp + " }";

        this.environment_field = this.constant_environment_value = null;
    }

    private clear() {
        this.environment_result_temp = null;
        this.resource_result_temp = null;
        this.subject_result_temp = null;
        this.resource_result = "";
        this.subject_result = "";
        this.environment_result = "";
    }

    private submit() {
        var command = {
            UserJsonData: this.subject_result,
            ResourceJsonData: this.resource_result,
            EnvironmentJsonData: this.environment_result,
            Action: this.selected_action,
            CollectionName: this.collection_selected_name
        }
        this.result = [];
        this.result_property_names = [];
        let that = this;
        if (this.selected_policy_type == 'Access Control') {
            this.http.post(AppSetting.API_ENDPOINT + 'AccessControl/Review/', JSON.stringify(command), this.options).subscribe(
                data => {
                    console.log('ok');
                    that.result = data.json();
                    console.log(that.result);
                    //let jsonObject: any = data.json()[0];
                    //for (var property in jsonObject) {
                    //    that.result_property_names.push(property);
                    //}
                },
                error => {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
                }
            );
        }
        else {
            this.http.post(AppSetting.API_ENDPOINT + 'Privacy/Review/', JSON.stringify(command), this.options).subscribe(
                data => {
                    console.log('ok');
                    that.result = data.json();
                    console.log(that.result);
                    //let jsonObject: any = data.json()[0];
                    //for (var property in jsonObject) {
                    //    that.result_property_names.push(property);
                    //}
                },
                error => {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
                }
            );
        }
    }
}
