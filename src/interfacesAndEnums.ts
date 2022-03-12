import { addNMonthsToDate } from "./helpers";

export interface IDebt
{
    name: string;
    interestRate: number;
    minPayment: number;

    Print(): void;
    MakePayment( paymentAmount: number, iMonth: number ): number;
    MakeMinPayment( iMonth: number ): number;
    GetBalanceAtMonth( iMonth: number ): number;
    GetCurrentBalance(): number;
    ApplyInterest( iMonth: number ): void;
    GetBalances(): number[];
}

export interface IIncome
{
    GetName(): string;
    GetStartCondition(): IncomeStartCondition;
    GetEndCondition(): IncomeEndCondition;
    GetIncomeStartDate(): Date;
    SetIncomeStartDate( startDate: Date ): void;
    GetEndDate(): Date;
    SetEndDate( endDate: Date ): void;
    GetValueAtMonth( iMonth: number ): number;
    GetFixedAmount(): number;
}

export enum IncomeStartCondition
{
    Immediate,
    Retirement
}

export enum IncomeEndCondition
{
    Retirement,
    Date
}

export enum DebtContributionStrategy
{
    HighestInterestFirst,
    LowestBalanceFirst
}

export interface IForecastInput
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
}

export class NullForecastInput implements IForecastInput
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
        const now = new Date();
        this.forecastName = '';
        this.initialSavings = 0;
        this.startDate = now;
        this.numMonthsToProject = 0;
        this.overtimeHoursPerMonth = 0;
        this.incomes = [];
        this.essentialNonDebtSpendingPreRetirement = 0;
        this.debts = [];
        this.desiredMonthlyBudgetPostRetirement = 0;
        this.deathDate = addNMonthsToDate( now, 60 * 12 );
        this.debtContributionStrategy = DebtContributionStrategy.HighestInterestFirst
    }
}

export interface IForecastResult
{
    numMonthsToReachRetirementGoal: number;
    savingsOverTime: number[];
    incomesOverTime: IIncome[];
    debts: IDebt[];
    totalDebtVsTime: number[];
    requiredSavingsToRetire: number;
}

export interface IScenarioSummary
{
    scenarioName: string;
    overtimeHoursPerMonth: number;
    preRetirementSpending: number;
    postRetirementSpending: number;
    requiredSavingsToRetire: number;
    numMonthsToReachRetirementGoal: number;
    retirementDate: string;
}

export interface IScenarioDescription
{
    forecastResult: IForecastResult;
    scenarioSummary: IScenarioSummary;
}

export interface IMonthsToRetirement
{
    scenarioName: string;
    monthsRequiredToRetire: number;
}

export interface IValidationResult
{
    isValid: boolean;
    errorMessage: string;
}

export interface ForecastInputOutputPair
{
    input: IForecastInput;
    output: IForecastResult;
}