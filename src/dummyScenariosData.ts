import {
    IForecastInput,
    IncomeStartCondition,
    IncomeEndCondition,
    DebtContributionStrategy,
    IDebt,
} from "./interfacesAndEnums";
import { addNYearsToDate } from "./helpers";

const initialSavings = 500;
const numMonthsToProject = 12 * 10;
const mcDonaldsBaseMonthlySalary = 10200;
const overTimeHourlyPay = 130;
const bobsBirthday = new Date( 1959, 8, 7 );

const startDate = new Date( 2020, 0 ); // January 1st 2020
const deathDate = addNYearsToDate( bobsBirthday, 95 );

function CalcOvertimePayFromHours( numOvertimeHoursPerMonth: number ): number
{
    return mcDonaldsBaseMonthlySalary + overTimeHourlyPay * numOvertimeHoursPerMonth;
}

// Since the debts are the same in every scenario
function GetAllDebts(): IDebt[]
{
    return [
        {
            name: "Primary Residence Mortgage",
            initialBalance: 295542.46,
            interestRate: 0.0345,
            minPayment: 1441.16,
            isMortgage: true,
        },
        {
            name: "Vacation Home Mortgage",
            initialBalance: 428061.64,
            interestRate: 0.0371,
            minPayment: 2481.77,
            isMortgage: true,
        },
        {
            name: "Credit Card A",
            initialBalance: 7593.70,
            interestRate: 0.1999,
            minPayment: 300,
            isMortgage: false,
        },
        {
            name: "Credit Card B",
            initialBalance: 7720.48,
            interestRate: 0.1299,
            minPayment: 300,
            isMortgage: false,
        },
        {
            name: "Credit Card C",
            initialBalance: 45813.79,
            interestRate: 0.04,
            minPayment: 300,
            isMortgage: false,
        },
        {
            name: "Credit Card D",
            initialBalance: 10593.56,
            interestRate: 0.0745,
            minPayment: 325,
            isMortgage: false,
        },
        {
            name: "Personal Loan",
            initialBalance: 20342.06,
            interestRate: 0.0549,
            minPayment: 325,
            isMortgage: false,
        },
        {
            name: "Renovation Loan",
            initialBalance: 31746.1,
            interestRate: 0.0495,
            minPayment: 200,
            isMortgage: false,
        },
        {
            name: "Car Loan",
            initialBalance: 21599.79,
            interestRate: 0.0699,
            minPayment: 207.85,
            isMortgage: false,
        },
    ];
}

export function GetDummyScenarioData(): IForecastInput[]
{
    const forecastScenarios: IForecastInput[] = [
        {
            forecastName: 'Base case - no overtime or pensions and spend 6k',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 0,
            incomes:
                [
                    {
                        name: 'McDonalds Salary',
                        monthlyValue: mcDonaldsBaseMonthlySalary,
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 6000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: 'No overtime or pensions and spend 1k before and after retirement',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 0,
            incomes:
                [
                    {
                        name: 'McDonalds Salary',
                        monthlyValue: mcDonaldsBaseMonthlySalary,
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 1000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: 'No overtime - reduce to 1k spending before retirement and 5k after',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 0,
            incomes:
                [
                    {
                        name: 'McDonalds Salary',
                        monthlyValue: mcDonaldsBaseMonthlySalary,
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: '40 hours overtime - Reduce to 5k spending - No pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 5000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: '40 hours overtime - Reduce to 2k spending - No pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 2000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 2000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: '40 hours overtime- Reduce to 5k spending - get all pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    }, 
                    {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 5000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: '40 hours overtime - Reduce to 2k spending - get all pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 72 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    },
                    {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 2000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 2000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: 'Aggressive Conservative - Lowest Debt First',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 72,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 72 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 72 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    },
                    {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.LowestBalanceFirst,
        },
        {
            forecastName: 'Aggressive Conservative - Highest Interest First',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 72,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 72 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 72 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    },
                    {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
        },
        {
            forecastName: '40 hours overtime- Reduce to 5k spending - get all pensions - lowestDebtFirst',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    }, 
                    {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 5000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.LowestBalanceFirst,
        },
        {
            forecastName: '40 hours overtime - Reduce to 2k spending - get all pensions - lowestDebtFirst',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                    },
                    {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    },
                    {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        endDate: deathDate
                    }
                ],
            essentialNonDebtSpendingPreRetirement: 2000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 2000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.LowestBalanceFirst,
        }
    ];

    return forecastScenarios;
}