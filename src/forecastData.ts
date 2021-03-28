import { IForecastInput, DebtContributionStrategy, IIncome, IDebt, IForecastResult, IScenarioSummary } from "./interfacesAndEnums";

export class ForecastInput implements IForecastInput
{
    forecastName: string;
    initialSavings: number;
    startDate: Date;
    numMonthsToProject: number;
    overtimeHoursPerMonth: number;
    incomes: IIncome[];
    essentialNonDebtSpendingPreRetirement: number;
    debts: IDebt[];
    desiredMonthlyBudgetPostRetirement: number;
    deathDate: Date;
    debtContributionStrategy: DebtContributionStrategy;

    constructor()
    {
        this.forecastName = '';
        this.initialSavings = 0;
        this.startDate = new Date();
        this.numMonthsToProject = 0;
        this.overtimeHoursPerMonth = 0;
        this.incomes = [];
        this.essentialNonDebtSpendingPreRetirement = 0;
        this.debts = [];
        this.desiredMonthlyBudgetPostRetirement = 0;
        this.deathDate = new Date();
        this.debtContributionStrategy = DebtContributionStrategy.HighestInterestFirst;
    }
}

export class ForecastOutput implements IForecastResult
{
    numMonthsToReachRetirementGoal: number;
    savingsOverTime: number[];
    incomesOverTime: IIncome[];
    debts: IDebt[];
    totalDebtVsTime: number[];
    requiredSavingsToRetire: number;

    constructor()
    {
        this.numMonthsToReachRetirementGoal = 0;
        this.savingsOverTime = [];
        this.incomesOverTime = [];
        this.debts = [];
        this.totalDebtVsTime = [];
        this.requiredSavingsToRetire = 0;
    }
}

export class ScenarioSummary implements IScenarioSummary
{
    scenarioName: string;
    overtimeHoursPerMonth: number;
    preRetirementSpending: number;
    postRetirementSpending: number;
    requiredSavingsToRetire: number;
    numMonthsToReachRetirementGoal: number;
    retirementDate: string;

    constructor()
    {
        this.scenarioName = "";
        this.overtimeHoursPerMonth = 0;
        this.preRetirementSpending = 0;
        this.postRetirementSpending = 0;
        this.requiredSavingsToRetire = 0;
        this.numMonthsToReachRetirementGoal = 0;
        this.retirementDate = "(simulation not yet run)";
    }
}