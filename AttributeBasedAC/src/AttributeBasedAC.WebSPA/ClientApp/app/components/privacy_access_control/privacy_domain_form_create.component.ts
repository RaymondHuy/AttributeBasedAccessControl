import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SelectItem, Message, ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'privacy_domain',
    template: require('./privacy_domain_form_create.component.html'),
    providers: [ConfirmationService]
})

export class PrivacyDomainComponent {

    private domain_names: SelectItem[] = [];
    private domain_selected_name: string;

    private json_helper: any;
    private msgs: Message[] = [];

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {
        this.json_helper = JSON;
        this.domain_names.push({ label: 'SsnDomain', value: 'SsnDomain' });
        this.domain_names.push({ label: 'DateDomain', value: 'DateTimeDomain' });
    }

    onSelectDomainName(domain_selected: string) {
    }
}