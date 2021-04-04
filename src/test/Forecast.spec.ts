import { expect } from "chai";
import { DebtModel } from "../DebtModel";
import { GetUnpaidDebtWithHighestInterest, GetUnpaidDebtWithLowestBalance, getRequiredSavingsToRetire } from "../forecast";
import { IncomeModel } from "../IncomeModel";
import { IDebt, IIncome, IncomeStartCondition, IncomeEndCondition } from "../interfacesAndEnums";

describe( 'Forecast', () =>
{
    let debts: IDebt[];
    let incomes: IIncome[];

    beforeEach( () =>
    {
        debts = [
            new DebtModel( "A", 600, 0.14, 10, false ),
            new DebtModel( "B", 400, 0.15, 9, false ),
            new DebtModel( "C", 500, 0.16, 8, false ),
        ];

        incomes = [
            new IncomeModel( "Job", 100, IncomeStartCondition.Immediate, IncomeEndCondition.Date, new Date( 2020, 1, 1 ), new Date( 2025, 1, 1 ) ),
            new IncomeModel( "Pension", 100, IncomeStartCondition.Retirement, IncomeEndCondition.Date, new Date( 2025, 1, 1 ), new Date( 2030, 1, 1 ) )
        ];
    } );

    it( 'Get unpaid debt with highest interest rate', () =>
    {
        const actualDebt = GetUnpaidDebtWithHighestInterest( debts );
        expect( actualDebt ).to.not.be.null;
        expect( actualDebt!.name ).to.equal( "C" );
    } );

    it( 'Get unpaid debt with lowest balance', () =>
    {
        const actualDebt = GetUnpaidDebtWithLowestBalance( debts );
        expect( actualDebt ).to.not.be.null;
        expect( actualDebt!.name ).to.equal( "B" );
    } );

    it( 'Get unpaid debt with lowest balance after one is already paid off', () =>
    {
        debts[1].MakePayment( 500, 0 );

        const actualDebt = GetUnpaidDebtWithLowestBalance( debts );
        expect( actualDebt ).to.not.be.null;
        expect( actualDebt!.name ).to.equal( "C" );
    } );

    it( 'getRequiredSavingsToRetire without pension', () =>
    {

        const desiredMonthlyBudgetPostRetirement = 500;
        const jobIncomeOnly = [incomes[0]];
        const actual = getRequiredSavingsToRetire( jobIncomeOnly, desiredMonthlyBudgetPostRetirement );

        expect( actual ).to.equal( 150000 )
    } );

    it( 'getRequiredSavingsToRetire with pension', () =>
    {

        const desiredMonthlyBudgetPostRetirement = 500;
        const actual = getRequiredSavingsToRetire( incomes, desiredMonthlyBudgetPostRetirement );

        expect( actual ).to.equal( 120000 )
    } );

    it( 'getRequiredSavingsToRetire with pensions that exceed the post retirement spending', () =>
    {

        const desiredMonthlyBudgetPostRetirement = 100;
        const actual = getRequiredSavingsToRetire( incomes, desiredMonthlyBudgetPostRetirement );

        expect( actual ).to.equal( 0 )
    } );


} );