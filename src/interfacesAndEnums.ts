export interface IDebt {
    name: string;
    interestRate: number;
    minPayment: number;
    initialBalance: number;
    isMortgage: boolean;
}

export interface IIncome {
    name: string;
    monthlyValue: number;
    startCondition: IncomeStartCondition;
    startDate?: Date; // Only required if the startCondition is Retirement
    endCondition: IncomeEndCondition;
    endDate?: Date; // Only required if the endCondition is Date
}

// TODO refactor this to not exist. make the forecast calculator responsible for all the logic. don't use OOP
export interface IDebtForCalculator
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

// TODO refactor to not exist. make the forecast calculator responsible for all the logic. don't use OOP
export interface IIncomeForCalculator
{
    GetName(): string;
    setName(name: string): void;
    GetStartCondition(): IncomeStartCondition;
    setStartCondition(condition: IncomeStartCondition): void;
    GetEndCondition(): IncomeEndCondition;
    setEndCondition(condition: IncomeEndCondition): void;
    GetIncomeStartDate(): Date;
    SetIncomeStartDate( startDate: Date ): void;
    GetEndDate(): Date;
    SetEndDate( endDate: Date ): void;
    GetValueAtMonth( iMonth: number ): number;
    getMonthlyValue(): number;
    setMonthlyValue(val: number): void;
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

export interface IForecastResult
{
    numMonthsToReachRetirementGoal: number;
    savingsOverTime: number[];
    incomesOverTime: IIncomeForCalculator[];
    debts: IDebtForCalculator[];
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
    retirementPhrase: string;
}

export interface IScenarioIoPair
{
    forecastInput: IForecastInput;
    forecastResult: IForecastResult;
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