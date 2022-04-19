/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { DebtModel } from '../DebtModel';
import { GetUnpaidDebtWithHighestInterest, GetUnpaidDebtWithLowestBalance, getRequiredSavingsToRetire } from '../forecast';
import { IncomeModel } from '../IncomeModel';
import { IDebtForCalculator, IIncomeForCalculator, IncomeStartCondition, IncomeEndCondition } from '../interfacesAndEnums';

describe( 'Forecast', () =>
{
  let debts: IDebtForCalculator[];
  let incomes: IIncomeForCalculator[];

  beforeEach( () =>
  {
    debts = [
      new DebtModel( {
        name: 'A',
        initialBalance: 600,
        interestRate: 0.14,
        minPayment: 10,
        isMortgage: false
      } ),
      new DebtModel( {
        name: 'B',
        initialBalance: 400,
        interestRate: 0.15,
        minPayment: 9,
        isMortgage: false
      } ),
      new DebtModel( {
        name: 'C',
        initialBalance: 500,
        interestRate: 0.16,
        minPayment: 8,
        isMortgage: false
      } ),
    ];

    incomes = [
      new IncomeModel( {
        name: 'Job',
        monthlyValue: 100,
        startCondition: IncomeStartCondition.Immediate,
        endCondition: IncomeEndCondition.Date,
        simulationStartDate: new Date( 2020, 1, 1 ),
        incomeEndDate: new Date( 2025, 1, 1 )
      } ),
      new IncomeModel( {
        name: 'Pension',
        monthlyValue: 100,
        startCondition: IncomeStartCondition.Retirement,
        endCondition: IncomeEndCondition.Date,
        simulationStartDate: new Date( 2025, 1, 1 ),
        incomeEndDate: new Date( 2030, 1, 1 )
      } )
    ];
  } );

  it( 'Get unpaid debt with highest interest rate', () =>
  {
    const actualDebt = GetUnpaidDebtWithHighestInterest( debts );
    expect( actualDebt ).to.not.be.null;
    expect( actualDebt?.name ?? false ).to.equal( 'C' );
  } );

  it( 'Get unpaid debt with lowest balance', () =>
  {
    const actualDebt = GetUnpaidDebtWithLowestBalance( debts );
    expect( actualDebt ).to.not.be.null;
    expect( actualDebt?.name ?? false ).to.equal( 'B' );
  } );

  it( 'Get unpaid debt with lowest balance after one is already paid off', () =>
  {
    debts[1].MakePayment( 500, 0 );

    const actualDebt = GetUnpaidDebtWithLowestBalance( debts );
    expect( actualDebt ).to.not.be.null;
    expect( actualDebt?.name ?? false ).to.equal( 'C' );
  } );

  it( 'getRequiredSavingsToRetire without pension', () =>
  {

    const desiredMonthlyBudgetPostRetirement = 500;
    const jobIncomeOnly = [incomes[0]];
    const actual = getRequiredSavingsToRetire( jobIncomeOnly, desiredMonthlyBudgetPostRetirement );

    expect( actual ).to.equal( 150000 );
  } );

  it( 'getRequiredSavingsToRetire with pension', () =>
  {

    const desiredMonthlyBudgetPostRetirement = 500;
    const actual = getRequiredSavingsToRetire( incomes, desiredMonthlyBudgetPostRetirement );

    expect( actual ).to.equal( 120000 );
  } );

  it( 'getRequiredSavingsToRetire with pensions that exceed the post retirement spending', () =>
  {

    const desiredMonthlyBudgetPostRetirement = 100;
    const actual = getRequiredSavingsToRetire( incomes, desiredMonthlyBudgetPostRetirement );

    expect( actual ).to.equal( 0 );
  } );


} );