import { expect } from "chai";
import { addNMonthsToDate } from "../helpers";
import { IncomeModel } from "../IncomeModel";
import { IIncome, IncomeStartCondition, IncomeEndCondition } from "../interfacesAndEnums";

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
        testSubject = new IncomeModel( 'Salary', 5000, IncomeStartCondition.Immediate, IncomeEndCondition.Date, simulationStartDate, endDate );
        expect( testSubject.GetValueAtMonth( 0 ) ).to.equal( 5000 );
    } );

    it( 'GetValueAtMonth check endDate boundary conditions', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        endDate = new Date( 2020, 1 );
        testSubject = new IncomeModel( 'Salary', 5000, IncomeStartCondition.Immediate, IncomeEndCondition.Date, simulationStartDate, endDate );
        expect( testSubject.GetValueAtMonth( 0 ) ).to.equal( 5000 );
        expect( testSubject.GetValueAtMonth( 1 ) ).to.equal( 5000 );
        expect( testSubject.GetValueAtMonth( 2 ) ).to.equal( 0 );
    } );

    it( 'Setting an incomeStartDate earlier than the startDate throws', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        endDate = new Date( 2020, 1 );
        testSubject = new IncomeModel( 'Pension', 5000, IncomeStartCondition.Retirement, IncomeEndCondition.Date, simulationStartDate, endDate );

        expect( () => testSubject.SetIncomeStartDate( new Date( 2019, 11 ) ) ).to.throw();
    } );

    it( 'Setting an incomeStartDate later than the endDate throws', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        endDate = new Date( 2020, 1 );
        testSubject = new IncomeModel( 'Pension', 5000, IncomeStartCondition.Retirement, IncomeEndCondition.Date, simulationStartDate, endDate );

        expect( () => testSubject.SetIncomeStartDate( new Date( 2020, 2 ) ) ).to.throw();
    } );

    it( 'Can get value in a month later than the start date even if end date is not yet defined', () =>
    {
        simulationStartDate = new Date( 2020, 0 );
        testSubject = new IncomeModel( 'Pension', 5000, IncomeStartCondition.Retirement, IncomeEndCondition.Date, simulationStartDate );

        testSubject.SetIncomeStartDate( addNMonthsToDate( simulationStartDate, 2 ) );

        expect( testSubject.GetValueAtMonth( 0 ) ).to.equal( 0 );
        expect( testSubject.GetValueAtMonth( 1 ) ).to.equal( 0 );
        expect( testSubject.GetValueAtMonth( 2 ) ).to.equal( 5000 );
        expect( testSubject.GetValueAtMonth( 3 ) ).to.equal( 5000 );
    } );
} );