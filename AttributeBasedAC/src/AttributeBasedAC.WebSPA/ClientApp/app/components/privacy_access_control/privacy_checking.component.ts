import { Component } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import {
    Message
} from 'primeng/primeng';
@Component({
    selector: 'privacy_checking',
    template: require('./privacy_checking.component.html')
})
export class PrivacyComponent {

    //#region Subject
    private user_attributes: SelectItem[] = [];
    private user_selected_attribute: string;
    //#endregion

    //#region Resource
    private collection_names: SelectItem[] = [];
    private collection_selected_name: string;

    private resource_fields: SelectItem[] = [];
    private resource_selected_field: string;
    private resource_values: string;
    private resource_operators: SelectItem[] = [];
    private resource_selected_operator: string;
    //#endregion

    private environment_field: string;
    private environment_value: string;

    cities: SelectItem[];

    selectedCity: string;

    filteredCountriesSingle: any[];

    city: string;

    
    constructor() {
        this.user_attributes.push({ label: '_id', value: '_id' });
        this.user_attributes.push({ label: 'access_token', value: 'access_token' });
        this.user_attributes.push({ label: 'role', value: 'role' });

        this.collection_names.push({ label: 'Department', value: 'Department' });
        this.collection_names.push({ label: 'Employee', value: 'Employee' });

        this.resource_fields.push({ label: 'dept_id', value: 'dept_id' });
        this.resource_fields.push({ label: 'dept_no', value: 'dept_no' });

        this.cities = [];
        this.cities.push({ label: '', value: null });
        this.cities.push({ label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } });
        this.cities.push({ label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } });
        this.cities.push({ label: 'London', value: { id: 3, name: 'London', code: 'LDN' } });
        this.cities.push({ label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } });
        this.cities.push({ label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } });

        this.resource_operators.push({ label: 'Equals', value: 'Equals' });
        this.resource_operators.push({ label: 'GreaterThan', value: 'GreaterThan' });
        this.resource_operators.push({ label: 'LessThan', value: 'LessThan' });
    }

    filterCountrySingle(event) {
        let query = event.query;
        this.filteredCountriesSingle = this.filterCountry(query, this.cities);
    }

    filterCountry(query, countries: SelectItem[]): any[] {
        let filtered: any[] = [];
        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if (country.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }
}