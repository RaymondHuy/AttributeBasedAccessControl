﻿import { SelectItem } from 'primeng/primeng';

export class FieldEffect {
    public Name: string;
    public FunctionApply: string;

    constructor(propertyName: string, privacyFunction: string) {
        this.FunctionApply = privacyFunction;
        this.Name = propertyName;
    }
}

export class FieldEffectOption {
    public Name: string;
    public Functions: SelectItem[];

    constructor(propertyName: string, privacyFunction: SelectItem[]) {
        this.Functions = privacyFunction;
        this.Name = propertyName;
    }
}