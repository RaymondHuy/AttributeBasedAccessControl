export class FieldEffect {
    public Name: string;
    public FunctionApply: string;

    constructor(propertyName: string, privacyFunction: string) {
        this.FunctionApply = privacyFunction;
        this.Name = propertyName;
    }
}