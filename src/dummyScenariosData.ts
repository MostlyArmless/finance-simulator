import { IForecastInput, IncomeStartCondition, IncomeEndCondition, DebtContributionStrategy } from "./interfacesAndEnums";
import { IncomeModel } from "./IncomeModel";
import { DebtModel } from "./DebtModel";
import { addNYearsToDate } from "./helpers";

const initialSavings = 500;
const numMonthsToProject = 12 * 10;
const mcDonaldsBaseMonthlySalary = 10200;
const overTimeHourlyPay = 130;
const bobsBirthday = new Date( 1959, 8, 7 );
const bobs62ndBirthday = addNYearsToDate( bobsBirthday, 62 );

const startDate = new Date( 2020, 0 ); // January 1st 2020
const deathDate = addNYearsToDate( bobsBirthday, 95 );
let dummyRetirementDate = new Date( startDate.getFullYear() + 200 ); // Initialize this to be later than the death date, it will get modified during the simulation.

function CalcOvertimePayFromHours( numOvertimeHoursPerMonth: number ): number
{
    return mcDonaldsBaseMonthlySalary + overTimeHourlyPay * numOvertimeHoursPerMonth;
}

// Since the debts are the same in every scenario
function GetAllDebts(): DebtModel[]
{
    return [
        new DebtModel( "Primary Residence Mortgage", 295542.46, 0.0345, 1441.16, true ),
        new DebtModel( "Vacation Home Mortgage", 428061.64, 0.0371, 2481.77, true ),
        new DebtModel( "Credit Card A", 7593.70, 0.1999, 300 ),
        new DebtModel( "Credit Card B", 7720.48, 0.1299, 300 ),
        new DebtModel( "Credit Card C", 45813.79, 0.04, 300 ),
        new DebtModel( "Credit Card D", 10593.56, 0.0745, 325 ),
        new DebtModel( "Personal Loan", 20342.06, 0.0549, 325 ),
        new DebtModel( "Renovation Loan", 31746.1, 0.0495, 200 ),
        new DebtModel( "Car Loan", 21599.79, 0.0699, 207.85 )
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
                    new IncomeModel( {
                        name: 'McDonalds Salary',
                        monthlyValue: mcDonaldsBaseMonthlySalary,
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 6000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: 'No overtime or pensions and spend 1k before and after retirement',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 0,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary',
                        monthlyValue: mcDonaldsBaseMonthlySalary,
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 1000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: 'No overtime - reduce to 1k spending before retirement and 5k after',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 0,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary',
                        monthlyValue: mcDonaldsBaseMonthlySalary,
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: '40 hours overtime - Reduce to 5k spending - No pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 5000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: '40 hours overtime - Reduce to 2k spending - No pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 2000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 2000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: '40 hours overtime- Reduce to 5k spending - get all pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } ),
                    new IncomeModel( {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: dummyRetirementDate,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 5000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: '40 hours overtime - Reduce to 2k spending - get all pensions',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 72 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } ),
                    new IncomeModel( {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: dummyRetirementDate,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 2000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 2000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: 'Aggressive Conservative - Lowest Debt First',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 72,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 72 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 72 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } ),
                    new IncomeModel( {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: dummyRetirementDate,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.LowestBalanceFirst
        },
        {
            forecastName: 'Aggressive Conservative - Highest Interest First',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 72,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 72 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 72 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } ),
                    new IncomeModel( {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: dummyRetirementDate,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 1000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
        },
        {
            forecastName: '40 hours overtime- Reduce to 5k spending - get all pensions - lowestDebtFirst',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } ),
                    new IncomeModel( {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: dummyRetirementDate,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 5000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 5000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.LowestBalanceFirst
        },
        {
            forecastName: '40 hours overtime - Reduce to 2k spending - get all pensions - lowestDebtFirst',
            initialSavings: initialSavings,
            startDate: new Date( startDate ),
            numMonthsToProject: numMonthsToProject,
            overtimeHoursPerMonth: 40,
            incomes:
                [
                    new IncomeModel( {
                        name: 'McDonalds Salary with 40 hours overtime',
                        monthlyValue: CalcOvertimePayFromHours( 40 ),
                        startCondition: IncomeStartCondition.Immediate,
                        endCondition: IncomeEndCondition.Retirement,
                        simulationStartDate: startDate
                    } ),
                    new IncomeModel( {
                        name: 'McDonalds Pension',
                        monthlyValue: 1600,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: dummyRetirementDate,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'US Pension',
                        monthlyValue: 1648.4,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } ),
                    new IncomeModel( {
                        name: 'Canada old age pension (guesstimated value)',
                        monthlyValue: 700,
                        startCondition: IncomeStartCondition.Retirement,
                        endCondition: IncomeEndCondition.Date,
                        simulationStartDate: bobs62ndBirthday,
                        incomeEndDate: deathDate
                    } )
                ],
            essentialNonDebtSpendingPreRetirement: 2000,
            debts: GetAllDebts(),
            desiredMonthlyBudgetPostRetirement: 2000,
            deathDate: new Date( deathDate ),
            debtContributionStrategy: DebtContributionStrategy.LowestBalanceFirst
        }
    ];

    return forecastScenarios;
}