export class AccessControlRule {
    public RuleId: string;
    public Condition: string;
    public Effect: string;

    constructor(ruleId: string, condition: string, effect: string) {
        this.RuleId = ruleId;
        this.Condition = condition;
        this.Effect = effect;
    }
}