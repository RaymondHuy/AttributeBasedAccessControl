import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SelectItem, Message, ConfirmationService } from 'primeng/primeng';

import { AppSetting } from '../../models/app_setting';
import { FieldEffect } from '../../models/field_effect.model';

@Component({
    selector: 'privacy_policy',
    template: require('./privacy_policy_form_create.component.html')
})
export class PrivacyPolicyFormCreateComponent {
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

    private policy_id: string;
    private description: string;

    private actions: SelectItem[] = [];
    private selected_action: string;

    private function_names: SelectItem[] = [];
    private selected_function_name: string;

    private subject_fields: SelectItem[] = [];
    private selected_subject_field: string;

    private current_rule_result: string = "";
    private final_rule_result: string[] = [];

    private target_result: string = "";

    private environment_value: string;
    private constant_value: string;

    private rule_id: string;
    private rule_ids: string[] = [];

    private privacy_field_selected: string;
    private privacy_functions: SelectItem[] = [];
    private field_effects: FieldEffect[] = [];
    private final_field_effects: FieldEffect[][] = [];

    private json_helper: any;
    private msgs: Message[] = [];

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {
        this.json_helper = JSON;
    }

    ngOnInit() {
        var that = this;
        //#region call web api for option data
        this.http.get(AppSetting.API_ENDPOINT + 'collections/').subscribe(data => {
            let collections: any[] = data.json();
            for (var name of collections) {
                that.collection_names.push({ label: name, value: name });
            }
            that.collection_selected_name = collections[0];
            that.onSelectCollectionName(collections[0]);
        });
        this.http.get(AppSetting.API_ENDPOINT + 'function/').subscribe(data => {
            let names: any[] = data.json();
            for (var name of names) {
                that.function_names.push({ label: name, value: name });
            }
            that.selected_function_name = names[0];
        });
        this.http.get(AppSetting.API_ENDPOINT + 'subject/fields/').subscribe(data => {
            let jsonObject: any = data.json();
            for (var property in jsonObject) {
                if (that.selected_subject_field === undefined)
                    that.selected_subject_field = property;
                that.initialize_fields(property, jsonObject, "", that.subject_fields);
            }
        });
        this.http.get(AppSetting.API_ENDPOINT + 'PrivacyFunctions/').subscribe(data => {
            let methods: any = data.json();
            for (var method of methods) {
                that.privacy_functions.push({ label: method, value: method});
            }
            that.privacy_functions.push({ label: 'Optional', value: 'Optional' });
        });
        //#endregion
        //#region hard code for options
        this.actions.push({ label: 'read', value: 'read' });
        this.actions.push({ label: 'write', value: 'write' });
        this.selected_action = this.actions[0].value;
        //#endregion
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
                that.field_effects = [];
                for (var item of that.resource_fields) {
                    that.field_effects.push(new FieldEffect(item.label, "Optional"));
                }
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
        else if (Array.isArray(object)) {
            for (var sub_property in object[0]) {
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

    //#region data form.

    add_function_name_to_rule() {
        this.current_rule_result += this.selected_function_name + " ( ";
    }

    add_function_name_to_target() {
        this.target_result += this.selected_function_name + " ( ";
    }

    add_resource_field_to_rule() {
        this.current_rule_result += "Resource." + this.resource_selected_field + " ";
    }

    add_resource_field_to_target() {
        this.target_result += "Resource." + this.resource_selected_field + " ";
    }

    add_subject_field_to_rule() {
        this.current_rule_result += "Subject." + this.selected_subject_field + " ";
    }

    add_subject_field_to_target() {
        this.target_result += "Subject." + this.selected_subject_field + " ";
    }

    add_constant_value_to_rule() {
        this.current_rule_result += this.constant_value + " ";
    }

    add_constant_value_to_target() {
        this.target_result += this.constant_value + " ";
    }

    add_environment_value_to_rule() {
        this.current_rule_result += "Environment." + this.environment_value + " ";
    }

    add_environment_value_to_target() {
        this.target_result += "Environment." + this.environment_value + " ";
    }
    //#endregion

    //#region logic form

    and_click(isTarget: boolean) {
        if (isTarget) {
            this.target_result += "AND ";
        } else {
            this.current_rule_result += "AND "
        }
    }

    or_click(isTarget: boolean) {
        if (isTarget) {
            this.target_result += "OR ";
        } else {
            this.current_rule_result += "OR "
        }
    }

    not_click(isTarget: boolean) {
        if (isTarget) {
            this.target_result += "NOT ( ";
        } else {
            this.current_rule_result += "NOT ( "
        }
    }

    open_bracket_click(isTarget: boolean) {
        if (isTarget) {
            this.target_result += "( ";
        } else {
            this.current_rule_result += "( "
        }
    }

    close_bracket_click(isTarget: boolean) {
        if (isTarget) {
            this.target_result += ") ";
        } else {
            this.current_rule_result += ") "
        }
    }

    comma_click(isTarget: boolean) {
        if (isTarget) {
            this.target_result += ", ";
        } else {
            this.current_rule_result += ", "
        }
    }
    //#endregion

    private add_current_rule() {
        this.final_rule_result.push(this.current_rule_result);
        this.rule_ids.push(this.rule_id);
        var cloned: FieldEffect[] = [];
        for (var item of this.field_effects) {
            cloned.push(new FieldEffect(item.Name, item.FunctionApply));
        }
        this.final_field_effects.push(cloned);
    }

    private submit() {
        console.log(32);
        console.log(this.final_field_effects);
        let command = {
            "PolicyID": this.policy_id,
            "CollectionName": this.collection_selected_name,
            "Description": this.description,
            "Action": this.selected_action,
            "Target": this.target_result,
            "Conditions": this.final_rule_result,
            "RuleIDs": this.rule_ids,
            "FieldEffects": this.final_field_effects
        }
        console.log(command);
        //this.http.post(AppSetting.API_ENDPOINT + 'AccessControlPolicy', JSON.stringify(command), this.options).subscribe(
        //    data => {

        //        console.log('OK');
        //    },
        //    error => {
        //        this.msgs = [];
        //        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
        //    }
        //);
    }
}
