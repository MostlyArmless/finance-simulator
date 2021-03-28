/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as chai from 'chai';
import { Debt } from '../Debt';
import { IDebt, IIncome, IncomeStartCondition, IncomeEndCondition } from '../interfaces';
import { Income } from '../Income';
import { GetUnpaidDebtWithHighestInterest, GetUnpaidDebtWithLowestBalance, getRequiredSavingsToRetire } from '../forecast';
import { addNMonthsToDate } from '../helpers';
// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require( 'chai' ).assert;

chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'Debt', () =>
{
    let testSubject: IDebt;

    beforeEach( () =>
    {
        testSubject = new Debt( 'Credit Card', 100, 0.05, 20 );
    } );

    it( 'Initializes correctly', () =>
    {
        expect( testSubject.GetCurrentBalance() ).to.equal( 100 );
        expect( testSubject.GetBalanceAtMonth( 0 ) ).to.equal( 100 );
        expect( testSubject.interestRate ).to.equal( 0.05 );
        expect( testSubject.name ).to.equal( 'Credit Card' );
        expect( testSubject.minPayment ).to.equal( 20 );
    } );

    it( "Should throw error when asked to get a balance at a negative month index", () =>
    {
        expect( () => testSubject.GetBalanceAtMonth( -1 ) ).to.throw();
    } );

    it( 'MakeMinPayment', () =>
    {
        testSubject.MakeMinPayment( 0 );

        expect( testSubject.GetCurrentBalance() ).to.equal( 80 );
        expect( testSubject.GetBalanceAtMonth( 0 ) ).to.equal( 80 );
    } );

    it( 'MakePayment', () =>
    {
        testSubject.MakePayment( 60, 0 );

        expect( testSubject.GetCurrentBalance() ).to.equal( 40 );
        expect( testSubject.GetBalanceAtMonth( 0 ) ).to.equal( 40 );
    } );

    it( 'Making a payment larger than the remaining balance reduces balance to zero and returns the actual payment amount', () =>
    {
        const creditCardDebt = new Debt( 'Almost paid-off card', 20, 0.05, 50, false );
        const mortgage = new Debt( 'Almost paid-off mortgage', 20, 0.05, 50, true );

        let actualPayment = creditCardDebt.MakeMinPayment( 0 )
        expect( actualPayment ).to.equal( 20 );
        expect( creditCardDebt.GetCurrentBalance() ).to.equal( 0 );

        actualPayment = mortgage.MakeMinPayment( 0 )
        expect( actualPayment ).to.equal( 20 );
        expect( mortgage.GetCurrentBalance() ).to.equal( 0 );
    } );

    it( 'Not allowed to MakePayment after calling ApplyInterest for a given month', () =>
    {
        testSubject.ApplyInterest( 0 );
        expect( () => testSubject.MakeMinPayment( 0 ) ).to.throw();
    } );

    it( 'Not allowed to MakeMinPayment after calling ApplyInterest for a given month', () =>
    {
        testSubject.ApplyInterest( 0 );
        expect( () => { testSubject.MakePayment( 10, 0 ); } ).to.throw();
    } );

    it( "ApplyInterest after making payment correctly calculates next month's interest", () =>
    {
        testSubject.MakePayment( 50, 0 );
        testSubject.ApplyInterest( 0 );
        expect( testSubject.GetBalanceAtMonth( 1 ) ).to.equal( 50 * 1.05 );
    } );

    it( "Can call ApplyInterest and get the correct next balance without ever making a payment", () =>
    {
        testSubject.ApplyInterest( 0 );
        expect( testSubject.GetBalanceAtMonth( 1 ) ).to.equal( 100 * 1.05 );
    } );

    it( 'Compounding interest across months works correctly', () =>
    {
        const expectedMonth1Balance = 70 * 1.05;
        const expectedMonth2Balance = ( expectedMonth1Balance - 20 ) * 1.05;

        testSubject.MakeMinPayment( 0 );
        testSubject.MakePayment( 10, 0 );
        testSubject.ApplyInterest( 0 );
        expect( testSubject.GetBalanceAtMonth( 1 ) ).to.equal( expectedMonth1Balance );
        testSubject.MakeMinPayment( 1 );
        testSubject.ApplyInterest( 1 );
        expect( testSubject.GetBalanceAtMonth( 2 ) ).to.equal( expectedMonth2Balance );
    } );

    it( 'Getting balance of month beyond where most recent interest has been applied return undefined', () =>
    {
        expect( testSubject.GetBalanceAtMonth( 1 ) ).to.be.undefined;
        testSubject.ApplyInterest( 0 );
        expect( testSubject.GetBalanceAtMonth( 1 ) ).to.equal( 100 * 1.05 );
    } );

    it( "Can't ApplyInterest to any month other than the one after the last month to which to you applied interest", () =>
    {
        expect( () => testSubject.ApplyInterest( 1 ) ).to.throw();
        testSubject.ApplyInterest( 0 );
        expect( () => testSubject.ApplyInterest( 1 ) ).to.not.throw();
        expect( () => testSubject.ApplyInterest( 3 ) ).to.throw();
    } );

    it( 'Calling ApplyInterest on a mortgage just copies the current balance to next month', () =>
    {
        testSubject = new Debt( 'Mortgage', 250000, 0.05, 2000, true );
        expect( testSubject.GetBalanceAtMonth( 0 ) ).to.equal( 250000 );

        testSubject.MakeMinPayment( 0 );
        expect( testSubject.GetBalanceAtMonth( 1 ) ).to.be.undefined; // No balance has carried forward yet

        testSubject.ApplyInterest( 0 );

        expect( testSubject.GetBalanceAtMonth( 0 ) ).to.equal( 250000 - 2000 );
        expect( testSubject.GetBalanceAtMonth( 1 ) ).to.equal( 250000 - 2000 );
    } );
} );

describe( 'Income', () =>
{
    let testSubject: IIncome;
    let simulationStartDate: Date = new Date();
    let endDate: Date = new Date();

    beforeEach( () =>
    {
        simulationStartDate = new Date( 2019, 0 );
        endDate = new Date( 2150, 0 );
    } );

    it( 'Getting income value at month 0 returns the income value when start condition is Immediate', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        testSubject = new Income( 'Salary', 5000, IncomeStartCondition.Immediate, IncomeEndCondition.Date, simulationStartDate, endDate );
        expect( testSubject.GetValueAtMonth( 0 ) ).to.equal( 5000 );
    } );

    it( 'GetValueAtMonth check endDate boundary conditions', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        endDate = new Date( 2020, 1 );
        testSubject = new Income( 'Salary', 5000, IncomeStartCondition.Immediate, IncomeEndCondition.Date, simulationStartDate, endDate );
        expect( testSubject.GetValueAtMonth( 0 ) ).to.equal( 5000 );
        expect( testSubject.GetValueAtMonth( 1 ) ).to.equal( 5000 );
        expect( testSubject.GetValueAtMonth( 2 ) ).to.equal( 0 );
    } );

    it( 'Setting an incomeStartDate earlier than the startDate throws', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        endDate = new Date( 2020, 1 );
        testSubject = new Income( 'Pension', 5000, IncomeStartCondition.Retirement, IncomeEndCondition.Date, simulationStartDate, endDate );

        expect( () => testSubject.SetIncomeStartDate( new Date( 2019, 11 ) ) ).to.throw();
    } );

    it( 'Setting an incomeStartDate later than the endDate throws', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        endDate = new Date( 2020, 1 );
        testSubject = new Income( 'Pension', 5000, IncomeStartCondition.Retirement, IncomeEndCondition.Date, simulationStartDate, endDate );

        expect( () => testSubject.SetIncomeStartDate( new Date( 2020, 2 ) ) ).to.throw();
    } );

    it( 'Can get value in a month later than the start date even if end date is not yet defined', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        testSubject = new Income( 'Pension', 5000, IncomeStartCondition.Retirement, IncomeEndCondition.Date, simulationStartDate );

        testSubject.SetIncomeStartDate( addNMonthsToDate( simulationStartDate, 2 ) );

        expect( testSubject.GetValueAtMonth( 0 ) ).to.equal( 0 );
        expect( testSubject.GetValueAtMonth( 1 ) ).to.equal( 0 );
        expect( testSubject.GetValueAtMonth( 2 ) ).to.equal( 5000 );
        expect( testSubject.GetValueAtMonth( 3 ) ).to.equal( 5000 );
    } );
} );

describe( 'Forecast', () =>
{
    let debts: IDebt[];
    let incomes: IIncome[];

    beforeEach( () =>
    {
        debts = [
            new Debt( "A", 600, 0.14, 10, false ),
            new Debt( "B", 400, 0.15, 9, false ),
            new Debt( "C", 500, 0.16, 8, false ),
        ];

        incomes = [
            new Income( "Job", 100, IncomeStartCondition.Immediate, IncomeEndCondition.Date, new Date( 2020, 1, 1 ), new Date( 2025, 1, 1 ) ),
            new Income( "Pension", 100, IncomeStartCondition.Retirement, IncomeEndCondition.Date, new Date( 2025, 1, 1 ), new Date( 2030, 1, 1 ) )
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